import { Pattern } from 'fs-synchronizer';

import ObjectId from '@ioc:Mongodb/ObjectId';

import { NotFoundError } from 'App/Exceptions/ApolloErrors';
import { GqlResolvers } from 'App/graphql';

import FileSyncOption from '../Models/FileSyncOption';

const resolvers: GqlResolvers = {
  Query: {
    async fileSyncOptions() {
      const fileSyncOptions = await FileSyncOption.find({});
      return fileSyncOptions.all();
    },
    async fileSyncOption(_, { id }) {
      const fileSyncOption = await FileSyncOption.findById(new ObjectId(id));
      if (!fileSyncOption) {
        throw new NotFoundError('file sync option not found');
      }
      return fileSyncOption;
    },
  },
  Mutation: {
    async createFileSyncOption(_, { input }) {
      return FileSyncOption.create(input);
    },
    async editFileSyncOption(_, { input }) {
      const fileSyncOption = await FileSyncOption.findById(
        new ObjectId(input.id),
      );
      if (!fileSyncOption) {
        throw new NotFoundError('file sync option not found');
      }

      fileSyncOption.enabled = input.enabled;
      fileSyncOption.root = input.root;
      fileSyncOption.maxDepth = input.maxDepth;
      fileSyncOption.patterns = input.patterns as Pattern[];

      await fileSyncOption.save();
      return fileSyncOption;
    },
    async deleteFileSyncOption(_, { input }) {
      const fileSyncOption = await FileSyncOption.findById(
        new ObjectId(input.id),
      );
      if (!fileSyncOption) {
        throw new NotFoundError('file sync option not found');
      }

      await fileSyncOption.delete();

      const fileSyncOptions = await FileSyncOption.find({});
      return fileSyncOptions.all();
    },
  },
};

export default resolvers;
