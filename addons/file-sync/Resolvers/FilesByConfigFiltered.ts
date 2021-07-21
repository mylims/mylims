import Env from '@ioc:Adonis/Core/Env';
import ObjectId from '@ioc:Mongodb/ObjectId';

import { GqlResolvers, GqlSyncFileRevision, GqlFileStatus } from 'App/graphql';

import { SyncFile } from '../Models/SyncFile';

const resolvers: GqlResolvers = {
  Query: {
    async filesByConfigFiltered(_, { id, limit, skip, filterBy, sortBy }) {
      const {
        minSize = 0,
        maxSize = Infinity,
        minDate = new Date(0),
        maxDate = new Date(Date.now()),
        status = [GqlFileStatus.IMPORTED],
      } = filterBy || {};
      const { field = 'date', direction = 'desc' } = sortBy || {};
      const sortField = field === 'filename' ? field : `revisions.0.${field}`;

      let fileCursor = (await SyncFile.getCollection())
        .find({
          '_id.configId': new ObjectId(id),
          'revisions.0.size': { $gte: minSize, $lte: maxSize },
          'revisions.0.date': { $gte: minDate, $lte: maxDate },
          'revisions.0.status': { $in: status },
        })
        .sort({ [sortField]: direction === 'desc' ? -1 : 1 });
      const totalCount = await fileCursor.count();

      if (skip && limit) {
        fileCursor = fileCursor.skip(skip).limit(limit);
      }
      const files = (await fileCursor.toArray()).map<GqlSyncFileRevision>(
        ({ _id: { relativePath }, revisions, filename, path }) => {
          const { id, size, date, status } = revisions[0];
          const urlPath = 'addons/file-sync/file-content';
          return {
            relativePath,
            path,
            filename,
            revisionId: id,
            countRevisions: revisions.length,
            size,
            status,
            date,
            downloadUrl: `${Env.get('BACKEND_URL')}/${urlPath}?id=${id}`,
          };
        },
      );
      return {
        _id: [
          minSize,
          maxSize,
          minDate?.toLocaleDateString('fr-ch') || '',
          maxDate?.toLocaleDateString('fr-ch') || '',
          status,
        ].join(','),
        files,
        totalCount,
      };
    },
  },
};

export default resolvers;
