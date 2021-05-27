import * as imfr from 'is-my-file-ready';

import { UserInputError } from '@ioc:Apollo/Errors';

import { GqlResolvers } from 'App/graphql';

const availableChecks = Object.keys(imfr).filter((key) => key !== 'default');

const resolvers: GqlResolvers = {
  Query: {
    async readyChecks() {
      return availableChecks;
    },
  },
};

export function ensureCheckName(name: string) {
  if (!availableChecks.includes(name)) {
    throw new UserInputError(`invalid check name: ${name}`);
  }
}

export default resolvers;
