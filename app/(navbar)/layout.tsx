'use client';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import CustomNavbar from '@/src/components/Navbar';
import { useUser } from '@/src/providers/UserContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const user = useUser();
  if (user === null) redirect('/login');

  return (
    <div className="flex h-full">
      <div className="flex relative z-50">
        <CustomNavbar />
      </div>
      <main className="p-2 h-full flex-1 overflow-scroll min-w-[768px]">
        {children}
      </main>
    </div>
  );
}
