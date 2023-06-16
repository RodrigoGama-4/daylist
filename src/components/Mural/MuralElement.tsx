'use client';
import { ReactNode, HTMLAttributes, useState, useEffect, useRef } from 'react';
import RichEditor from '@/src/components/RichEditor/RichEditor';
import Toolbar from '@/src/components/RichEditor/Toolbar';
import SlateProvider from '@/src/components/RichEditor/SlateProvider';
import { motion, Variants } from 'framer-motion';
import { MdDragHandle, MdDragIndicator } from 'react-icons/md';
import { Subject } from 'rxjs';
import _ from 'lodash';
import RGL from 'react-grid-layout';

/** Container para Note, Section ou Image */
export function MuralElement({ layout }: { layout: RGL.Layout }) {
  const [isEditMode, setEditMode] = useState(false);
  const toggleEditMode = () => setEditMode(!isEditMode);

  const [color, setColor] = useState('FFF');
  useEffect(() => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setColor(randomColor);
  }, []);

  const variants: Variants = {
    editing: {
      position: ['absolute', 'fixed'],
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '600px',
      height: ['82vh', '90vh'],
      margin: 'auto',
      border: '1px solid red',
    },
    notEditing: {
      position: ['fixed', 'absolute'],
      width: ['fit', ''],
      height: ['fit', ''],
      margin: '0',
    },
  };

  return (
    <SlateProvider>
      <motion.div
        key={layout.i}
        id={`item-${layout.i}`}
        onDoubleClick={toggleEditMode}
        className={`shadow-sm h-full w-full overflow-y-scroll overflow-x-hidden flex flex-col ${
          !isEditMode
            ? 'select-none'
            : 'outline outline-1 outline-black bg-white z-50'
        }`}
        style={{
          background: '#' + color,
        }}
        animate={isEditMode ? 'editing' : 'notEditing'}
        variants={variants}
      >
        <RichEditor className="flex-1 m-0 p-1 px-2" readOnly={!isEditMode} />
        {!isEditMode && <DragHandle />}
        {isEditMode && (
          <div className="flex justify-center fixed bottom-4 left-0 right-0">
            <Toolbar />
          </div>
        )}
      </motion.div>
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
