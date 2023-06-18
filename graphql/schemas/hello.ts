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
  type Mutation {
    # Notes
    createNote(note: CreateNoteInput!): CreateNotePayload!
    saveNote(note: SaveNoteInput!): StatusOk!
    # Layouts
    saveLayout(layout: MuralLayoutInput!): StatusOk!
    # Tests
    teste(content: String!): StatusOk!
  }
  input MuralLayoutInput {
    uid: ID!
    layouts: [LayoutInput!]!
  }
  input LayoutInput {
    i: ID!
    h: Int!
    w: Int!
    x: Int!
    y: Int!
  }
  input CreateNoteInput {
    content: String!
    priority: Priority
    weekDays: [WeekDays!]
  }
  type CreateNotePayload {
    id: ID!
    content: String!
  }
  input SaveNoteInput {
    id: ID!
    content: String!
    priority: Priority
    weekDays: [WeekDays!]
    # TODO inputs
    group: SharingGroupInput
    stats: [DateRecordInput!]
    tags: [TagInput!]
  }
  input TagInput {
    id: ID!
    name: String!
    notes: [ID!]!
  }
  input DateRecordInput {
    date: ID!
    record: [NoteRecordInput!]!
  }
  input NoteRecordInput {
    note: ID!
    count: Int
    isComplete: Boolean
  }
  input SharingGroupInput {
    id: ID!
    name: String!
    users: [ID!]!
    notes: [ID!]
  }
  type StatusOk {
    success: Boolean!
    teste: String
  }

  ############# QUERY

  type Query {
    hello: String!
    world: String!
    note(id: ID!): Note
    notes(uid: ID!): [Note!]!
    layout(uid: ID!): MuralLayout
    tags(uid: ID!): [Tag!]
  }
  type MuralLayout {
    uid: ID!
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
`;

export default typeDefs;
