'use client';
import LayoutGrid, { onAskNoteCreation$ } from '@/src/components/LayoutGrid';
import { BiNote } from 'react-icons/bi';
import { motion, MotionProps } from 'framer-motion';
import { useRef } from 'react';

export default function Mural() {
  const constraintsRef = useRef<HTMLDivElement>(null);
  // TODO svg paths to transition add-button to a real post it
  return (
    <div
      ref={constraintsRef}
      className="flex flex-col min-h-full border-2 border-red-500"
    >
      <LayoutGrid />

      {/* Botão de adicionar nota */}
      <div className="mx-10 fixed bottom-0 right-0 left-0 p-2 flex justify-end border-2 border-green-400 pointer-events-none">
        <motion.div
          drag
          dragSnapToOrigin={true} // volta ao início
          dragElastic={0} // volta sem transição
          dragConstraints={constraintsRef} // limite do drag
          whileTap={{ scale: 1.5 }}
          whileDrag={{ x: -4, y: -4, skewY: -10, rotateY: 10, scale: 1.8 }}
          onDragEnd={(e, info) => {
            onAskNoteCreation$.next(info.point);
          }}
          className="pointer-events-auto hover:text-blue-600"
        >
          <BiNote className="block text-3xl" />
        </motion.div>
      </div>
    </div>
  );
}
