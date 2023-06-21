'use client';
import { useQuery } from '@apollo/client';
import { graphql } from '@/graphql/types';
import Mural from '@/src/components/Mural/Mural';
import { auth } from '@/src/firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const GET_DATA = graphql(`
  query Query {
    hello
    world
  }
`);

const CREATE_NOTE = graphql(`
  mutation Mutation($note: NoteInput!) {
    createNote(note: $note) {
      success
    }
  }
`);

export default function Home() {
  // const { loading, error, data } = useQuery(GET_DATA);
  // const { loading, error, data } = useQuery(CREATE_NOTE);
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.replace('/login');
    });
    return () => unsub();
  }, [router]);

  return <Mural />;
}
