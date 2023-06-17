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
    note(id: ID!): Note
    notes(user: ID!): [Note!]!
  }

  type Mutation {
    createNote(content: String!): CreateNotePayload!
    saveNote(note: NoteInput!): StatusOK!
    teste(content: String!): StatusOK!
  }

  type CreateNotePayload {
    id: ID!
    content: String!
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

  input NoteInput {
    id: ID!
    content: String!
    priority: Priority
    weekDays: [WeekDays!]
    # TODO inputs
    # group: SharingGroup
    # stats: [DateRecord!]
    # tags: [Tag!]
  }

  type User {
    id: ID!
    name: String!
    email: String!
    photoUrl: String
    connections: [User!]
    groups: [SharingGroup!]
  }

  type SharingGroup {
    id: ID!
    name: String!
    users: [User!]!
    notes: [Note!]
  }

  # Notes completion status of a given date
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

  type StatusOK {
    success: Boolean!
    teste: String!
  }
`;

export default typeDefs;
