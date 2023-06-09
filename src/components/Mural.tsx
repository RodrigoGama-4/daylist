'use client';
import LayoutGrid, { onAskNoteCreation$ } from '@/src/components/LayoutGrid';
import { BiNote } from 'react-icons/bi';
import { motion, MotionProps } from 'framer-motion';
import { useRef, useState } from 'react';

export default function Mural() {
  const [isCreateMode, setIsCreatingNote] = useState(false);
  /** Criação de notas */
  const toggleCreateMode = () => setIsCreatingNote(!isCreateMode);

  return (
    <div
      className={`flex flex-col min-h-full border-2 border-red-500 ${
        isCreateMode ? 'cursor-cell' : ''
      }`}
      onClick={(e) => {
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
      <div className="mx-10 fixed bottom-0 right-0 left-0 p-2 flex justify-end border-2 border-green-400 pointer-events-none">
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
