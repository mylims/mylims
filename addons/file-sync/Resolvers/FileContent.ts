import DataDrive from '@ioc:DataDrive';

import { GqlResolvers } from 'App/graphql';

import { File } from '../Models/File';
import { SyncFile } from '../Models/SyncFile';

const resolvers: GqlResolvers = {
  Query: {
    async fileByPath(_, { path }) {
      const [syncFile] = await (
        await SyncFile.find({ '_id.relativePath': path })
      ).all();
      const file = await File.findByIdOrThrow(syncFile.revisions[0].id);
      const content = await DataDrive.drive('local').get(file);
      return {
        filename: file.filename,
        size: file.size,
        content,
      };
    },
  },
};

export default resolvers;
