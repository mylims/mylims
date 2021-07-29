import Env from '@ioc:Adonis/Core/Env';

import { GqlResolvers } from 'App/graphql';

import { File } from '../Models/File';
import { SyncFile } from '../Models/SyncFile';

const resolvers: GqlResolvers = {
  Query: {
    async fileByPath(_, { path }) {
      const [syncFile] = await SyncFile.query({
        '_id.relativePath': path,
      }).all();
      const id = syncFile.revisions[0].id;
      const file = await File.findOrFail(id);
      const urlPath = 'addons/file-sync/file-content';
      return {
        filename: file.filename,
        size: file.size,
        content: `${Env.get('BACKEND_URL')}/${urlPath}?id=${id}`,
      };
    },
  },
};

export default resolvers;
