'use client';

import { useEffect, useState, use, useCallback } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import _ from 'lodash';

import { MuralElement, ResizeHandle, onToggleEditMode$ } from './MuralElement';
import { Subject } from 'rxjs';
import * as rx from 'rxjs';
import Point from '@/src/utils/Point';
import useWindowSize from '@/src/hooks/useWindowSize';

// import 'react-grid-layout/css/styles.css';
// import 'react-resizable/css/styles.css';
import useUserMural from '@/src/hooks/useUserMural';
import { motion } from 'framer-motion';

// GRID
export default function LayoutGrid({
  className,
  isCreateMode,
}: {
  className?: string;
  isCreateMode: boolean;
}) {
  // o último elemento é o primeiro a ser visto (como se fosse z-index)
  const [layouts, setLayouts] = useState<RGL.Layout[]>([]);
  useUserMural((l) => setLayouts(l));

  const { windowX, windowY } = useWindowSize();
  const cellSize = 16; // pixels, X & Y
  const gridMargin = 0; // gridMargin != 0 quebra adição de nota em Y
  const cellCountX = windowX / (cellSize + gridMargin), // grid units
    cellCountY = windowY / (cellSize + gridMargin);
  const cellWidth = 14,
    cellHeight = 10;

  useEffect(() => {
    setLayouts((l) => l);
    const handleCreation = (point: Point) => {
      if (!windowX || !windowY) return;
      const main = document.querySelector('main');
      const pointX = point.x,
        pointY = point.y + main!.scrollTop;
      const x = Math.floor(pointX / cellSize) - Math.floor(cellWidth / 2);
      const y = Math.floor(pointY / cellSize) - Math.floor(cellHeight / 2);
      // TODO: save layout
      setLayouts((L) => [
        ...L,
        {
          x,
          y,
          w: cellWidth,
          h: cellHeight,
          i: Date.now().toString(), // key
        },
      ]);
    };
    const sub = onAskNoteCreation$.subscribe(handleCreation);
    return () => sub.unsubscribe();
  }, [windowX, windowY]);

  return (
    <div id="rgl" className={`${className ?? ''}`}>
      <ReactGridLayout
        {...{
          layout: layouts,
          cols: 100,
          // cols: Math.round(cellCountX),
          onLayoutChange: (l) => {
            onLayoutChange$.next(l);
            setLayouts(l);
          },
          onDragStop: setLayouts,
          onResizeStop: setLayouts,
          rowHeight: cellSize,
          margin: [gridMargin, gridMargin],
          resizeHandle: ResizeHandle(),
          draggableHandle: '.react-draggable-handle',
          preventCollision: false,
          isBounded: false,
          allowOverlap: true,
          autoSize: true,
          useCSSTransforms: false,
          transformScale: 1,
        }}
      >
        {layouts.map((layout, j) => (
          <div
            key={layout.i}
            id={`outer-layout-${layout.i}`}
            // className="border-4 border-red-500"
            style={{
              minHeight: cellSize,
              minWidth: cellSize,
            }}
            data-grid={layout} // deixar aqui senão buga
            onPointerDown={(e) => {
              // trazer layout à frente, visto como acima dos outros
              let ls = [...layouts];
              ls = [...ls.slice(0, j), ...ls.slice(j + 1, undefined), layout];
              setLayouts(ls);
            }}
          >
            <MuralElement layout={layout} />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}

const ReactGridLayout = WidthProvider(RGL);

/** Observes the onDragEnd point in the _Mural_ */
export const onAskNoteCreation$ = new Subject<Point>();
export const onLayoutChange$ = new Subject<RGL.Layout[]>();
