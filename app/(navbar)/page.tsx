'use client';
import { useQuery } from '@apollo/client';
import { graphql } from '@/graphql/types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Mural from '@/src/components/Mural/Mural';

const GET_DATA = graphql(`
  query Query {
    hello
    world
  }
`);

export default function Home() {
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <main>
      <Mural />
    </main>
  );
}
