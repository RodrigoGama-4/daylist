import { ReactNode } from 'react';
import { RenderElementProps, RenderLeafProps } from 'slate-react';

// Define a React component renderer for our code blocks.
export function CodeElement({ children, attributes }: RenderElementProps) {
  return (
    <pre {...attributes}>
      <code>{children}</code>
    </pre>
  );
}

// You must mix the attributes into your component
// You must render the children as the lowest leaf in your component

export function DefaultElement({ children, attributes }: RenderElementProps) {
  return (
    <p {...attributes} className="bg-slate-400">
      {children}
    </p>
  );
}

// For every format you add, Slate will break up the text content into "leaves"
// all leaves must be an inline element
export function CustomLeaf({ children, attributes, leaf }: RenderLeafProps) {
  return (
    <span {...attributes} style={{ fontWeight: leaf.bold ? 'bold' : 'normal' }}>
      {children}
    </span>
  );
}
