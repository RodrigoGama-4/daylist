'use client';
import { useState, useEffect, ReactNode } from 'react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, withReact } from 'slate-react';
import withNoteLayout from './withNoteLayout';

import { graphql } from '@/graphql/types';
import { auth } from '@/src/firebase';
import { useQuery } from '@apollo/client';

const GET_NOTES = graphql(`
  query NoteContent($id: ID!) {
    note(id: $id) {
      content
    }
  }
`);

export default function SlateProvider({
  children,
  initialValue: init,
}: {
  children: ReactNode;
  initialValue?: Descendant[] | null;
}) {
  const [editor] = useState(() =>
    withNoteLayout(withHistory(withReact(createEditor()))),
  );
  const [initialValue, setInitialValue] = useState<Descendant[]>();

  useEffect(() => {
    // const db = localStorage.getItem('content');
    // if (!db)
    setInitialValue(
      init !== null
        ? init
        : [
            {
              type: 'note-title',
              children: [{ text: '' }],
            },
          ],
    );
    // else setInitialValue(JSON.parse(db));
  }, [init]);

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
