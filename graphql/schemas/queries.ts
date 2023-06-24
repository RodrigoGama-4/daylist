import { gql } from '@apollo/client';

/** REGRAS
 * O input de um tipo será feito seu análogo, um map raso
 * Assim, Mural ~ MuralInput
 *
 * Os campos não armazenados no DB também serão definidos no input
 * mas não serão requeridos, mesmo que no tipo seja, pois serão null
 */

const typeDefs = gql`
  type Query {
    hello: String!
    world: String!
    note(id: ID!): Note
    notes(uid: ID!): [Note!]!
    mural(uid: ID!): Mural!
    tags(uid: ID!): [Tag!]
  }
  type Mural {
    uid: ID!
    aspect: MuralAspect!
    layouts: [Layout!]!
  }
  type Layout {
    note: ID!
    i: ID!
    h: Int!
    w: Int!
    x: Int!
    y: Int!
  }

  type Note {
    id: ID!
    title: String! # extracted from content, for easy access
    content: String! # serialized Descendant[]
    priority: Priority
    weekDays: [WeekDays!]
    owner: User!
    group: SharingGroup
    stats: [DateRecord!]
    tags: [Tag!]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    photoUrl: String!
    connections: [User!]
    groups: [SharingGroup!]
  }

  type SharingGroup {
    id: ID!
    name: String!
    users: [User!]!
    notes: [Note!]
  }

  # Notes completion statuses of a given date
  type DateRecord {
    date: ID!
    record: [NoteRecord!]!
  }

  type NoteRecord {
    note: Note!
    count: Int
    isComplete: Boolean
  }

  type Tag {
    id: ID!
    name: String!
    notes: [Note!]!
  }

  enum WeekDays {
    SUN
    MON
    TUE
    WED
    THU
    FRI
    SAT
  }

  enum Priority {
    NONE
    LOW
    MEDIUM
    HIGH
  }

  enum MuralAspect {
    LG
    MD
    SM
    XS
  }
`;

export default typeDefs;

/**
 * npm run codegen
 *
 * Se _remover_ campos daqui, o intellisense e os tipos não vão atualizar
 * até remover os resolvers e as consultas correspondentes, agora inválidos.
 *
 * `Observar o status da geração dos tipos no terminal, quando remover tipos`
 *
 * Adicionar é OK, bem como remover tipos não usados em consultas
 */
