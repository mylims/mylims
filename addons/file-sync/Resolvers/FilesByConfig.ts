import { join } from 'path';

import escapeStr from 'escape-string-regexp';
import type { FilterQuery } from 'mongodb';

import Env from '@ioc:Adonis/Core/Env';
import ObjectId from '@ioc:Mongodb/ObjectId';

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
      const absolutePath = escapeStr(join(...path));
      const latestPath = path[path.length - 1];

      // Queries for files by configId and path
      let fileQuery: FilterQuery<SyncFile> = {
        '_id.configId': new ObjectId(configId),
        path: { $size: path.length },
      };
      if (path.length > 0) {
        fileQuery['_id.relativePath'] = {
          $regex: new RegExp(`^${absolutePath}`),
        };
        fileQuery[`path.${path.length - 1}`] = latestPath;
      }
      const syncFiles = await (await SyncFile.find(fileQuery)).all();
      const files = syncFiles.map<GqlSyncFileRevision>(
        ({ _id: { relativePath }, revisions }) => {
          const latestRevision = revisions[0];
          const urlPath = 'addons/file-sync/file-content';
          return {
            relativePath,
            revisionId: latestRevision.id,
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
        pathIndex: path.length,
        revisionsIndex: 0,
      };
      if (path.length > 0) {
        dirQuery['_id.relativePath'] = {
          $regex: new RegExp(`^${absolutePath}`),
        };
      }
      const dirs = await (
        await SyncFile.getCollection()
      )
        .aggregate<AggregateFilesByConfig>([
          {
            $unwind: {
              path: '$revisions',
              includeArrayIndex: 'revisionsIndex',
              preserveNullAndEmptyArrays: false,
            },
          },
          {
            $unwind: {
              path: '$path',
              includeArrayIndex: 'pathIndex',
              preserveNullAndEmptyArrays: false,
            },
          },
          { $match: dirQuery },
          {
            $group: {
              _id: '$path',
              size: { $sum: '$revisions.size' },
              date: { $last: '$revisions.date' },
            },
          },
        ])
        .map(({ _id, size, date }) => ({ relativePath: _id, date, size }))
        .toArray();

      return { files, dirs };
    },
  },
};

export default resolvers;
