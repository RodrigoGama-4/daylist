'use client';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import AccountInfo from './Account';
import { motion } from 'framer-motion';
import { CustomNoteTree } from './NoteTree';
import useQueryBuilder from '../hooks/usePushQuery';

enum NavOption {
  MY_NOTES = 'my_notes',
  ACCOUNT = 'account',
}

export default function CustomNavbar() {
  const buttonScale = 1.1;
  const router = useRouter();
  const query = useSearchParams();
  const navQuery = query.getAll('nav');
  const { makeQuery } = useQueryBuilder();

  const toggleNav = (opt: NavOption) => {
    const isOpen = navQuery.includes(opt);
    const q = isOpen ? { rem: { nav: opt } } : { add: { nav: opt } };
    const route = makeQuery(q);
    if (isOpen) router.replace(route);
    else router.push(route);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" className=" align-items-baseline flex-1">
        <Container>
          <Nav className="flex-column">
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
