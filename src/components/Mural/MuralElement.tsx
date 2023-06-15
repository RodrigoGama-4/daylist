'use client';
import { ReactNode, HTMLAttributes, useState, useEffect } from 'react';
import RichEditor from '@/src/components/RichEditor/RichEditor';
import Toolbar from '@/src/components/RichEditor/Toolbar';
import SlateProvider from '@/src/components/RichEditor/SlateProvider';
import { motion } from 'framer-motion';
import { MdDragHandle, MdDragIndicator } from 'react-icons/md';
import { Subject } from 'rxjs';

/** Container para Note, Section ou Image */
export function MuralElement({ id }: { id: string | number }) {
  const [isEditMode, setEditMode] = useState(true);
  const toggleEditMode = () => setEditMode(!isEditMode);
  return (
    <SlateProvider>
      <motion.div
        key={id}
        id={`item-${id}`}
        onDoubleClick={toggleEditMode}
        className="shadow-sm h-full outline outline-1 outline-black bg-white overflow-y-scroll overflow-x-hidden flex flex-col"
      >
        <RichEditor className="flex-1 m-0 p-1 px-2" readOnly={!isEditMode} />
        {!isEditMode && <DragHandle />}
      </motion.div>
      {isEditMode && <Toolbar />}
    </SlateProvider>
  );
}

export function DragHandle() {
  return (
    <div
      className="react-draggable-handle absolute top-0 right-0"
      style={{
        cursor: 'move',
      }}
    >
      <MdDragIndicator />
    </div>
  );
}
export function ResizeHandle() {
  return (
    <div
      className={`react-resizable-handle absolute -bottom-3 -right-2`}
      style={{
        cursor: 'se-resize',
      }}
    >
      <MdDragHandle />
    </div>
  );
}
