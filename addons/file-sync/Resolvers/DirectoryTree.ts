import { readdir, lstat } from 'fs/promises';
import { join } from 'path';

import { GqlDirectoryEntryType, GqlResolvers } from 'App/graphql';

const resolvers: GqlResolvers = {
  Query: {
    async directoryTree(_, { root }) {
      const nameList = await readdir(root);
      const list = await Promise.all(
        nameList.map(async (name) => {
          try {
            const path = name;
            const type = (await lstat(join(root, path))).isDirectory()
              ? GqlDirectoryEntryType.DIRECTORY
              : GqlDirectoryEntryType.FILE;
            return {
              path,
              type,
            };
          } catch (err) {
            return null;
          }
        }),
      );
      return list.filter((element) => element !== null) as {
        path: string;
        type: GqlDirectoryEntryType;
      }[];
    },
  },
};

export default resolvers;
