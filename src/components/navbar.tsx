import React, { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useRouter } from 'next/navigation';
import CustomNoteTree from './notetree';
import AccountInfo from './account';

function CustomNavbar() {
  const router = useRouter();
  const [estado, setEstado] = useState('');

  const handleNavClick = (nav: string) => {
    if (estado === nav) {
      setEstado('');
    } else {
      setEstado(nav);
    }
    router.push(`/?nav=${nav}`);
  };

  const handleAccountOverlayClick = () => {
    setEstado('');
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
          <Nav className="flex-column" style={{ position: 'absolute', top: 0 }}>
            <Button
              onClick={() => handleNavClick('favorites')}
              className="mb-3"
            >
              <BsFillStarFill />
            </Button>
            <Button onClick={() => handleNavClick('account')} className="mb-3">
              <BsFillPersonFill />
            </Button>
            <Button onClick={() => handleNavClick('mynotes')} className="mb-3">
              <BsStack />
            </Button>
          </Nav>
        </Container>
      </Navbar>
      {estado === 'mynotes' && <CustomNoteTree />}
      {estado === 'account' && (
        <div className="overlay" onClick={handleAccountOverlayClick}>
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
