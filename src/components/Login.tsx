'use client';
import { BsFillPersonFill } from 'react-icons/bs';
import { auth } from '../firebase';
import {
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult,
  signInWithPopup,
} from 'firebase/auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) return;
      alert(`
        ${user.displayName}
        ${user.email}
        ${user.photoURL}
        
      `);
      router.push('/');
    });
    return () => unsub();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="border-2 border-neutral-800 rounded-lg p-5 h-[60vh] w-[40vw] flex flex-col items-center justify-center">
        <div className="mb-5">
          <BsFillPersonFill size={120} />
        </div>
        <p>{auth.currentUser?.displayName}</p>
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
