import User from 'App/Models/User';
import { GqlResolvers } from 'App/graphql';

const resolvers: GqlResolvers = {
  Query: {
    async users() {
      return User.all();
    },
  },
};

export default resolvers;
