import { Filter } from 'mongodb';

import Env from '@ioc:Adonis/Core/Env';
import { UserInputError } from '@ioc:Zakodium/Apollo/Errors';
import { ModelAttributes, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import File from 'App/Models/File';
import { Sample } from 'App/Models/Sample';
import { SampleKind } from 'App/Models/SampleKind';
import User from 'App/Models/User';
import { removeNullable } from 'App/Resolvers/utils';
import {
  GqlResolvers,
  GqlSampleFilterInput,
  GqlSampleKind,
  GqlSampleSortField,
  GqlSortDirection,
  Maybe,
} from 'App/graphql';

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
            date: file.date,
            id: file.id,
            filename: attachment.filename,
            size: attachment.size,
            downloadUrl: `${Env.get('BACKEND_URL')}/measurements/file/${
              file.id
            }`,
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
  Query: {
    async sample(_, { id }) {
      const ans = await Sample.find(new ObjectId(id));
      if (ans) return ans.toJSON() as Sample;

      throw new UserInputError('Id not found', { argumentName: 'id' });
    },
    async samples(_, { limit, skip, filterBy, sortBy }) {
      const {
        field = GqlSampleSortField.CREATEDAT,
        direction = GqlSortDirection.DESC,
      } = sortBy || {};

      const filter = await createFilter(filterBy);
      let sampleCursor = Sample.query(filter).sortBy(
        field,
        direction === GqlSortDirection.DESC ? -1 : 1,
      );
      const totalCount = await sampleCursor.count();
      if (skip) sampleCursor = sampleCursor.skip(skip);
      if (limit) sampleCursor = sampleCursor.limit(limit);

      const list = (await sampleCursor.all()).map((sample) => {
        return sample.toJSON() as Sample;
      });
      return { list, totalCount };
    },
    async sampleKind(_, { id }) {
      const ans = await SampleKind.find(id);
      if (ans) return ans.toJSON() as GqlSampleKind;

      throw new UserInputError('Id not found', { argumentName: 'id' });
    },
  },
  Mutation: {
    async createSample(_, { input }) {
      const sample = await Sample.fromInput(new Sample(), input);
      return sample.toJSON() as Sample;
    },
    async updateSample(_, { id, input }) {
      let sample = await Sample.find(new ObjectId(id));
      if (!sample) {
        throw new UserInputError('Id not found', { argumentName: 'id' });
      }

      sample = await Sample.fromInput(sample, input);
      return sample.toJSON() as Sample;
    },
    async createSampleKind(_, { input }) {
      const sample = await SampleKind.fromInput(new SampleKind(), input);
      return sample.toJSON() as SampleKind;
    },
    async updateSampleKind(_, { id, input }) {
      let sample = await SampleKind.find(id);
      if (!sample) {
        throw new UserInputError('Id not found', { argumentName: 'id' });
      }

      sample = await SampleKind.fromInput(sample, input);
      return sample.toJSON() as SampleKind;
    },
  },
};

async function createFilter(
  filterBy: Maybe<GqlSampleFilterInput> | undefined,
): Promise<Filter<ModelAttributes<Sample>>> {
  if (!filterBy) return {};

  let filter: Filter<ModelAttributes<Sample>> = removeNullable(filterBy);

  if (filterBy.username) {
    const user = await User.findBy('username', filterBy.username);
    if (!user) {
      throw new UserInputError('Username not found', {
        argumentName: 'username',
      });
    }
    filter.userId = user._id.toHexString();
  }
  if (filterBy.parent) {
    const parent = await Sample.find(new ObjectId(filterBy.parent));
    if (!parent) {
      throw new UserInputError('Parent not found', {
        argumentName: 'parent',
      });
    }
    filter['parents.0'] = parent._id.toHexString();
  }
  return filter;
}

export default resolvers;
