import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export const CustomNoteTree = ({ isVisible }: { isVisible: boolean }) => {
  const variants: Variants = {
    fechado: {
      scale: 0,
      x: '-10vw',
      originX: 0.8,
      originY: 0.09,
      borderRadius: '10%',
      transition: { duration: 0.12 },
    },
    aberto: {
      scale: 1,
      x: 0,
      borderRadius: '0%',
      transition: { duration: 0.2, ease: 'easeInOut' },
    },
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="position-absolute d-flex align-items-center justify-content-center"
          variants={variants}
          initial={'fechado'}
          animate={'aberto'}
          exit={'fechado'}
          style={{
            height: '100vh',
            border: '2px solid black',
            left: '4rem',
            padding: '7rem',
            background: 'gray',
          }}
        />
      )}
    </AnimatePresence>
  );
};
