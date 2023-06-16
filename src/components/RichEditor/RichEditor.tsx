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
      <div
        {...attributes}
        className="text-black opacity-50 w-0 user-select-none cursor-text"
        style={{
          position: 'relative',
          wordWrap: 'revert',
        }}
      >
        <span className="absolute w-[100vw]">{children}</span>
      </div>
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
