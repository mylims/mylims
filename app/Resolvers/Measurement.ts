import type { Filter } from 'mongodb';

import Env from '@ioc:Adonis/Core/Env';
import { UserInputError } from '@ioc:Zakodium/Apollo/Errors';
import { ModelAttributes, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import File from 'App/Models/File';
import { BaseMeasurement } from 'App/Models/Measurement/Base';
import { TransferMeasurement } from 'App/Models/Measurement/Transfer';
import { XRayMeasurement } from 'App/Models/Measurement/XRay';
import Notebook from 'App/Models/Notebook';
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

export const MEASUREMENTS = {
  [GqlMeasurementTypes.TRANSFER]: TransferMeasurement,
  [GqlMeasurementTypes.XRAY]: XRayMeasurement,
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
        size: file.size,
        filename: file.filename,
        downloadUrl: `${Env.get('BACKEND_URL')}/${urlPath}/${fileId}`,
      };
    },
    async user(measurement) {
      const user = await User.findBy('usernames', measurement.username);
      if (!user) {
        throw new UserInputError('User not found', { argumentName: 'userId' });
      }
      return user;
    },
    async sample(measurement) {
      const sample = await Sample.find(measurement.sampleId);
      if (!sample) {
        throw new UserInputError('Sample not found', {
          argumentName: 'sampleId',
        });
      }
      return sample;
    },
  },
  Query: {
    async measurement(_, { id, type }) {
      const Measurement = MEASUREMENTS[type];
      const ans = await Measurement.find(new ObjectId(id));
      if (ans) {
        const rest = ans.toJSON() as BaseMeasurement;
        return { ...rest, type };
      }
      throw new UserInputError('Id not found', { argumentName: 'id' });
    },
    async measurements(_, { type, limit, skip, filterBy, sortBy }) {
      const {
        field = GqlMeasurementSortField.CREATEDAT,
        direction = GqlSortDirection.DESC,
      } = sortBy || {};

      const query = await createFilter(filterBy);
      let measurementCursor = MEASUREMENTS[type]
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
    async measurementsByNotebook(_, { notebookId, fileName, project, limit }) {
      const notebook = await Notebook.find(new ObjectId(notebookId));
      if (!notebook) {
        throw new UserInputError('Notebook not found', { argumentName: 'id' });
      }

      let measurements: BaseMeasurement[] = [];
      for (const sampleId of notebook.samples) {
        const sample = await Sample.find(new ObjectId(sampleId));
        // Check if the sample exists and contains the project
        if (
          sample &&
          (project
            ? sample.project && new RegExp(project).exec(sample.project)
            : true)
        ) {
          const sampleMeasurements = await Promise.all(
            sample.measurements.map(async ({ type, id }) => {
              const ans = await MEASUREMENTS[
                type as GqlMeasurementTypes
              ].findOrFail(id);
              const rest = ans.toJSON() as BaseMeasurement;
              return { ...rest, type };
            }),
          );
          measurements = measurements.concat(sampleMeasurements);
        }
      }

      if (fileName) {
        const fileNames = await Promise.all(
          measurements.map(({ fileId }) => {
            if (!fileId) return Promise.resolve(null);
            return File.findOrFail(fileId);
          }),
        );
        let filteredByFile: BaseMeasurement[] = [];
        for (let i = 0; i < measurements.length; i++) {
          const file = fileNames[i];
          if (file && new RegExp(fileName).exec(file.filename)) {
            filteredByFile.push(measurements[i]);
          }
        }
        measurements = filteredByFile;
      }

      if (limit && measurements.length > limit) {
        measurements.length = limit;
      }

      return { list: measurements, totalCount: measurements.length };
    },
  },
  Mutation: {
    async createMeasurement(_, { input, sampleId: sampleCode, type }) {
      const sampleId = new ObjectId(sampleCode);
      let sample = await Sample.find(sampleId);
      if (!sample) {
        throw new UserInputError('Sample not found', {
          argumentName: 'sampleId',
        });
      }
      if (!sample.measurements) sample.measurements = [];
      const user = await User.find(new ObjectId(input.userId));
      if (!user) {
        throw new UserInputError('User not found', { argumentName: 'userId' });
      }
      const measurement = await MEASUREMENTS[type].create(
        removeNullable({
          ...input,
          username: user.usernames[0],
          sampleId,
          eventId: input.eventId ? new ObjectId(input.eventId) : undefined,
          createdBy: new ObjectId(input.userId),
        }),
      );
      sample.measurements.push({ id: measurement.id, date: new Date(), type });
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
