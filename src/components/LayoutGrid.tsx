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
import useWindowSize from '../hooks/useWindowSize';

// GRID
export default function LayoutGrid({ className }: { className?: string }) {
  const [layout, setLayout] = useState<Layout[]>([]);
  const { windowX, windowY } = useWindowSize();

  const cellSize = 32; // pixels, X & Y
  const cellCountX = Math.round(windowX / cellSize); // grid units
  const cellCountY = Math.round(windowY / cellSize);

  useEffect(() => {
    const handleNoteCreation = (point: Point) => {
      if (!windowX || !windowY) return;
      const x = Math.round(point.x / cellSize);
      const y = Math.round(point.y / cellSize);
      setLayout((L) => [
        ...L,
        {
          x,
          y,
          w: 5,
          h: 5,
          i: '0',
        },
      ]);
    };
    const sub = onAskNoteCreation$.subscribe(handleNoteCreation);
    return () => sub.unsubscribe();
  }, [windowX, windowY]);

  return (
    <div className={className ?? ''}>
      <div className="flex [&>*]:h-[32px] [&>*]:w-[32px]">
        {_.range(0, cellCountX).map((i) => (
          <div
            key={i}
            className={i % 2 === 0 ? 'bg-black' : 'bg-blue-500'}
          ></div>
        ))}
      </div>
      <ReactGridLayout
        {...{
          layout: layout,
          onLayoutChange: setLayout,
          rowHeight: cellSize,
          cols: cellCountX,
          margin: [0, 0],
          resizeHandle: ResizeHandle(),
          draggableHandle: '.react-draggable-handle',
          // TODO trazer à frente quando mover ou mudar de tamanho
          preventCollision: false,
          allowOverlap: true,
          autoSize: false,
          useCSSTransforms: true,
          verticalCompact: true,
        }}
      >
        {
          // FIXME do not use the index
          layout.map((L, i) => (
            <div
              key={i}
              className="shadow-sm outline outline-1 outline-black bg-white"
              style={{
                minHeight: cellSize,
                minWidth: cellSize,
              }}
              data-grid={L} // deixar aqui senão buga
            >
              {/* Não funciona sem essa div ao redor */}
              <MuralElement id={i} />
            </div>
          ))
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
