'use client';

import { useEffect, useState } from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import _ from 'lodash';
import { graphql } from '@/graphql/types';
import { useQuery, useLazyQuery } from '@apollo/client';

import { MuralElement, ResizeHandle } from './MuralElement';
import { Subject } from 'rxjs';
import Point from '@/src/utils/Point';
import useWindowSize from '@/src/hooks/useWindowSize';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { auth } from '@/src/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const GET_LAYOUTS = graphql(`
  query UserLayouts($uid: ID!) {
    mural(uid: $uid) {
      layouts {
        i
        h
        w
        x
        y
      }
    }
  }
`);

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

  const cellSize = 16; // pixels, X & Y
  const gridMargin = 0; // gridMargin != 0 quebra adição de nota em Y
  const cellCountX = windowX / (cellSize + gridMargin), // grid units
    cellCountY = windowY / (cellSize + gridMargin);
  const cellWidth = 14,
    cellHeight = 10;

  const [user, loading, err] = useAuthState(auth);
  const [getLayouts, { data: userLayouts }] = useLazyQuery(GET_LAYOUTS, {
    variables: { uid: '84rmKtlAOBRRi7IGUY5gAVke2G02 ' },
  });
  useEffect(() => {
    if (!user) return;
    getLayouts({ variables: { uid: '84rmKtlAOBRRi7IGUY5gAVke2G02' } });
  }, [user, getLayouts]);

  useEffect(() => {
    if (!userLayouts) return;
    setLayouts(userLayouts.mural.layouts);
    alert(userLayouts.mural.layouts);
  }, [userLayouts]);

  useEffect(() => {
    const handleNoteCreation = (point: Point) => {
      if (!windowX || !windowY) return;
      const main = document.querySelector('main');
      const pointX = point.x,
        pointY = point.y + main!.scrollTop;
      const x = Math.floor(pointX / cellSize) - Math.floor(cellWidth / 2);
      const y = Math.floor(pointY / cellSize) - Math.floor(cellHeight / 2);
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
