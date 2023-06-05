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

  return (
    <main>
      <h1>Daylist</h1>
      <p>
        {data?.hello + ' '}
        <span>
          <a href="graphql" className="link-info">
            {data?.world}
          </a>
        </span>
      </p>
      <div>
        <motion.nav
          animate={isVisible ? 'aberto' : 'fechado'}
          variants={variants}
          style={{
            background: '#EEE',
            width: 300,
          }}
          className="nav nav-tabs"
        >
          <div>a</div>
          <div>b</div>
        </motion.nav>
        <motion.button
          className="btn btn-primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 1 }}
          onClick={toggleVisibility}
          drag
          dragConstraints={{
            top: -0,
            left: -0,
            right: 100,
            bottom: 100,
          }}
        >
          Click & Drag
        </motion.button>
      </div>
    </main>
  );
}
