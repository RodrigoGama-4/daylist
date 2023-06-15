'use client';
import { Editable, RenderLeafProps, RenderPlaceholderProps } from 'slate-react';
import Toolbar from './Toolbar';
import SlateProvider from './SlateProvider';
import { useCallback } from 'react';
import { CustomLeaf, ElementRenderer } from './SlateRenderer';

export default function RichEditor({
  className,
  readOnly,
}: {
  className?: string;
  readOnly: boolean;
}) {
  const renderElement = useCallback(ElementRenderer, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <CustomLeaf {...props} />;
  }, []);
  // impede que a lista faça o placeholder subir
  const renderPlaceholder = useCallback(
    ({ attributes, children }: RenderPlaceholderProps) => (
      <span
        {...attributes}
        className="text-neutral-400"
        style={{
          position: 'relative',
        }}
      >
        {children}
      </span>
    ),
    [],
  );

  return (
    <Editable
      {...{
        renderElement,
        renderLeaf,
        renderPlaceholder,
      }}
      readOnly={readOnly}
      placeholder="Algo a fazer..."
      autoFocus
      spellCheck={false}
      onBlur={(e) => {
        // TODO salvar no firestore
        // editor.children
      }}
      className={className}
    />
  );
}
