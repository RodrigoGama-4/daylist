'use client';
import { useQuery } from '@apollo/client';
import { graphql } from '@/graphql/types';
import Mural from '@/src/components/Mural/Mural';

const GET_DATA = graphql(`
  query Query {
    hello
    world
  }
`);

const CREATE_NOTE = graphql(`
  mutation Mutation($note: CreateNoteInput!) {
    createNote(note: $note) {
      id
    }
  }
`);

export default function Home() {
  // const { loading, error, data } = useQuery(GET_DATA);
  // const { loading, error, data } = useQuery(CREATE_NOTE);

  return (
    <main>
      <Mural />
    </main>
  );
}
