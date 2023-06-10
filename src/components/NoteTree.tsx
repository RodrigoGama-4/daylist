import React from 'react';
import { motion } from 'framer-motion';

const NoteTree = () => {
  const estiloComponente = {
    height: '100vh',
    border: '2px solid black',
    width: '18rem',
  };

  return (
    <motion.div
      initial={{ x: '-10vw' }}
      animate={{ x: 63 }}
      style={estiloComponente}
    >
      {<div></div>}
    </motion.div>
  );
};

export default NoteTree;
