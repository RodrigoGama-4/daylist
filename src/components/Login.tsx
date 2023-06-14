import React from 'react';
import Image from 'next/image';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsFillPersonFill } from 'react-icons/bs';

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container d-flex flex-column align-items-center justify-content-center">
        <div className="mb-5">
          <BsFillPersonFill size={120} />
        </div>
        <button className="btn btn-primary">entrar com google</button>
      </div>

      <style jsx>{`
        .login-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .login-container {
          border: 1px solid black;
          border-radius: 10px;
          padding: 20px;
          height: 60vh;
          width: 40vw;
        }
      `}</style>
    </div>
  );
};

export default Login;
