import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useSearchParams, useRouter } from 'next/navigation';
import AccountInfo from './Account';
import { motion } from 'framer-motion';
import { CustomNoteTree } from './NoteTree';

enum NavOption {
  MYNOTES = 'mynotes',
  ACCOUNT = 'account',
}

export default function CustomNavbar() {
  const router = useRouter();
  const query = useSearchParams();
  const nav = query.get('nav');
  const buttonScale = 1.1;

  const handleNavButtonClick = (option: NavOption) => {
    if (nav !== option) {
      const queryParam = option === NavOption.MYNOTES ? 'mynotes' : 'account';
      router.push(`/?nav=${queryParam}`);
    } else {
      router.back();
    }
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        className="position-relative"
        style={{ width: '4rem', height: '100%' }}
      >
        <Container>
          <Nav className="flex-column">
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
              onClick={() => handleNavButtonClick(NavOption.ACCOUNT)}
              className="mb-3 btn btn-primary"
            >
              <BsFillPersonFill />
            </motion.button>

            <motion.button
              whileHover={{
                scale: buttonScale,
              }}
              onClick={() => handleNavButtonClick(NavOption.MYNOTES)}
              className="mb-3 btn btn-primary"
            >
              <BsStack />
            </motion.button>
          </Nav>
        </Container>
      </Navbar>

      <CustomNoteTree
        isVisible={nav === NavOption.MYNOTES || nav === NavOption.ACCOUNT}
      />
      <AccountInfo isVisible={nav === NavOption.ACCOUNT} />
    </>
  );
}
