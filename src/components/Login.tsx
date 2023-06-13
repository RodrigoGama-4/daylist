import React from 'react';
import Image from 'next/image';
import ImgPadraoUsuario from './img/imagemuser.png';
import ImgButtonSign from './img/signgoogle.png';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  return (
    <div className="login-wrapper">
      <div className="login-container d-flex flex-column align-items-center justify-content-center">
        <div className="image-container mb-5">
          <Image
            src={ImgPadraoUsuario}
            alt="Imagem de usuário"
            width={180}
            height={180}
          />
        </div>
        <button>
          <Image
            src={ImgButtonSign}
            alt="botao entrar google"
            width={180}
            height={130}
          />
        </button>
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
