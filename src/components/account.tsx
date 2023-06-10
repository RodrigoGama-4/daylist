import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { motion } from 'framer-motion';

function AccountInfo() {
  const popover = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100%',
        width: '100%',
      }}
    >
      <motion.button
        className="btn btn-primary"
        style={{ position: 'absolute', top: 5, right: 5 }}
        whileHover={{
          scale: 1.1,
        }}
      >
        <BsPencilSquare />
      </motion.button>
    </div>
  );

  return (
    <>
      <motion.div
        className="position-absolute "
        style={{
          width: '50vw',
          height: '50vh',
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        initial={{ opacity: 0, scale: 3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          ease: [0, 0.71, 0.2, 1.01],
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {popover}
      </motion.div>
    </>
  );
}

export default AccountInfo;
