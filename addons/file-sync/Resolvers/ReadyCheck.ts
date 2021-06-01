import { Binary } from 'bson';

import { UserInputError } from '@ioc:Apollo/Errors';

import { GqlReadyCheckInput, GqlResolvers } from 'App/graphql';

import { ReadyCheck } from '../Models/FileSyncOption'

interface ReadyCheckMetadata {
  name: string;
  hasArg?: boolean;
  deserialize?: (args: string[]) => unknown;
  serialize?: (readyCheck: ReadyCheck) => string
}

export const checks: ReadyCheckMetadata[] = [
  {
    name: 'editTime',
  }, {
    name: 'endsWithBytes',
    deserialize: (args) => new Binary(Buffer.from(args[0], 'hex'), Binary.SUBTYPE_BYTE_ARRAY),
    serialize: (readyCheck: ReadyCheck) => {
      return (readyCheck.value as Binary).buffer.toString('hex')
    }
  }, {
    name: 'endsWithStr',
    deserialize: (args) => args[0]
  }, {
    name: 'sameSize',
  }
]

const validCheckNames = checks.map(({ name }) => name)

const resolvers: GqlResolvers = {
  Query: {
    async readyChecks() {
      return checks.map(check => ({ ...check, hasArg: check.deserialize !== undefined }));
    },
  },
};

function ensureCheckName(name: string) {
  if (!validCheckNames.includes(name)) {
    throw new UserInputError(`invalid check name: ${name}`);
  }
}

function getReadyCheckByName(name: string) {
  ensureCheckName(name)
  return checks.find(check => check.name === name) as ReadyCheckMetadata
}

function deserializeReadyCheck(readyCheck: GqlReadyCheckInput) {
  const metadata = getReadyCheckByName(readyCheck.name)
  if(metadata.deserialize === undefined){
    return readyCheck
  }
  if(readyCheck.value == null) {
    throw new UserInputError(`check ${metadata.name} needs an argument`)
  }

  return {...readyCheck, value: metadata.deserialize([readyCheck.value])}
}

export function deserializeReadyChecks(readyChecks: GqlReadyCheckInput[]) {
  return readyChecks.map(deserializeReadyCheck)
}

function serializeReadyCheck(readyCheck: ReadyCheck) {
  const metadata = getReadyCheckByName(readyCheck.name)
  if(metadata.serialize === undefined) {
    return readyCheck
  }
  return {...readyCheck, value: metadata.serialize(readyCheck)}
}

export function serializeReadyChecks(readyChecks: ReadyCheck[]) {
  return readyChecks.map(serializeReadyCheck)
}

export default resolvers;
