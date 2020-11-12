import User from 'App/Models/User';
import { GqlResolvers } from 'App/graphql';

const resolvers: GqlResolvers = {
  Query: {
    async users() {
      const users = await User.find({});
      return users.all();
    },
  },
};

export default resolvers;
