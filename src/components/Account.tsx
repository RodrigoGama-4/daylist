import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { motion, Variants, AnimatePresence } from 'framer-motion';

export default function AccountInfo({ isVisible }: { isVisible: boolean }) {
  const router = useRouter();
  const buttonEdit = (
    <div>
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
  const variants: Variants = {
    fechado: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.1 },
    },
    aberto: {
      transition: { duration: 0.2, ease: [0, 0.71, 0.2, 1] },
      opacity: 1,
      scale: 1,
    },
    aniOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      transition: { duration: 0.3 },
    },
    fimOverlay: {
      backgroundColor: 'rgba(0, 0, 0, 0)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="position-fixed w-100 h-100 d-flex align-items-center justify-content-center"
            onClick={() => router.back()}
            variants={variants}
            initial={'fimOverlay'}
            animate={'aniOverlay'}
            exit={'fimOverlay'}
          >
            <motion.div
              className="position-absolute bg-white p-4 rounded d-flex flex-column align-items-center justify-content-center"
              style={{
                height: '35rem',
                width: '60rem',
              }}
              variants={variants}
              initial={'fechado'}
              animate={'aberto'}
              exit={'fechado'}
              onClick={(e) => e.stopPropagation()}
            >
              {buttonEdit}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
