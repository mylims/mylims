import { readFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand } from '@adonisjs/core/build/standalone';
// eslint-disable-next-line import/no-unassigned-import
import 'dotenv/config';
import got from 'got';

import type DataDrive from '@ioc:Zakodium/DataDrive';

import { GqlSampleInput } from 'App/graphql';

import type FileModel from '../../../app/Models/File';
import { Sample as SampleModel } from '../../../app/Models/Sample';
import UserModel from '../../../app/Models/User';

type SlimsForeignKey = Record<
  'displayValue' | 'value' | 'foreignTable',
  string
>;
type SlimsSample = Record<string, string | SlimsForeignKey>;
interface SlimsEntity {
  pk: string;
  columns: Array<
    Record<
      | 'datatype'
      | 'title'
      | 'value'
      | 'displayValue'
      | 'hidden'
      | 'foreignTable',
      string
    >
  >;
}

const EXCLUDED_FIELDS = [
  'barcode',
  'category',
  'group',
  'growthInformation',
  'icon',
  'id',
  'locatedAtColumn',
  'locatedAtRow',
  'locationDefault',
  'locationPath',
  'slimsStatus',
  'attachment',
  'map',
];
export default class Migrate extends BaseCommand {
  public static commandName = 'powerlab:migrate';
  public static description = 'Migrate from slims the samples';

  private readonly baseUrl = 'http://slims-powerlab.epfl.ch/powerlabrest/rest';

  public static settings = { loadApp: true };

  private deps: {
    Sample: typeof SampleModel;
    File: typeof FileModel;
    User: typeof UserModel;
    DataDrive: typeof DataDrive;
  };

  public async run() {
    const { Sample } = await import('../../../app/Models/Sample');
    const { default: File } = await import('../../../app/Models/File');
    const { default: User } = await import('../../../app/Models/User');
    const { default: DataDrive } = await import('@ioc:Zakodium/DataDrive');

    this.deps = { Sample, File, User, DataDrive };

    await this.executeImporter();
  }

  /**
   * Main function to import samples from slims
   */
  private async executeImporter() {
    this.logger.info('Starting migration');

    // Pull all samples from slims API
    const rawSamples: SlimsEntity[] = JSON.parse(
      readFileSync(join(__dirname, '../testFiles/slims-content.json'), 'utf8'),
    );
    this.logger.info(`${rawSamples.length} samples loaded`);

    // Both of this elements where stored physically as files
    let migratedSamples: SlimsSample[] = [];
    let foreign: Record<string, string[]> = {};
    for (const rawSample of rawSamples) {
      let newItem: SlimsSample = { id: rawSample.pk };
      for (const {
        title,
        hidden,
        displayValue,
        value,
        datatype,
        foreignTable,
      } of rawSample.columns) {
        const val = displayValue || value;
        // Remove brackets, make it camelCase and remove spaces
        const key = title
          .replace(/\([^()]*\)/g, '')
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase(),
          )
          .replace(/\s+/g, '')
          .trim();
        if (!hidden && val && !EXCLUDED_FIELDS.includes(key)) {
          newItem[key] = val;

          if (datatype === 'FOREIGN_KEY') {
            newItem[key] = { displayValue, value, foreignTable };
            // Stores foreign keys to be used later
            if (foreign[foreignTable]) {
              if (!foreign[foreignTable].includes(value)) {
                foreign[foreignTable].push(value);
              }
            } else {
              foreign[foreignTable] = [value];
            }
          }
        }
      }
      migratedSamples.push(newItem);
    }

    // Gets the bases of the samples, only missing the parent relationship
    const { wafers, samples, devices } = await this.formatSamples(
      migratedSamples,
    );

    // Save wafers
    const savedWafers = await this.saveSamples(wafers, 'wafers');

    // Save samples
    const samplesLinked = samples.map(
      (sample: GqlSampleInput): GqlSampleInput | null => {
        const {
          sampleCode,
          meta: { originalContent, slimsId, status },
        } = sample;

        // Search for the parent element
        let wafer: SampleModel | undefined =
          sampleCode[0] !== undefined ? savedWafers[sampleCode[0]] : undefined;
        if (!wafer) {
          wafer = Object.values(savedWafers).find(
            (wafer) =>
              wafer.meta.slimsId ===
              (originalContent as SlimsForeignKey)?.value,
          );
          if (!wafer) {
            this.logger.error(
              `Could not find wafer for sample ${slimsId as string}`,
            );
            return null;
          }
        }
        return {
          ...sample,
          meta: { ...sample.meta, reserved: status === 'Reserved' },
          parent: wafer.id.toHexString(),
        };
      },
    );
    const savedSamples = await this.saveSamples(samplesLinked, 'samples');

    // Save devices
    const devicesLinked = devices.map(
      (sample: GqlSampleInput): GqlSampleInput | null => {
        const {
          sampleCode,
          meta: { originalContent, slimsId },
        } = sample;

        // Search for the parent element
        const parentCode = `${sampleCode[0]}_${sampleCode[1]}`;
        let parent: SampleModel | undefined = savedSamples[parentCode];
        if (!parent) {
          parent = Object.values(savedSamples).find(
            (sample) =>
              sample.meta.slimsId ===
              (originalContent as SlimsForeignKey)?.value,
          );
          if (!parent) {
            this.logger.error(`Could not find sample for device ${slimsId}`);
            return null;
          }
        }
        return { ...sample, parent: parent.id.toHexString() };
      },
    );
    await this.saveSamples(devicesLinked, 'devices');

    // Pull attachments from slims API
    this.logger.info('Finished migration');
  }

  /**
   * Splits the samples into wafers and samples and format the general cases
   * @param input - All elements from the slims API
   * @returns Classified elements with attachments saved
   */
  private async formatSamples(
    input: SlimsSample[],
  ): Promise<Record<'wafers' | 'samples' | 'devices', GqlSampleInput[]>> {
    this.logger.info('Fetch files from slims');
    let wafers: GqlSampleInput[] = [];
    let samples: GqlSampleInput[] = [];
    let devices: GqlSampleInput[] = [];

    for (const {
      waferName,
      sampleName,
      subSampleName,
      createdBy,
      comment,
      type,
      id,
      epiStructure,
      ...meta
    } of input) {
      const drive = this.deps.DataDrive.use('files');
      const options = {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        https: { rejectUnauthorized: false },
      };

      // Get the list of attachments from slims
      const { entities } = await got
        .get(`${this.baseUrl}/attachment/content/${id as string}`, options)
        .json<{ entities: SlimsEntity[] }>();

      // Get the files from slims
      interface AttachmentItem {
        fileName: string;
        buffer: Buffer;
      }
      const attachmentIds = await Promise.all(
        entities.map(async ({ pk }) => {
          const { headers, body: buffer } = await got.get(
            `${this.baseUrl}/repo/${pk}`,
            { ...options, responseType: 'buffer' },
          );
          const fileName = headers['content-disposition']
            ?.split(';')[1]
            .split('=')[1]
            .replace(/"/g, '')
            .trim();
          if (fileName) {
            return { fileName, buffer };
          } else {
            return null;
          }
        }),
      );
      // Store the attachments in the database
      const attachments = await Promise.all(
        attachmentIds
          .filter((id): id is AttachmentItem => id !== null)
          .map(async ({ fileName, buffer }) => {
            const driveFile = await drive.put(fileName, buffer);
            const { id } = await this.deps.File.create({
              _id: driveFile.id,
              filename: driveFile.filename,
              size: driveFile.size,
            });
            return id;
          }),
      );

      // Searches user or creates it
      let localUser = await this.deps.User.findBy(
        'usernames',
        createdBy as string,
      );
      if (!localUser) {
        localUser = await this.deps.User.create({
          usernames: [createdBy as string],
          emails: [`${createdBy as string}@epfl.ch`],
          role: 'MEMBER',
        });
      }

      // Format the sample
      const kind = (type as SlimsForeignKey).displayValue;
      const sampleInput: Omit<GqlSampleInput, 'kind' | 'sampleCode'> = {
        userId: localUser.id.toHexString(),
        labels: ['migrated'],
        meta: { ...meta, slimsId: id, legacyContent: epiStructure, createdBy },
        comment: comment as string,
        attachments,
      };

      // Chooses the kind of sample
      switch (kind) {
        case 'Wafer': {
          wafers.push({
            ...sampleInput,
            kind: 'wafer',
            sampleCode: [waferName as string],
          });
          break;
        }
        case 'Sample': {
          samples.push({
            ...sampleInput,
            kind: 'sample',
            sampleCode: [waferName as string, sampleName as string],
          });
          break;
        }
        case 'Sub sample': {
          devices.push({
            ...sampleInput,
            kind: 'device',
            sampleCode: [
              waferName as string,
              sampleName as string,
              subSampleName as string,
            ],
          });
          break;
        }
        default: {
          this.logger.error(`Unknown kind ${kind} for sample ${id as string}`);
          break;
        }
      }
    }
    return { wafers, samples, devices };
  }

  /**
   * Saves the samples to the database and shows the errors and warnings
   * @param samples - Samples to save
   * @param kind - Kind of the samples
   * @returns Saved samples
   */
  private async saveSamples(
    samples: Array<GqlSampleInput | null>,
    kind: string,
  ) {
    let errors = 0;
    let result: Record<string, SampleModel> = {};
    let duplicates = 0;
    for (const sample of samples) {
      if (!sample) {
        errors++;
      } else {
        try {
          const saved = await this.deps.Sample.fromInput(
            new this.deps.Sample(),
            sample,
          );
          const sampleCode = saved.sampleCode.join('_');
          if (result[sampleCode]) {
            this.logger.debug(`Duplicate ${kind}: ${sampleCode}`);
            duplicates++;
          }
          result[sampleCode] = saved;
        } catch (error) {
          errors++;
          this.logger.error(error);
        }
      }
    }
    this.logger.info(
      `${samples.length} ${kind} founded, ${
        Object.keys(result).length
      } migrated, ${errors} errors, and ${duplicates} duplicates`,
    );
    return result;
  }
}
