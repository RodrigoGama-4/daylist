import Login from '@/src/components/Login';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In - Daylist',
};

export default function Page() {
  return (
    <main>
      <Login />
    </main>
  );
}
