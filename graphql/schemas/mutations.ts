import { gql } from '@apollo/client';

const typeDefs = gql`
  type Mutation {
    # Notes
    createNote(note: NoteInput!): StatusOk!
    saveNote(note: NoteInput!): StatusOk!
    # Layouts
    saveMural(mural: MuralInput!): StatusOk!
    # Tests
    teste(content: String!): StatusOk!
  }
  input MuralInput {
    uid: ID!
    aspect: MuralAspect!
    layouts: [LayoutInput!]!
  }
  input LayoutInput {
    note: ID!
    i: ID!
    h: Int!
    w: Int!
    x: Int!
    y: Int!
  }
  input NoteInput {
    id: ID!
    content: String!
    priority: Priority
    owner: ID!
    weekDays: [WeekDays!]
    group: SharingGroupInput
    stats: [DateRecordInput!]
    tags: [TagInput!]
    # not stored
    title: String
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
`;
export default typeDefs;
