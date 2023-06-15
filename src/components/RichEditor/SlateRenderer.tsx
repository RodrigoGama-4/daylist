import { RenderElementProps, RenderLeafProps, useSlate } from 'slate-react';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';

export const ElementRenderer = ({
  attributes,
  children,
  element,
}: RenderElementProps) => {
  const editor = useSlate();
  switch (element.type) {
    case 'bullet-list':
      return (
        <ListGroup {...attributes} as="ul">
          {children}
        </ListGroup>
      );
    case 'number-list':
      return (
        <ListGroup {...attributes} as="ol" numbered>
          {children}
        </ListGroup>
      );
    case 'list-item':
      return (
        <ListGroup.Item {...attributes} as="li" className="space-x-3">
          {children}
        </ListGroup.Item>
      );
    case 'check-list':
      return (
        <ListGroup as="ul" {...attributes}>
          {children}
        </ListGroup>
      );
    case 'check-item':
      return (
        <ListGroup.Item {...attributes} as="li" className="space-x-3">
          <span
            contentEditable={false} // fixes firefox input not changing
            suppressContentEditableWarning
          >
            <Form.Check className="inline" />
          </span>
          {children}
        </ListGroup.Item>
      );
    case 'paragraph':
      let style = { textAlign: element.align };
      if (!element.header)
        return (
          <p
            {...attributes}
            style={{ ...style, lineHeight: 1.2 }}
            className="my-1"
          >
            {children}
          </p>
        );
      return {
        1: (
          <div>
            <h1 {...attributes} style={style} className="text-2xl">
              {children}
            </h1>
          </div>
        ),
        2: (
          <div>
            <h2 {...attributes} style={style} className="text-xl">
              {children}
            </h2>
          </div>
        ),
        3: (
          <div>
            <h3 {...attributes} style={style} className="text-lg">
              {children}
            </h3>
          </div>
        ),
      }[element.header];
    case 'note-title':
      return (
        <h1
          {...attributes}
          style={{ textAlign: element.align }}
          className="text-xl font-semibold p-1 px-2 border-b-2"
        >
          {children}
        </h1>
      );
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
