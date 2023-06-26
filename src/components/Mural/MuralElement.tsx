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
  const itemID = `item-${layout.i}`;
  const [isEditMode, __setEditMode] = useState(false);
  const toggleEditMode = () => {
    const v = !isEditMode;
    __setEditMode(v);
    onToggleEditMode$.next(v);
  };

  const [color, setColor] = useState('AAA');
  useEffect(() => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setColor(randomColor);
  }, []);

  const [rect, setRect] = useState<DOMRect>();
  useEffect(() => {
    const self = document.querySelector(`#${itemID}`) as HTMLDivElement;
    if (!self || isEditMode) return;
    const rect = self.getBoundingClientRect();
    // const style = getComputedStyle(self);
    setRect(rect);
    console.log(rect.width, rect.height);
  }, [isEditMode, itemID]);
  const vari: Variants = {
    editing: {
      x: rect?.x,
      y: rect?.y,
      width: 600,
      height: 600,
    },
    notEditing: {
      x: rect?.x,
      y: rect?.y,
      width: rect?.width,
      height: rect?.height,
    },
    hover: {
      outline: isEditMode ? '0x solid transparent' : `4px solid #${color}`,
    },
  };

  const variants: Variants = {
    editing: {
      position: ['absolute', 'fixed'],
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '600px',
      height: ['82vh', '90vh'],
    },
    notEditing: {
      position: ['fixed', 'absolute'],
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: ['fit', ''],
      height: ['fit', ''],
    },
    hover: {
      outline: isEditMode ? '0x solid transparent' : `4px solid #${color}`,
    },
  };

  const EditingOverlay = (
    <div
      className={`fixed bottom-0 top-0 right-0 left-0 transition-all duration-500  backdrop-blur ${
        isEditMode
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
      onClick={() => isEditMode && toggleEditMode()}
    />
  );

  return (
    <SlateProvider>
      {EditingOverlay}
      <motion.div
        key={layout.i}
        id={itemID}
        onDoubleClick={() => !isEditMode && toggleEditMode()}
        layout
        // animate={isEditMode ? 'editing' : 'notEditing'}
        initial="notEditing"
        animate={isEditMode ? 'editing' : 'notEditing'}
        variants={vari}
        whileHover={'hover'}
        transition={{
          bounce: 1,
          duration: 1,
          ease: 'easeOut',
        }}
        className={`drop-shadow h-full w-full overflow-x-hidden flex flex-col m-auto ${
          !isEditMode ? 'select-none react-draggable-handle' : 'z-50 shadow-lg'
        }`}
        style={{
          background: '#' + color,
        }}
      >
        <RichEditor className="flex-1 m-0 p-1 px-4" readOnly={!isEditMode} />
        {/* {!isEditMode && <DragHandle />} */}
      </motion.div>
      {isEditMode && (
        <div className="fixed flex justify-center bottom-4 left-0 right-0 z-50">
          <Toolbar />
        </div>
      )}
    </SlateProvider>
  );
}

export function DragHandle() {
  return (
    <div
      className="react-draggable-handle absolute top-0 right-0 opacity-30"
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
      className={`react-resizable-handle w-4 h-4 opacity-0 overflow-hidden absolute -bottom-2 -right-2`}
      style={{
        cursor: 'se-resize',
      }}
    >
      <MdDragHandle />
    </div>
  );
}

export const onToggleEditMode$ = new Subject<boolean>();
