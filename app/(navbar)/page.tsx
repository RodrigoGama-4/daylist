'use client';
import Mural from '@/src/components/Mural/Mural';
import { auth } from '@/src/firebase';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default async function Home() {
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) router.replace('/login');
    });
    return () => unsub();
  }, [router]);

  return <Mural />;
}
