'use client';
import Mural from '@/src/components/Mural/Mural';
import { auth } from '@/src/firebase';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';

export default function Home() {
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) redirect('/login');
    });
    return () => unsub();
  }, []);

  return <Mural />;
}
