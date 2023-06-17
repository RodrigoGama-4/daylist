import React, { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountInfo from './Account';
import { motion } from 'framer-motion';
import { CustomNoteTree } from './NoteTree';

export default function CustomNavbar() {
  const router = useRouter();
  const query = useSearchParams();
  const nav = query.get('nav');
  const buttonScale = 1.1;

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        className="position-absolute vh-100"
        style={{ width: '4rem' }}
      >
        <Container>
          <Nav className="flex-column" style={{ position: 'absolute', top: 0 }}>
            <motion.button
              whileHover={{
                scale: buttonScale,
              }}
              onClick={() => console.log('futura logo')}
              className="mb-3 btn btn-primary"
            >
              <BsFillStarFill />
            </motion.button>
            <motion.button
              whileHover={{
                scale: buttonScale,
              }}
              onClick={() => {
                if (nav !== 'account') {
                  router.push('/?nav=account');
                } else {
                  router.back();
                }
              }}
              className="mb-3 btn btn-primary"
            >
              <BsFillPersonFill />
            </motion.button>

            <motion.button
              whileHover={{
                scale: buttonScale,
              }}
              onClick={() => {
                if (nav !== 'mynotes') {
                  router.push('/?nav=mynotes');
                } else {
                  router.back();
                }
              }}
              className="mb-3 btn btn-primary"
            >
              <BsStack />
            </motion.button>
          </Nav>
        </Container>
      </Navbar>
      {nav === 'mynotes' && <CustomNoteTree />}
      {nav === 'account' && <AccountInfo />}
    </>
  );
}
