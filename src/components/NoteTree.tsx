import React from 'react';
import { motion } from 'framer-motion';

export const CustomNoteTree = () => {
  return (
    <motion.div
      className="position-absolute d-flex align-items-center justify-content-center"
      initial={{
        scale: 0,
        x: '-10vw',
        originX: 0.5,
        originY: 0.05,
        borderRadius: '50%',
      }}
      animate={{
        scale: 1,
        x: 0,
        borderRadius: '0%',
        transition: { duration: 0.2, ease: 'easeInOut' },
      }}
      exit={{
        scale: 0,
        x: '10vw',
        borderRadius: '50%',
        transition: { duration: 7.2, ease: 'easeInOut' },
      }}
      style={{
        height: '100vh',
        border: '2px solid black',
        left: '4rem',
        padding: '7rem',
        background: 'gray',
      }}
    ></motion.div>
  );
};
