import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomNoteTree = () => {
  const estiloComponente = {
    height: '100vh',
    border: '2px solid black',
    margin: '2.8rem',
    padding: '4rem',
  };

  return <div style={estiloComponente}>{<div>TITULO DO PROJETO</div>}</div>;
};

export default CustomNoteTree;
