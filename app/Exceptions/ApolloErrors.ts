import { ApolloError } from '@ioc:Apollo/Errors';

export class NotFoundError extends ApolloError {
  public constructor(message: string) {
    super(message, 'NOT_FOUND');
  }
}
