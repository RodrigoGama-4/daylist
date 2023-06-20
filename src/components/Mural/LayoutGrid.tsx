'use client';
import { useEffect, useState } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import { MuralElement, ResizeHandle } from './MuralElement';
import _ from 'lodash';
import { Subject } from 'rxjs';
import Point from '@/src/utils/Point';
import useWindowSize from '@/src/hooks/useWindowSize';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// GRID
export default function LayoutGrid({
  className,
  isCreateMode,
}: {
  className?: string;
  isCreateMode: boolean;
}) {
  // o último elemento é o primeiro a ser visto (como se fosse z-index)
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const { windowX, windowY } = useWindowSize();

  const cellSize = 32; // pixels, X & Y
  const gridMargin = 4;
  const cellCountX = windowX / (cellSize + gridMargin), // grid units
    cellCountY = windowY / (cellSize + gridMargin);
  const cellWidth = 6,
    cellHeight = 5;

  useEffect(() => {
    const handleNoteCreation = (point: Point) => {
      if (!windowX || !windowY) return;
      const main = document.querySelector('main');
      console.log(main?.scrollTop, window.screen.height);
      const pointX = point.x,
        pointY = point.y + Math.max(main!.scrollTop - window.screen.height, 0);
      const x = Math.floor(pointX / cellSize) - Math.floor(cellWidth / 2);
      const y = Math.round(pointY / cellSize) - Math.floor(cellHeight / 2);
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
    const sub = onAskNoteCreation$.subscribe(handleNoteCreation);
    return () => sub.unsubscribe();
  }, [windowX, windowY]);

  return (
    <div className={`${className ?? ''}`}>
      <ReactGridLayout
        {...{
          layout: layouts,
          onLayoutChange: setLayouts,
          onDragStop: setLayouts,
          onResizeStop: setLayouts,
          rowHeight: cellSize,
          cols: Math.round(cellCountX),
          margin: [gridMargin, gridMargin],
          resizeHandle: ResizeHandle(),
          draggableHandle: '.react-draggable-handle',
          preventCollision: true,
          allowOverlap: true,
          autoSize: true,
          useCSSTransforms: false,
          transformScale: 1,
        }}
      >
        {layouts.map((layout, j) => (
          <div
            key={layout.i}
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
            <MuralElement {...{ layout }} />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}

const ReactGridLayout = WidthProvider(RGL);

/** Observes the onDragEnd point in the _Mural_ */
export const onAskNoteCreation$ = new Subject<Point>();
