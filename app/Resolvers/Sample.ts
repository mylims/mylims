import { Filter } from 'mongodb';

import Env from '@ioc:Adonis/Core/Env';
import { UserInputError } from '@ioc:Zakodium/Apollo/Errors';
import { ModelAttributes, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import File from 'App/Models/File';
import { BaseMeasurement } from 'App/Models/Measurement/Base';
import { TransferMeasurement } from 'App/Models/Measurement/Transfer';
import { Sample } from 'App/Models/Sample';
import { SampleKind } from 'App/Models/SampleKind';
import User from 'App/Models/User';
import {
  GqlMeasurementTypes,
  GqlResolvers,
  GqlSampleFilterInput,
  GqlSampleSortField,
  GqlSortDirection,
  Maybe,
} from 'App/graphql';
import {
  filterDate,
  filterMetaText,
  filterText,
  filterTextArray,
  filterUser,
  NotReadOnly,
  removeNullable,
} from 'App/utils';

const MEASUREMENTS = {
  [GqlMeasurementTypes.TRANSFER]: TransferMeasurement,
};
const resolvers: GqlResolvers = {
  Sample: {
    id: (sample: Sample): string => sample._id.toHexString(),
    async user(sample: Sample) {
      const user = await User.find(new ObjectId(sample.userId));
      if (!user) {
        throw new UserInputError('User not found', { argumentName: 'userId' });
      }
      return user;
    },
    async kind(sample: Sample) {
      const kind = await SampleKind.find(sample.kind);
      if (!kind) {
        throw new UserInputError('Sample kind not found', {
          argumentName: 'kind',
        });
      }
      return kind;
    },
    attachments(sample: Sample) {
      return Promise.all(
        sample.attachments.map(async (file) => {
          const attachment = await File.find(file.id);
          if (!attachment) {
            throw new UserInputError('Attachment not found', {
              argumentName: 'id',
            });
          }
          return {
            id: file.id,
            date: file.date,
            size: attachment.size,
            collection: attachment.collection,
            filename: attachment.filename,
            downloadUrl: `${Env.get('BACKEND_URL')}/measurements/file/${
              file.id
            }`,
          };
        }),
      );
    },
    measurements(sample: Sample) {
      return Promise.all(
        sample.measurements.map(async (measurement) => {
          const ans = await MEASUREMENTS[
            measurement.type as GqlMeasurementTypes
          ].find(measurement.id);
          if (!ans) {
            throw new UserInputError('Measurement not found', {
              argumentName: 'id',
            });
          }
          return {
            ...(ans.toJSON() as BaseMeasurement),
            type: measurement.type,
          };
        }),
      );
    },
    async parent(sample: Sample) {
      if (sample.parents.length === 0) return null;

      const parent = await Sample.find(new ObjectId(sample.parents[0]));
      if (!parent) {
        throw new UserInputError('Parent not found', {
          argumentName: 'parents',
        });
      }
      return parent;
    },
    async children(sample: Sample) {
      return Sample.query({ 'parents.0': sample._id }).all();
    },
  },
  SampleKind: {
    id: (sample: SampleKind): string => sample._id,
  },
  Query: {
    async sample(_, { id }) {
      const sample = await Sample.find(new ObjectId(id));
      if (sample) return sample;

      throw new UserInputError('Id not found', { argumentName: 'id' });
    },
    async samples(_, { kind, limit, skip, filterBy, sortBy }) {
      const sampleKind = await SampleKind.find(kind);
      if (!sampleKind) {
        throw new UserInputError('Sample kind not found', {
          argumentName: 'kind',
        });
      }

      const {
        field = GqlSampleSortField.CREATEDAT,
        direction = GqlSortDirection.DESC,
      } = sortBy || {};

      const filter = await createFilter(kind, filterBy);
      let sampleCursor = Sample.query(filter).sortBy(
        field,
        direction === GqlSortDirection.DESC ? -1 : 1,
      );
      const totalCount = await sampleCursor.count();
      if (skip) sampleCursor = sampleCursor.skip(skip);
      if (limit) sampleCursor = sampleCursor.limit(limit);

      const list = await sampleCursor.all();
      return { list, totalCount, kind: sampleKind };
    },
    async sampleKind(_, { id }) {
      const sampleKind = await SampleKind.find(id);
      if (sampleKind) return sampleKind;

      throw new UserInputError('Id not found', { argumentName: 'id' });
    },
  },
  Mutation: {
    async createSample(_, { input }) {
      return Sample.fromInput(new Sample(), input);
    },
    async createSamples(_, { samples }) {
      return Promise.all(
        samples.map((input) => Sample.fromInput(new Sample(), input)),
      );
    },
    async updateSample(_, { id, input }) {
      const sample = await Sample.find(new ObjectId(id));
      if (!sample) {
        throw new UserInputError('Id not found', { argumentName: 'id' });
      }

      return Sample.fromInput(sample, input);
    },
    async createSampleKind(_, { input }) {
      return SampleKind.fromInput(new SampleKind(), input);
    },
    async updateSampleKind(_, { id, input }) {
      const sample = await SampleKind.find(id);
      if (!sample) {
        throw new UserInputError('Id not found', { argumentName: 'id' });
      }

      return SampleKind.fromInput(sample, input);
    },
  },
};

async function createFilter(
  kind: string,
  filterBy: Maybe<GqlSampleFilterInput> | undefined,
): Promise<Filter<ModelAttributes<Sample>>> {
  if (!filterBy) return {};

  let filter: Filter<NotReadOnly<ModelAttributes<Sample>>> = filterTextArray(
    'sampleCode',
    filterBy.sampleCode,
  );
  filter.kind = kind;
  filter.labels = filterText(filterBy.labels);
  filter.project = filterText(filterBy.project);
  filter.title = filterText(filterBy.title);
  filter.comment = filterText(filterBy.comment);
  filter.createdAt = filterDate(filterBy.createdAt);
  filter.userId = filterUser(filterBy.userId);

  return removeNullable({ ...filter, ...filterMetaText(filterBy.meta) });
}

export default resolvers;
