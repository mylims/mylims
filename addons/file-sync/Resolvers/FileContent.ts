import { readFile, stat } from 'fs/promises';
import { sep } from 'path';

import { GqlResolvers } from 'App/graphql';

const resolvers: GqlResolvers = {
  Query: {
    async fileByPath(_, { path }) {
      const splitedPath = path.split(sep);
      const fileName = splitedPath[splitedPath.length - 1];
      const fileBuffer = await readFile(path);
      const content = fileBuffer.toString();
      const fileSize = await stat(path);
      return { fileName, size: fileSize.size, content };
    },
  },
};

export default resolvers;
