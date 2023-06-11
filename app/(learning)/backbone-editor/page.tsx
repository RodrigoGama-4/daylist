'use client';
import { useState } from 'react';
// Import the Slate components and React plugin.
import { createEditor, Descendant, CustomTypes } from 'slate';
import { withHistory } from 'slate-history';
import { Slate, Editable, withReact, useSlate } from 'slate-react';

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
];

export default function Page() {
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  return (
    <div>
      {/* Slate context provider */}
      <Slate editor={editor} initialValue={initialValue}>
        <div className="p-2 bg-slate-100">
          <Editable />
        </div>
        <Toolbar />
      </Slate>
    </div>
  );
}

function Toolbar() {
  const slate = useSlate();
  const el = slate.children.at(0) as CustomTypes['Element'];
  return <p>{el.children[0].text}</p>;
}
