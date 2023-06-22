'use client';
import Mural from '@/src/components/Mural/Mural';
import { auth } from '@/src/firebase';
import { redirect } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Home() {
  const [user] = useAuthState(auth);
  if (user === null) redirect('/login');
  return <Mural />;
}
