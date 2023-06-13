import { RenderElementProps, RenderLeafProps } from 'slate-react';
import { Children } from 'react';

export const ElementRenderer = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  switch (element.type) {
    case 'bullet-list':
      return (
        <ul
          {...attributes}
          style={{
            listStyleType: 'square',
          }}
        >
          {children}
        </ul>
      );
    case 'number-list':
      return (
        <ol
          {...attributes}
          style={{
            listStyleType: 'alpha',
          }}
        >
          {children}
        </ol>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'check-list':
      return (
        <ul
          {...attributes}
          style={{
            listStyleType: 'none',
          }}
        >
          {children}
        </ul>
      );
    case 'check-item':
      return (
        <li {...attributes} className="space-x-2">
          <input type="checkbox" />
          <span>{children}</span>
        </li>
      );
    case 'paragraph':
      const style = { textAlign: element.align };
      if (!element.header)
        return (
          <p style={style} {...attributes}>
            {children}
          </p>
        );
      return {
        1: (
          <div>
            <h1 {...attributes} className="text-2xl">
              {children}
            </h1>
          </div>
        ),
        2: (
          <div>
            <h2 className="text-xl" {...attributes}>
              {children}
            </h2>
          </div>
        ),
        3: (
          <div>
            <h3 className="text-lg" {...attributes}>
              {children}
            </h3>
          </div>
        ),
      }[element.header];

    case 'image':
      return (
        <p {...attributes} className="bg-red-950 text-red-300">
          TODO: image
        </p>
      );
    case 'audio':
      return (
        <p {...attributes} className="bg-red-950 text-red-300">
          TODO: audio
        </p>
      );
    default:
      throw new Error(`O tipo não foi adicionado`);
  }
};

export function CustomLeaf({ children, attributes, leaf }: RenderLeafProps) {
  if (leaf.bold) children = <strong>{children}</strong>;
  if (leaf.italic) children = <em>{children}</em>;
  if (leaf.underline) children = <u>{children}</u>;
  if (leaf.strike) children = <del>{children}</del>;
  return (
    <span
      {...attributes}
      style={{
        color: leaf.color || 'unset',
      }}
    >
      {children}
    </span>
  );
}
