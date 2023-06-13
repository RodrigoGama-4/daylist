'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { ElementRenderer, CustomLeaf } from './SlateRenderer';

import { createEditor, Descendant, CustomTypes } from 'slate';
import { withHistory } from 'slate-history';
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderLeafProps,
} from 'slate-react';
import Toolbar from './Toolbar';
import { Paragraph } from './slate';

export default function Page() {
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  const [initialValue, setInitialValue] = useState<Descendant[]>();
  useEffect(() => {
    // const db = localStorage.getItem('content');
    // if (!db || true)
    setInitialValue([
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
      },
    ]);
    // else setInitialValue(JSON.parse(db));
  }, []);

  const renderElement = useCallback(ElementRenderer, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <CustomLeaf {...props} />;
  }, []);

  if (!initialValue) return;
  return (
    <div>
      {/* Slate context provider */}
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={(value) => {
          const isAstChange = editor.operations.some(
            (op) => 'set_selection' !== op.type, // if change was not a selection
          );
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value);
            localStorage.setItem('content', content);
          }
        }}
      >
        <div className="p-2 bg-slate-100">
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Algo a fazer..."
            autoFocus
          />
        </div>
        <Toolbar />
      </Slate>
    </div>
  );
}
