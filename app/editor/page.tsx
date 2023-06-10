'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { CodeElement, CustomLeaf, DefaultElement } from './SlateElements';

import { Editor, Transforms, Element, Node, Text } from 'slate';
import { createEditor, Descendant, CustomTypes } from 'slate';
import { withHistory } from 'slate-history';
import {
  Slate,
  Editable,
  withReact,
  useSlate,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';

export default function Page() {
  const [editor] = useState(() => withHistory(withReact(createEditor())));

  const [initialValue, setInitialValue] = useState<Descendant[]>();
  useEffect(() => {
    const db = localStorage.getItem('content');
    if (!db)
      setInitialValue([
        {
          type: 'paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ]);
    else setInitialValue(JSON.parse(db));
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);
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
            (op) => 'set_selection' !== op.type,
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
            onKeyDown={(event) => {
              if (!event.ctrlKey) return;
              switch (event.key) {
                case 'k':
                  event.preventDefault();
                  CustomEditor.toggleCodeBlock(editor);
                  break;
                case 'b':
                  event.preventDefault();
                  CustomEditor.toggleBoldMark(editor);
                  break;
              }
            }}
          />
        </div>
        <Toolbar />
      </Slate>
    </div>
  );
}

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor: CustomTypes['Editor']) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as CustomTypes['Text']).bold === true,
      universal: true,
    });
    return !!match;
  },

  toggleBoldMark(editor: CustomTypes['Editor']) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true },
    );
  },

  toggleCodeBlock(editor: CustomTypes['Editor']) {
    const [codeElement] = Editor.nodes(editor, {
      match: (n: Node): n is CustomTypes['Element'] => n.type === 'code',
    });
    Transforms.setNodes(
      editor,
      { type: codeElement ? 'paragraph' : 'code' },
      {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      },
    );
  },
};

function Toolbar() {
  const slate = useSlate();
  const el = slate.children.at(0) as CustomTypes['Element'];
  return <p>{el.children[0].text}</p>;
}
