'use client';
import { useEffect, useRef, useState, ReactNode } from 'react';
import RGL, {
  WidthProvider,
  ReactGridLayoutProps,
  Layout,
  CoreProps,
} from 'react-grid-layout';
import { MuralElement } from '@/src/components/MuralElement';
import { MdDragHandle, MdDragIndicator } from 'react-icons/md';
import _ from 'lodash';
import { Subject } from 'rxjs';
import Point from '../Point';

// GRID
export default function LayoutGrid({ className }: { className?: string }) {
  const [layout, setLayout] = useState<Layout[]>();

  // useEffect(() => {
  //   const handler = () => {
  //     const i = 0;
  //     const y = 10;
  //     setLayout((L) => [
  //       ...(L ?? []),
  //       {
  //         x: (i * 2) % 24, // rest of 24 cols
  //         y: Math.floor(i / 6) * y,
  //         w: 1 + Math.round(Math.random() * 4),
  //         h: y,
  //         i: i.toString(),
  //       },
  //     ]);
  //   };
  //   document.addEventListener('dblclick', handler);
  //   return () => {
  //     document.removeEventListener('dblclick', handler);
  //   };
  // }, []);

  useEffect(() => {
    const handleNoteCreation = (point: Point) => {
      console.log(point.x, point.y);
    };
    const sub = onAskNoteCreation$.subscribe(handleNoteCreation);
    return () => sub.unsubscribe();
  }, []);

  return (
    <div className={className ?? ''}>
      <ReactGridLayout
        {...{
          layout: layout,
          onLayoutChange: setLayout,
          rowHeight: 16,
          cols: 36,
          margin: [8, 8],
          resizeHandle: ResizeHandle(),
          draggableHandle: '.react-draggable-handle',
          // TODO trazer à frente quando mover ou mudar de tamanho
        }}
      >
        {
          // FIXME do not use the index
          layout && layout.map((L, i) => <MuralElement key={i} id={i} />)
        }
      </ReactGridLayout>
    </div>
  );
}

const ReactGridLayout = WidthProvider(RGL);

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
function ResizeHandle() {
  return (
    <div
      className="react-resizable-handle absolute bottom-0 right-0"
      style={{
        cursor: 'se-resize',
      }}
    >
      <MdDragHandle />
    </div>
  );
}

/** Observes the onDragEnd point in the _Mural_ */
export const onAskNoteCreation$ = new Subject<Point>();
