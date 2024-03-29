import { Pattern } from 'fs-synchronizer';

import { ObjectId } from '@ioc:Zakodium/Mongodb/Odm';

import { NotFoundError } from 'App/Exceptions/ApolloErrors';
import { GqlResolvers } from 'App/graphql';

import { FileSyncOption } from '../Models/FileSyncOption';

import { deserializeReadyChecks, serializeReadyChecks } from './ReadyCheck';

const resolvers: GqlResolvers = {
  Query: {
    async fileSyncOptions() {
      return (await FileSyncOption.all()).map((fileSyncOption) => {
        fileSyncOption.readyChecks = serializeReadyChecks(
          fileSyncOption.readyChecks,
        );
        return fileSyncOption;
      });
    },
    async fileSyncOption(_, { id }) {
      const fileSyncOption = await FileSyncOption.find(new ObjectId(id));
      if (!fileSyncOption) {
        throw new NotFoundError('file sync option not found');
      }
      fileSyncOption.readyChecks = serializeReadyChecks(
        fileSyncOption.readyChecks,
      );
      return fileSyncOption;
    },
  },
  Mutation: {
    async createFileSyncOption(_, { input }) {
      return FileSyncOption.create({
        ...input,
        readyChecks: deserializeReadyChecks(input.readyChecks),
      });
    },
    async editFileSyncOption(_, { input }) {
      const fileSyncOption = await FileSyncOption.find(new ObjectId(input.id));
      if (!fileSyncOption) {
        throw new NotFoundError('file sync option not found');
      }

      fileSyncOption.enabled = input.enabled;
      fileSyncOption.root = input.root;
      fileSyncOption.maxDepth = input.maxDepth;
      fileSyncOption.patterns = input.patterns as Pattern[];
      fileSyncOption.readyChecks = deserializeReadyChecks(input.readyChecks);

      await fileSyncOption.save();
      fileSyncOption.readyChecks = serializeReadyChecks(
        fileSyncOption.readyChecks,
      );
      return fileSyncOption;
    },
    async deleteFileSyncOption(_, { input }) {
      const fileSyncOption = await FileSyncOption.find(new ObjectId(input.id));
      if (!fileSyncOption) {
        throw new NotFoundError('file sync option not found');
      }

      await fileSyncOption.delete();

      return FileSyncOption.all();
    },
  },
};

export default resolvers;
