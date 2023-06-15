'use client';
import { useState, useCallback, useMemo, useEffect, ReactNode } from 'react';
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

export default function SlateProvider({ children }: { children: ReactNode }) {
  const [editor] = useState(() => withHistory(withReact(createEditor())));
  const [initialValue, setInitialValue] = useState<Descendant[]>();

  useEffect(() => {
    // const db = localStorage.getItem('content');
    // if (!db)
    setInitialValue([
      {
        type: 'paragraph',
        children: [{ text: 'A line of text in a paragraph.' }],
      },
    ]);
    // else setInitialValue(JSON.parse(db));
  }, []);

  if (!initialValue) return <></>;
  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        // If change was not a selection
        const isAstChange = editor.operations.some(
          (op) => 'set_selection' !== op.type,
        );
        // Save the value to Local Storage.
        if (isAstChange) {
          const content = JSON.stringify(value);
          localStorage.setItem('content', content);
        }
      }}
    >
      {children}
      <style jsx>{`
        div {
          fontfamily: 'Roboto, sans-serif';
        }
      `}</style>
    </Slate>
  );
}
