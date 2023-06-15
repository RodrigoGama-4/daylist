import { Metadata } from 'next';
import Mural from '@/src/components/Mural/Mural';

export const metadata: Metadata = {
  title: 'Mural',
};

export default function Page() {
  return <Mural />;
}
