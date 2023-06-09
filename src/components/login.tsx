import React, { useState } from 'react';
import { OverlayTrigger, Popover, Button } from 'react-bootstrap';

function UserLogin() {
  const [showPopover, setShowPopover] = useState(true);

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const popover = (
    <Popover id="user-login-popover" className="custom-popover">
      <Popover.Header as="h3">Faça login</Popover.Header>
      <Popover.Body>
        <Button variant="primary" size="lg">
          Logar com Google
        </Button>
      </Popover.Body>
    </Popover>
  );

  return (
    <>
      {showPopover && (
        <div className="overlay" onClick={togglePopover}>
          <div
            className="popover-container"
            onClick={(e) => e.stopPropagation()}
          >
            {popover}
          </div>
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

        .popover-container {
          width: 50vw;
          height: 60vh;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
}

export default UserLogin;
