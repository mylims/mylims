import Env from '@ioc:Adonis/Core/Env';
import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { GqlResolvers, GqlSyncFileRevision } from 'App/graphql';

import { SyncFile } from '../Models/SyncFile';

interface AggregateFilesByConfig {
  _id: string;
  size: number;
  date: Date;
}

const resolvers: GqlResolvers = {
  Query: {
    async filesByConfig(_, { configId, path }) {
      // Queries for files by configId and path
      const syncFiles = await SyncFile.query({
        '_id.configId': new ObjectId(configId),
        path,
      }).all();
      const files = syncFiles.map<GqlSyncFileRevision>(
        ({ _id: { relativePath }, revisions, filename }) => {
          const latestRevision = revisions[0];
          const urlPath = 'addons/file-sync/file-content';
          return {
            relativePath,
            path,
            filename,
            id: latestRevision.id,
            countRevisions: revisions.length,
            size: latestRevision.size,
            status: latestRevision.status,
            date: latestRevision.date,
            downloadUrl: `${Env.get('BACKEND_URL')}/${urlPath}?id=${
              latestRevision.id
            }`,
          };
        },
      );

      // Queries for directories for configId and path
      let dirQuery: Record<string, unknown> = {
        '_id.configId': new ObjectId(configId),
      };
      for (let index = 0; index < path.length; index++) {
        dirQuery[`path.${index}`] = path[index];
      }
      dirQuery[`path.${path.length}`] = { $exists: true };

      const dirs = await (
        await SyncFile.getCollection()
      )
        .aggregate<AggregateFilesByConfig>([
          { $match: dirQuery },
          {
            $project: {
              firstRevision: { $first: '$revisions' },
              nextPath: { $arrayElemAt: ['$path', path.length] },
            },
          },
          {
            $group: {
              _id: '$nextPath',
              size: { $sum: '$firstRevision.size' },
              date: { $last: '$firstRevision.date' },
            },
          },
        ])
        .map(({ _id, size, date }) => ({
          id: _id,
          relativePath: _id,
          date,
          size,
          path,
        }))
        .toArray();

      return { _id: `${configId}:root/${path.join('/')}`, files, dirs };
    },
  },
};

export default resolvers;
