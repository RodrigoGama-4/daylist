import React from 'react';
import { Container } from 'react-bootstrap';

const CustomNoteTree = () => {
  return (
    <Container
      className="position-absolute d-flex align-items-center justify-content-center"
      style={{
        height: '100vh',
        border: '2px solid black',
        left: '4rem',
        padding: '7rem',
      }}
    ></Container>
  );
};

export default CustomNoteTree;
