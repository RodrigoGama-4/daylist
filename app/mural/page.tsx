'use client';
import RGL, {
  WidthProvider,
  ReactGridLayoutProps,
  Layout,
} from 'react-grid-layout';
import { useEffect, useRef, useState } from 'react';
import { MdDragHandle, MdDragIndicator } from 'react-icons/md';
import _ from 'lodash';

const ReactGridLayout = WidthProvider(RGL);

function generateLayout(props: any) {
  return _.map(new Array(props.numItems), (item: any, i: number) => {
    const y: number = props.y || Math.ceil(Math.random() * 4) + 1;
    return {
      x: (i * 2) % 24, // rest of 24 cols
      y: Math.floor(i / 6) * y,
      w: 1 + Math.round(Math.random() * 4),
      h: y,
      i: i.toString(),
    };
  });
}

// GRID
export default function BasicLayout() {
  const [layout, setLayout] = useState<Layout[]>();
  const layoutRefs = useRef<HTMLDivElement[]>([]);

  const numItems = 20;
  const gridProps: ReactGridLayoutProps = {
    layout: layout,
    rowHeight: 30,
    cols: 24,
    margin: [2, 2],
    onLayoutChange: setLayout,
    resizeHandle: (
      <div
        className="react-resizable-handle"
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          cursor: 'se-resize',
        }}
      >
        <MdDragHandle />
      </div>
    ),
    draggableHandle: '.react-draggable-handle',
    // TODO trazer à frente quando mover ou mudar de tamanho
  };

  useEffect(() => {
    setLayout(generateLayout({ ...gridProps, numItems }));
  }, []);

  const grid = _.map(_.range(numItems), (j: number) => {
    return (
      <div
        key={j}
        id={`item-${j}`}
        ref={(ref: HTMLDivElement) => ref && layoutRefs.current.push(ref)}
        className="shadow-sm"
        style={{
          border: '1px solid black',
          background: 'white',
          transition: 'all',
          transitionDuration: '1000',
        }}
      >
        <div
          className="react-draggable-handle"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            cursor: 'move',
          }}
        >
          <MdDragIndicator />
        </div>
        <span>{j}</span>
      </div>
    );
  });

  return <ReactGridLayout {...gridProps}>{grid}</ReactGridLayout>;
}
