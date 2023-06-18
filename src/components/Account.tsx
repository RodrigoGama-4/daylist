import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';
import { motion } from 'framer-motion';

function AccountInfo() {
  const router = useRouter();
  const [isExiting, setIsExiting] = useState(false);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      router.back();
    }, 200);
  };

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
      <div className="bg-black"></div>
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
      <div className="overlay" onClick={handleExit}>
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
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{
            opacity: isExiting ? 0 : 1,
            scale: isExiting ? 0.8 : 1,
          }}
          transition={{
            ease: [0, 0.71, 0.2, 1.01],
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {popover}
        </motion.div>
      </div>
      <style jsx>{`
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}

export default AccountInfo;
