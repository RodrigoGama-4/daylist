/** Typed resolvers */
import { Resolvers } from '../types/graphql';

const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello',
    world: () => 'World!',
  },
};
export default resolvers;
