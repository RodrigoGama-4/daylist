'use client';
import Spinner from 'react-bootstrap/Spinner';
import LayoutGrid, { onAskNoteCreation$, onLayoutChange$ } from './LayoutGrid';
import { BiNote } from 'react-icons/bi';
import { useRef, useState, use, useEffect } from 'react';
import useUserMural, { getUserMural } from '@/src/hooks/useUserMural';
import RGL from 'react-grid-layout';
import { useMutation } from '@apollo/client';
import { graphql } from '@/graphql/types';
import { useUser } from '@/src/providers/UserContext';
import { Layout } from '@/graphql/types/graphql';
import { auth } from '@/src/firebase';
import * as rx from 'rxjs';

export default function Mural() {
  // Layout do mural armazenado no DB
  const [, isLoadingMural] = useUserMural();

  // Criação de notas
  const [isCreateMode, setIsCreatingNote] = useState(false);
  const toggleCreateMode = () => setIsCreatingNote(!isCreateMode);

  const [saveLayouts] = useMutation(SAVE_MURAL_LAYOUTS);
  useEffect(() => {
    const sub = onLayoutChange$
      .pipe(
        rx.debounceTime(1500), // pega última mudança dentro de 2s
      )

      .subscribe((layouts) => {
        console.log('salvando mural no firestore');
        const user = auth.currentUser;
        if (!user) return;
        saveLayouts({
          variables: {
            mural: {
              uid: user.uid,
              layouts: layouts.map((l) => toLayoutInput(l)),
            },
          },
        });
      });
    return () => sub.unsubscribe();
  }, []);

  if (isLoadingMural)
    return (
      <div className="absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center border-4">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  return (
    <div
      id="mural"
      className={`relative flex flex-col min-h-full ${
        isCreateMode ? 'cursor-cell' : ''
      }`}
      onPointerDown={(e) => {
        if (!isCreateMode) return;
        onAskNoteCreation$.next({
          x: e.clientX,
          y: e.clientY,
        });
        toggleCreateMode();
      }}
    >
      <LayoutGrid {...{ isCreateMode }} />

      {/* Botão de adicionar nota */}
      <div className="mx-10 fixed bottom-0 right-0 left-0 p-2 flex justify-end  pointer-events-none">
        <div
          className={`pointer-events-auto btn ${
            isCreateMode ? 'btn-primary' : 'btn-secondary'
          }`}
          onClick={toggleCreateMode}
        >
          <BiNote className="block text-3xl hover:skew-x-6" />
        </div>
      </div>
    </div>
  );
}

const SAVE_MURAL_LAYOUTS = graphql(`
  mutation SaveMuralLayouts($mural: MuralInput!) {
    saveMural(mural: $mural) {
      success
    }
  }
`);

function toLayoutInput(layout: RGL.Layout): Layout {
  const destr = ({ h, i, w, x, y }: Omit<Layout, 'note'>) => ({
    h,
    i,
    note: 'TODO',
    w,
    x,
    y,
  });
  return destr(layout);
}
