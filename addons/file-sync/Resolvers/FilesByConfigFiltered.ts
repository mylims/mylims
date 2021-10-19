import escapeStringRegexp from 'escape-string-regexp';
import type { Filter } from 'mongodb';

import Env from '@ioc:Adonis/Core/Env';
import { ModelAttributes, ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import {
  GqlResolvers,
  GqlSyncFileRevision,
  GqlFilesSortField,
  GqlSortDirection,
} from 'App/graphql';

import { SyncFile } from '../Models/SyncFile';

const resolvers: GqlResolvers = {
  Query: {
    async filesByConfigFlat(_, { id, limit, skip, filterBy, sortBy }) {
      const {
        filename,
        minSize = 0,
        maxSize = Infinity,
        minDate = new Date(0),
        maxDate = new Date(Date.now()),
        status = [],
      } = filterBy || {};
      const {
        field = GqlFilesSortField.DATE,
        direction = GqlSortDirection.DESC,
      } = sortBy || {};
      const sortField = field === 'filename' ? field : `revisions.0.${field}`;

      let query: Filter<ModelAttributes<SyncFile>> = {
        '_id.configId': new ObjectId(id),
        'revisions.0.size': { $gte: minSize, $lte: maxSize },
        'revisions.0.date': { $gte: minDate, $lte: maxDate },
      };
      if (status && status.length !== 0) {
        query['revisions.0.status'] = { $in: status };
      }
      if (filename) {
        query['_id.relativePath'] = {
          $regex: escapeStringRegexp(filename),
          $options: 'i',
        };
      }
      let fileCursor = SyncFile.query(query).sortBy(
        sortField,
        direction === GqlSortDirection.DESC ? -1 : 1,
      );
      const totalCount = await fileCursor.count();

      if (skip) fileCursor = fileCursor.skip(skip);
      if (limit) fileCursor = fileCursor.limit(limit);

      const files = (await fileCursor.all()).map<GqlSyncFileRevision>(
        ({ _id: { relativePath }, revisions, filename, path }) => {
          const { id, size, date, status } = revisions[0];
          const urlPath = 'addons/file-sync/file-content';
          return {
            relativePath,
            path,
            filename,
            id,
            countRevisions: revisions.length,
            size,
            status,
            date,
            downloadUrl: `${Env.get('BACKEND_URL')}/${urlPath}?id=${id}`,
          };
        },
      );
      return {
        files,
        totalCount,
      };
    },
  },
};

export default resolvers;
