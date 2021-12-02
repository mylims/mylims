import Env from '@ioc:Adonis/Core/Env';
import { UserInputError } from '@ioc:Zakodium/Apollo/Errors';
import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import File from 'App/Models/File';
import { TransferMeasurement } from 'App/Models/Measurement/Transfer';
import { removeNullable } from 'App/Resolvers/utils';
import {
  GqlMeasurement,
  GqlMeasurementSortField,
  GqlMeasurementTypes,
  GqlResolvers,
  GqlSortDirection,
} from 'App/graphql';

const measurements = {
  [GqlMeasurementTypes.TRANSFER]: TransferMeasurement,
};
type MeasurementType = Omit<GqlMeasurement, 'id' | 'file'> & {
  _id: ObjectId;
  fileId?: string;
};

const resolvers: GqlResolvers = {
  Measurement: {
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
  },
  Query: {
    async measurement(_, { id, type }) {
      const Measurement = measurements[type];
      const ans = await Measurement.find(new ObjectId(id));
      if (ans) {
        const { _id, ...rest } = ans.toJSON() as MeasurementType;
        return {
          ...rest,
          id: _id.toHexString(),
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

      let measurementCursor = measurements[type]
        .query(removeNullable(filterBy ?? {}))
        .sortBy(field, direction === GqlSortDirection.DESC ? -1 : 1);
      const totalCount = await measurementCursor.count();
      if (skip) measurementCursor = measurementCursor.skip(skip);
      if (limit) measurementCursor = measurementCursor.limit(limit);

      const list = (await measurementCursor.all()).map((measurement) => {
        const { _id, ...rest } = measurement.toJSON() as MeasurementType;
        return { ...rest, id: _id.toHexString(), type };
      });
      return { list, totalCount };
    },
  },
};

export default resolvers;
