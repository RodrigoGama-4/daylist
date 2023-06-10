import React, { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useSearchParams, useRouter } from 'next/navigation';
import CustomNoteTree from './notetree';
import AccountInfo from './account';
import { motion } from 'framer-motion';

function CustomNavbar() {
  const router = useRouter();
  const query = useSearchParams();
  const nav = query.get('nav');
  const scale_button = 1.1;

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        className="position-absolute vh-100"
        style={{ width: '4rem' }}
      >
        <Container>
          <Nav className="flex-column" style={{ position: 'absolute', top: 5 }}>
            <motion.button
              onClick={() => console.log('futura logo')}
              className="mb-3 btn btn-primary"
              whileHover={{
                scale: scale_button,
              }}
            >
              <BsFillStarFill />
            </motion.button>
            <motion.button
              onClick={() => {
                router.push(nav !== 'account' ? '/?nav=account' : '/');
              }}
              className="mb-3 btn btn-primary"
              whileHover={{
                scale: scale_button,
              }}
            >
              <BsFillPersonFill />
            </motion.button>

            <motion.button
              onClick={() => {
                router.push(nav !== 'mynotes' ? '/?nav=mynotes' : '/');
              }}
              className="mb-3 btn btn-primary"
              whileHover={{
                scale: scale_button,
              }}
            >
              <BsStack />
            </motion.button>
          </Nav>
        </Container>
      </Navbar>
      {nav === 'mynotes' && <CustomNoteTree />}
      {nav === 'account' && (
        <div className="overlay " onClick={() => router.push('/')}>
          <AccountInfo />
        </div>
      )}
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

export default CustomNavbar;
