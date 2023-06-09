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
export default function LayoutGrid({
  className,
  isCreateMode,
}: {
  className?: string;
  isCreateMode: boolean;
}) {
  const [layout, setLayout] = useState<Layout[]>([]);
  const { windowX, windowY } = useWindowSize();

  const cellSize = 32; // pixels, X & Y
  const gridMargin = 4;
  const cellCountX = windowX / (cellSize + gridMargin); // grid units
  const cellCountY = windowY / (cellSize + gridMargin);

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
          h: 5, // iguais => quadrado
          i: '0',
        },
      ]);
    };
    const sub = onAskNoteCreation$.subscribe(handleNoteCreation);
    return () => sub.unsubscribe();
  }, [windowX, windowY]);

  return (
    <div className={`${className ?? ''}`}>
      <div className="flex fixed">
        {_.range(0, cellCountX).map((i) => (
          <div
            key={i}
            className={i % 2 === 0 ? 'bg-blue-500' : 'bg-black'}
            style={{
              width: cellSize + gridMargin,
              height: gridMargin,
            }}
          />
        ))}
      </div>
      <div className="flex">
        <div className="flex flex-col fixed">
          {_.range(0, cellCountY).map((i) => (
            <div
              key={i}
              className={i % 2 === 0 ? 'bg-blue-500' : 'bg-black'}
              style={{
                width: gridMargin,
                height: cellSize + gridMargin,
              }}
            />
          ))}
        </div>
        <ReactGridLayout
          {...{
            layout: layout,
            onLayoutChange: setLayout,
            rowHeight: cellSize,
            cols: Math.round(cellCountX),
            margin: [gridMargin, gridMargin],
            resizeHandle: ResizeHandle(),
            // draggableHandle: '.react-draggable-handle',
            // TODO trazer à frente quando mover ou mudar de tamanho
            preventCollision: false,
            allowOverlap: true,
            autoSize: true,
            useCSSTransforms: true,
            transformScale: 1,
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
                onPointerDown={(e) => (e.currentTarget.style.zIndex = '10')}
                onPointerUp={(e) => (e.currentTarget.style.zIndex = 'auto')}
              >
                <MuralElement id={i} />
              </div>
            ))
          }
        </ReactGridLayout>
      </div>
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
