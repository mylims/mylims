import type { Filter } from 'mongodb';

import Env from '@ioc:Adonis/Core/Env';
import { UserInputError } from '@ioc:Zakodium/Apollo/Errors';
import { ModelAttributes, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import File from 'App/Models/File';
import { BaseMeasurement } from 'App/Models/Measurement/Base';
import { TransferMeasurement } from 'App/Models/Measurement/Transfer';
import { Sample } from 'App/Models/Sample';
import User from 'App/Models/User';
import {
  GqlMeasurementFilterInput,
  GqlMeasurementSortField,
  GqlMeasurementTypes,
  GqlResolvers,
  GqlSortDirection,
  Maybe,
} from 'App/graphql';
import {
  filterDate,
  filterTextArray,
  filterUser,
  NotReadOnly,
  removeNullable,
} from 'App/utils';

const measurements = {
  [GqlMeasurementTypes.TRANSFER]: TransferMeasurement,
};

const resolvers: GqlResolvers = {
  Measurement: {
    id: (measurement: BaseMeasurement): string => measurement._id.toHexString(),
    async file(parent) {
      const fileId = parent.fileId ?? null;
      if (!fileId) return null;
      const urlPath = 'measurements/file';
      const file = await File.findOrFail(fileId);
      return {
        downloadUrl: `${Env.get('BACKEND_URL')}/${urlPath}/${fileId}`,
        filename: file.filename,
        size: file.size,
      };
    },
    async user(measurement) {
      const user = await User.findBy('usernames', measurement.username);
      if (!user) {
        throw new UserInputError('User not found', { argumentName: 'userId' });
      }
      return user;
    },
  },
  Query: {
    async measurement(_, { id, type }) {
      const Measurement = measurements[type];
      const ans = await Measurement.find(new ObjectId(id));
      if (ans) {
        const rest = ans.toJSON() as BaseMeasurement;
        return {
          ...rest,
          type: type as GqlMeasurementTypes,
        };
      }
      throw new UserInputError('Id not found', { argumentName: 'id' });
    },
    async measurements(_, { type, limit, skip, filterBy, sortBy }) {
      const {
        field = GqlMeasurementSortField.CREATEDAT,
        direction = GqlSortDirection.DESC,
      } = sortBy || {};

      const query = await createFilter(filterBy);
      let measurementCursor = measurements[type]
        .query(query)
        .sortBy(field, direction === GqlSortDirection.DESC ? -1 : 1);
      const totalCount = await measurementCursor.count();
      if (skip) measurementCursor = measurementCursor.skip(skip);
      if (limit) measurementCursor = measurementCursor.limit(limit);

      const list = (await measurementCursor.all()).map((measurement) => {
        const rest = measurement.toJSON() as BaseMeasurement;
        return { ...rest, type };
      });
      return { list, totalCount };
    },
  },
  Mutation: {
    async createMeasurement(_, { input, sampleId, type }) {
      let sample = await Sample.find(new ObjectId(sampleId));
      if (!sample) {
        throw new UserInputError('Sample not found', {
          argumentName: 'sampleId',
        });
      }
      if (!sample.measurements) sample.measurements = [];
      const measurement = await measurements[type].create(
        removeNullable(input),
      );
      sample.measurements.push({
        id: measurement.id,
        date: new Date(),
        type,
      });
      await sample.save();
      const measurementBase = measurement.toJSON() as BaseMeasurement;
      return { ...measurementBase, type };
    },
  },
};

async function createFilter(
  filterBy: Maybe<GqlMeasurementFilterInput> | undefined,
): Promise<Filter<ModelAttributes<BaseMeasurement>>> {
  if (!filterBy) return {};

  let filter: Filter<NotReadOnly<ModelAttributes<BaseMeasurement>>> =
    filterTextArray('sampleCode', filterBy.sampleCode);
  filter.createdAt = filterDate(filterBy.createdAt);
  filter.userId = filterUser(filterBy.userId);

  return removeNullable(filter);
}

export default resolvers;
