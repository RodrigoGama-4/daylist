import React, { useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { BsFillStarFill, BsFillPersonFill, BsStack } from 'react-icons/bs';
import { useSearchParams, useRouter } from 'next/navigation';
import NoteTree from './NoteTree';
import AccountInfo from './Account';

function CustomNavbar() {
  const router = useRouter();
  const query = useSearchParams();
  const nav = query.get('nav');

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
            <Button onClick={() => console.log('futura logo')} className="mb-3">
              <BsFillStarFill />
            </Button>
            <Button
              onClick={() => {
                router.push(nav !== 'account' ? '/?nav=account' : '/');
              }}
              className="mb-3"
            >
              <BsFillPersonFill />
            </Button>

            <Button
              onClick={() => {
                router.push(nav !== 'mynotes' ? '/?nav=mynotes' : '/');
              }}
              className="mb-3"
            >
              <BsStack />
            </Button>
          </Nav>
        </Container>
      </Navbar>
      {nav === 'mynotes' && <NoteTree />}
      {nav === 'account' && (
        <div className="overlay" onClick={() => router.push('/')}>
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
