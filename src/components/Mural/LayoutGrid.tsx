'use client';

import { useEffect, useState, use } from 'react';
import RGL, { WidthProvider, Responsive } from 'react-grid-layout';
import _ from 'lodash';

import { MuralElement, ResizeHandle } from './MuralElement';
import { Subject } from 'rxjs';
import * as rx from 'rxjs';
import Point from '@/src/utils/Point';
import useWindowSize from '@/src/hooks/useWindowSize';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import useUserMural from '@/src/hooks/useUserMural';

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

  const half = (layout: RGL.Layout[]) =>
    layouts.map((l) => ({
      ...l,
      w: Math.round(l.w / 2),
      x: Math.round(l.x / 2),
    }));
  
  const [aspect, setAspect] = useState<Aspect>(); // TODO ler do gql
  useEffect(() => {
    const sub = onAspectChange$
      .pipe(rx.distinctUntilChanged())
      .subscribe((a) => setAspect(a));
    return () => sub.unsubscribe();
  }, []);
  
  return (
    <div className={`${className ?? ''}`}>
      <ReactGridLayout
        {...{
          // layout: layouts,
          onLayoutChange: (l) => {
            onLayoutChange$.next(l);
            setLayouts(l);
          },
          onDragStop: setLayouts,
          onResizeStop: setLayouts,
          rowHeight: cellSize,
          // cols: Math.round(cellCountX),
          margin: [gridMargin, gridMargin],
          resizeHandle: ResizeHandle(),
          draggableHandle: '.react-draggable-handle',
          preventCollision: true,
          allowOverlap: true,
          autoSize: true,
          useCSSTransforms: false,
          transformScale: 1,
        }}
        layouts={{ lg: layouts }}
        breakpoints={gridAspect.breakpoints}
        cols={gridAspect.cols}
        onBreakpointChange={(scr, cols) => onAspectChange$.next(scr as Aspect)}
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
            <MuralElement layout={layout} />
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
}

const ReactGridLayout = WidthProvider(RGL.Responsive);

/** Observes the onDragEnd point in the _Mural_ */
export const onAskNoteCreation$ = new Subject<Point>();
export const onLayoutChange$ = new Subject<RGL.Layout[]>();

const aspects = ['lg', 'md', 'sm', 'xs'] as const;
type Aspect = (typeof aspects)[number];
type AspectMap = { [key in Aspect]: number };
const gridAspect: { [k in 'breakpoints' | 'cols']: AspectMap } = {
  breakpoints: { lg: 1024, md: 768, sm: 640, xs: 480 },
  cols: {
    lg: 40,
    md: 20,
    sm: 10,
    xs: 5,
  },
};
const onAspectChange$ = new Subject<Aspect>();
onAspectChange$.pipe(rx.distinctUntilChanged()).subscribe(console.log);
