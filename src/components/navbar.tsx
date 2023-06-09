import React, { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import NoteTree from './NoteTree';

function CustomNavbar() {
  const router = useRouter();
  const [estado, setEstado] = useState<string>('');
  const [isNoteTreeVisible, setIsNoteTreeVisible] = useState<boolean>(false);

  const handleNoteTreeClick = () => {
    setEstado('mynotes');
    setIsNoteTreeVisible((prevVisible) => !prevVisible);
  };

  return (
    <Navbar bg="dark" variant="dark" className="position-absolute">
      <Container>
        <Nav className="flex-column">
          <Button
            onClick={() => {
              setEstado('favorites');
              router.push('');
            }}
            className="mb-3"
          >
            <BsFillStarFill />
          </Button>
          <Button onClick={() => {}} className="mb-3">
            <BsFillPersonFill />
          </Button>
          <Button onClick={handleNoteTreeClick} className="mb-3">
            <BsStack />
          </Button>
        </Nav>
      </Container>
      {estado === 'mynotes' && isNoteTreeVisible && <NoteTree />}{' '}
      <style>{`
        .navbar {
          height: 100vh;
          left: 5;
          top: 0;
          width: 7rem;
        }
      `}</style>
    </Navbar>
  );
}

export default CustomNavbar;
