import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useUser } from '../providers/UserContext';

export default function AccountInfo({ isVisible }: { isVisible: boolean }) {
  const router = useRouter();
  const user = useUser();

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

  //DADOS DO usuarios
  const userDetails = user && (
    <div className="">
      {user.photoURL && (
        <div className="d-flex align-items-center position-relative">
          <img
            src={user.photoURL}
            alt="User Photo"
            className="rounded-circle"
          />
          <hr className="line flex-grow-1 ml-2" />
        </div>
      )}

      <div
        className="d-flex position-relative"
        style={{ left: 110, bottom: 40 }}
      >
        <p
          className="font-weight-bold display-name position-relative"
          style={{ fontWeight: 'bold', fontSize: '2rem' }}
        >
          {user.displayName},
        </p>
        <p
          className="position-relative"
          style={{ top: 15, left: 20, fontSize: '1.4rem' }}
        >
          definetly from Earth
        </p>
      </div>
    </div>
  );

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

  return (
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
            className="position-absolute bg-white p-4 rounded d-flex flex-column shadow-lg"
            style={{
              height: '25rem',
              width: '45rem',
            }}
            variants={variants}
            initial={'fechado'}
            animate={'aberto'}
            exit={'fechado'}
            onClick={(e) => e.stopPropagation()}
          >
            {buttonEdit}
            {userDetails}
            <p></p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
