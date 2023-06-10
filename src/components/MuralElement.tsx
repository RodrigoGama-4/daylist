import { DragHandle } from './LayoutGrid';
import { ReactNode } from 'react';

/** Container para Note, Section ou Image */
export function MuralElement({
  children,
  id,
}: {
  children?: ReactNode;
  id: string | number;
}) {
  return (
    <div key={id} id={`item-${id}`}>
      <DragHandle />
      {id}
      {children}
    </div>
  );
}
