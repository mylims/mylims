import { join } from 'path';

import escapeStr from 'escape-string-regexp';
import type { FilterQuery } from 'mongodb';

import Env from '@ioc:Adonis/Core/Env';
import ObjectId from '@ioc:Mongodb/ObjectId';

import { GqlResolvers, GqlSyncFileRevision } from 'App/graphql';

import { SyncFile } from '../Models/SyncFile';

const resolvers: GqlResolvers = {
  Query: {
    async filesByConfig(_, { configId, path, level }) {
      let query: FilterQuery<SyncFile> = {
        '_id.configId': new ObjectId(configId),
        level,
      };
      if (path) {
        query['_id.relativePath'] = {
          $regex: `^${join(...path.map((val) => escapeStr(val)))}`,
        };
      }
      const syncFiles = await (await SyncFile.find(query)).all();
      return syncFiles.map<GqlSyncFileRevision>(
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
    },
  },
};

export default resolvers;
