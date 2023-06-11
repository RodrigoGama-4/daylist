import { Children } from 'react';
import { BsPlayBtn, BsImage } from 'react-icons/bs';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

export function Paragraph({ children, attributes }: RenderElementProps) {
  return <p {...attributes}>{children}</p>;
}

export function BulletList({ children, attributes }: RenderElementProps) {
  return (
    <ul
      {...attributes}
      style={{
        listStyleType: 'square',
      }}
    >
      {Children.map(children, (child) => (
        <li>{child}</li>
      ))}
    </ul>
  );
}

export function NumberList({ children, attributes }: RenderElementProps) {
  return <ol {...attributes}>{children}</ol>;
}

export function CheckList({ children, attributes }: RenderElementProps) {
  return (
    <div {...attributes} className="bg-slate-400">
      {children}
    </div>
  );
}

export function ImageElement({ children, attributes }: RenderElementProps) {
  return (
    <div
      {...attributes}
      className="outline outline-1 outline-black rounded shadow-sm"
    >
      <BsImage />
      {children}
    </div>
  );
}

export function AudioElement({ children, attributes }: RenderElementProps) {
  return (
    <div
      {...attributes}
      className="outline outline-1 outline-black rounded shadow-sm"
    >
      <BsPlayBtn />
      {children}
    </div>
  );
}

export function CustomLeaf({ children, attributes, leaf }: RenderLeafProps) {
  return (
    <span {...attributes} style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}>
      {children}
    </span>
  );
}
