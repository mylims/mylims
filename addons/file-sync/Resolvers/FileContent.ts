import { readFile } from 'fs/promises';
import { join } from 'path';

import { GqlResolvers } from 'App/graphql';

import { FileSyncOption } from '../Models/FileSyncOption';
import { SyncFile } from '../Models/SyncFile';

const resolvers: GqlResolvers = {
  Query: {
    async fileByPath(_, { path }) {
      const [file] = await (
        await SyncFile.find({ '_id.relativePath': path })
      ).all();
      const { configId } = file.id;
      const { root } = await FileSyncOption.findByIdOrThrow(configId);
      const fileBuffer = await readFile(join(root, path));
      const content = fileBuffer.toString();
      return { filename: file.filename, size: file.revisions[0].size, content };
    },
  },
};

export default resolvers;
