'use client';
import { BsFillPersonFill } from 'react-icons/bs';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useUser } from '../providers/UserContext';
import { auth } from '../firebase';

export default function Login() {
  const router = useRouter();
  const user = useUser();
  if (user) router.push('/');

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-neutral-800 rounded-lg p-5 h-[60vh] w-[40vw] flex flex-col items-center justify-center">
        <div className="mb-5">
          <BsFillPersonFill size={120} />
        </div>
        <p>{user?.displayName}</p>
        <button className="btn btn-primary" onClick={signIn}>
          Entrar com o Google
        </button>
      </div>
    </div>
  );
}

const signIn = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};
