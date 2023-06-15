import { gql } from '@apollo/client';

/**
 * **npm run codegen**
 *
 * Se _remover_ campos daqui, o intellisense e os tipos não vão atualizar
 * até remover os resolvers e as consultas correspondentes, agora inválidos.
 *
 * `Observar o status da geração dos tipos no terminal, quando remover tipos`
 *
 * Adicionar é OK, bem como remover tipos não usados em consultas
 */
const typeDefs = gql`
  type Query {
    hello: String!
    world: String!
  }

  type Note {
    id: ID!
    content: String! # serialized Descendant[]
    priority: String!
  }
`;

export default typeDefs;
