import User from 'App/Models/User';
import { GqlResolvers } from 'App/graphql';

const resolvers: GqlResolvers = {
  Query: {
    async users() {
      return User.all();
    },
    async usersInput(_, { limit, skip, input }) {
      const regex = { $regex: input, $options: 'i' };
      let userCursor = User.query({
        $or: [
          { emails: regex },
          { firstName: regex },
          { lastName: regex },
          { usernames: regex },
        ],
      });
      const totalCount = await userCursor.count();
      if (skip) userCursor = userCursor.skip(skip);
      if (limit) userCursor = userCursor.limit(limit);
      const list = await userCursor.all();
      return { list, totalCount };
    },
  },
};

export default resolvers;
