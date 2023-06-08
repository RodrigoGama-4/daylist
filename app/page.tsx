'use client';
import { useQuery } from '@apollo/client';
import { graphql } from '@/graphql/types';
import { motion } from 'framer-motion';
import { useState } from 'react';

const GET_DATA = graphql(`
  query Query {
    hello
    world
  }
`);

export default function Home() {
  const [isVisible, setVisible] = useState(true);
  const toggleVisibility = () => setVisible(!isVisible);
  const { loading, error, data } = useQuery(GET_DATA);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const variants = {
    aberto: { opacity: 1, x: 0 },
    fechado: { opacity: 0, x: '-100%' },
  };

  return <main></main>;
}
