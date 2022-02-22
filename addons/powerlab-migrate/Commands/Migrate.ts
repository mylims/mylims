import { readFileSync } from 'fs';
import { join } from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import { BaseCommand } from '@adonisjs/core/build/standalone';

import { GqlSampleInput } from 'App/graphql';

import { Sample as SampleModel } from '../../../app/Models/Sample';

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
];
export default class Migrate extends BaseCommand {
  public static commandName = 'powerlab:migrate';
  public static description = 'Migrate from slims the samples';

  public static settings = { loadApp: true };

  private deps: {
    Sample: typeof SampleModel;
  };

  public async run() {
    const { Sample } = await import('../../../app/Models/Sample');

    this.deps = { Sample };

    await this.executeImporter();
  }

  private async executeImporter() {
    this.logger.info('Starting migration');

    // Pull all samples from slims API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawSamples: Record<string, any>[] = JSON.parse(
      readFileSync(join(__dirname, '../testFiles/slims-content.json'), 'utf8'),
    );
    this.logger.info(`${rawSamples.length} samples loaded`);

    type SlimsSample = Record<
      string,
      string | Record<'displayValue' | 'value' | 'foreignTable', string>
    >;
    let migratedSamples: SlimsSample[] = [];
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
        const key = (title as string)
          .replace(/\([^()]*\)/g, '')
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase(),
          )
          .replace(/\s+/g, '')
          .trim();
        if (!hidden && val && !EXCLUDED_FIELDS.includes(key)) {
          newItem[key] =
            datatype === 'FOREIGN_KEY'
              ? { displayValue, value, foreignTable }
              : val;
        }
      }
      migratedSamples.push(newItem);
    }
    this.logger.info('Format migrated samples');

    // Save wafers
    const wafers = migratedSamples
      .filter(
        (sample: SlimsSample) =>
          typeof sample.type !== 'string' &&
          sample.type.displayValue === 'Wafer',
      )
      .map((sample: SlimsSample): GqlSampleInput => {
        const { waferName = 'unknown', user, comment, type, ...meta } = sample;
        return {
          sampleCode: [waferName as string],
          userId: '60e4109845369858e8c84855',
          project: 'migration',
          kind: 'wafer',
          labels: [],
          meta,
          comment: comment as string,
          attachments: [],
        };
      });
    const savedWafers = await this.saveSamples(wafers, 'wafers');

    // Save samples
    const samples = migratedSamples
      .filter(
        (sample: SlimsSample) =>
          typeof sample.type !== 'string' &&
          sample.type.displayValue === 'Sample',
      )
      .map((sample: SlimsSample): GqlSampleInput | null => {
        const {
          waferName = 'unknown',
          sampleName = 'unknown',
          user,
          comment,
          type,
          ...meta
        } = sample;
        const wafer = savedWafers[waferName as string];
        if (!wafer) {
          this.logger.debug(`Wafer ${waferName as string} not found`);
          return null;
        }
        // TODO: pull info from [map, originalContent]
        return {
          sampleCode: [waferName as string, sampleName as string],
          userId: '60e4109845369858e8c84855',
          project: 'migration',
          kind: 'sample',
          labels: [],
          meta,
          comment: comment as string,
          attachments: [],
          parent: wafer.id.toHexString(),
        };
      });
    const savedSamples = await this.saveSamples(samples, 'samples');

    // Save devices
    const devices = migratedSamples
      .filter(
        (sample: SlimsSample) =>
          typeof sample.type !== 'string' &&
          sample.type.displayValue === 'Sub sample',
      )
      .map((sample: SlimsSample): GqlSampleInput | null => {
        const {
          waferName = 'unknown',
          sampleName = 'unknown',
          subSampleName = 'unknown',
          user,
          comment,
          type,
          ...meta
        } = sample;
        const parentCode = `${waferName as string}_${sampleName as string}`;
        const parent = savedSamples[parentCode];
        if (!parent) {
          this.logger.debug(`Device ${parentCode} not found`);
          return null;
        }
        // TODO: pull info from [originalContent]
        return {
          sampleCode: [
            waferName as string,
            sampleName as string,
            subSampleName as string,
          ],
          userId: '60e4109845369858e8c84855',
          project: 'migration',
          kind: 'device',
          labels: [],
          meta,
          comment: comment as string,
          attachments: [],
          parent: parent.id.toHexString(),
        };
      });
    await this.saveSamples(devices, 'devices');

    // Pull attachments from slims API
    this.logger.info('Finished migration');
  }

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
