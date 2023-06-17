'use client';
import { useState, useEffect, ReactNode } from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import withNoteLayout from './withNoteLayout';

export default function SlateProvider({ children }: { children: ReactNode }) {
  const [editor] = useState(() =>
    withNoteLayout(withHistory(withReact(createEditor()))),
  );
  const [initialValue, setInitialValue] = useState<Descendant[]>();

  useEffect(() => {
    // const db = localStorage.getItem('content');
    // if (!db)
    setInitialValue([
      {
        type: 'note-title',
        children: [{ text: '' }],
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
    </Slate>
  );
}
