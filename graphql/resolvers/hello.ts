/** Typed resolvers */
import { Resolvers } from '../types/graphql';

const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello',
  },
};
export default resolvers;
