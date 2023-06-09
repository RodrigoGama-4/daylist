'use client';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  const query = useSearchParams();
  const nav = query.get('nav');

  return (
    <div>
      <button onClick={() => router.push('/exemplo?nav=teste')}>
        Va para /?nav=teste
      </button>
      {nav ? <p>{nav}</p> : '...'}
    </div>
  );
}
