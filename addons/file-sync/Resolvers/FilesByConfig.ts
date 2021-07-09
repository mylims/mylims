import ObjectId from '@ioc:Mongodb/ObjectId';

import { GqlResolvers, GqlSyncFileRevision } from 'App/graphql';

import { SyncFile } from '../Models/SyncFile';

const resolvers: GqlResolvers = {
  Query: {
    async filesByConfig(_, { configId }) {
      const syncFiles = await (
        await SyncFile.find({ '_id.configId': new ObjectId(configId) })
      ).all();
      return syncFiles.map<GqlSyncFileRevision>(
        ({ _id: { relativePath }, revisions }) => {
          const latestRevision = revisions[0];
          return {
            relativePath,
            revisionId: latestRevision.id,
            countRevisions: revisions.length,
            size: latestRevision.size,
            status: latestRevision.status,
            date: latestRevision.date,
          };
        },
      );
    },
  },
};

export default resolvers;
