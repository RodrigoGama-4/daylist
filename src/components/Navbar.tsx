import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountInfo from './Account';
import { motion } from 'framer-motion';
import { CustomNoteTree } from './NoteTree';
import usePushQuery from '../hooks/usePushQuery';

enum NavOption {
  MY_NOTES = 'my_notes',
  ACCOUNT = 'account',
}

export default function CustomNavbar() {
  const buttonScale = 1.1;
  const query = useSearchParams();
  const navQuery = query.getAll('nav');
  const { pushQuery } = usePushQuery();
  const toggleNav = (opt: NavOption) => {
    const q = navQuery.includes(opt)
      ? { rem: { nav: opt } }
      : { add: { nav: opt } };
    pushQuery(q);
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        className="position-absolute vh-100"
        style={{ width: '4rem' }}
      >
        <Container>
          <Nav
            className="flex-column align-items-center"
            style={{ position: 'absolute', top: 0 }}
          >
            <motion.button
              whileHover={{
                scale: buttonScale,
              }}
              onClick={() => console.log('futura logo')}
              className="mb-3 btn bg-dark-subtle"
            >
              <BsFillStarFill />
            </motion.button>

            <motion.button
              whileHover={{
                scale: buttonScale,
              }}
              onClick={() => toggleNav(NavOption.ACCOUNT)}
              className="mb-3 btn btn-outline-primary"
            >
              <BsFillPersonFill />
            </motion.button>

            <motion.button
              whileHover={{
                scale: buttonScale,
              }}
              onClick={() => toggleNav(NavOption.MY_NOTES)}
              className="mb-3 btn btn-outline-primary"
            >
              <BsStack />
            </motion.button>
          </Nav>
        </Container>
      </Navbar>

      <CustomNoteTree isVisible={navQuery.includes(NavOption.MY_NOTES)} />
      <AccountInfo isVisible={navQuery.includes(NavOption.ACCOUNT)} />
    </>
  );
}
