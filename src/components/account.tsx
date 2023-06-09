import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { BsPencilSquare } from 'react-icons/bs';

function AccountInfo() {
  const [showPopover, setShowPopover] = useState(true);

  const togglePopover = () => {
    setShowPopover(!showPopover);
  };

  const router = useRouter();

  const popover = (
    <div className="account-info-popover">
      <button
        className="btn btn-primary"
        style={{ position: 'absolute', top: 5, right: 5 }}
      >
        <BsPencilSquare />
      </button>
    </div>
  );

  return (
    <>
      {showPopover && (
        <div
          className="popover-container position-absolute"
          onClick={(e) => e.stopPropagation()}
        >
          {popover}
        </div>
      )}
      <style jsx>{`
        .popover-container {
          width: 50vw;
          height: 50vh;
          background-color: #fff;
          padding: 20px;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .account-info-popover {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          width: 100%;
        }

        .account-info-image {
          width: 50%;
          height: auto;
        }
      `}</style>
    </>
  );
}

export default AccountInfo;
