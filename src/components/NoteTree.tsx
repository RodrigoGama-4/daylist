import React from 'react';
import { motion } from 'framer-motion';

const CustomNoteTree = () => {
  return (
    <motion.div
      className="position-absolute d-flex align-items-center justify-content-center"
      initial={{ x: -10 }}
      animate={{ x: 0 }}
      style={{
        height: '100vh',
        border: '2px solid black',
        left: '4rem',
        padding: '7rem',
      }}
    ></motion.div>
  );
};

export default CustomNoteTree;
