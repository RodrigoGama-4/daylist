'use client';
import RichEditor from '@/src/components/RichEditor/RichEditor';
import SlateProvider from '@/src/components/RichEditor/SlateProvider';
import Toolbar from '@/src/components/RichEditor/Toolbar';

export default function Page() {
  return (
    <SlateProvider>
      <RichEditor readOnly={false} />
      <Toolbar />
    </SlateProvider>
  );
}
