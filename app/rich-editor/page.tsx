'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  AudioElement,
  BulletList,
  CheckList,
  CustomLeaf,
  ImageElement,
  NumberList,
  Paragraph,
} from './SlateElements';

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
          type: 'Paragraph',
          children: [{ text: 'A line of text in a paragraph.' }],
        },
      ]);
    else setInitialValue(JSON.parse(db));
  }, []);

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case 'BulletList':
        return <BulletList {...props} />;
      case 'NumberList':
        return <NumberList {...props} />;
      case 'CheckList':
        return <CheckList {...props} />;
      case 'Image':
        return <ImageElement {...props} />;
      case 'Audio':
        return <AudioElement {...props} />;
      default:
        return <Paragraph {...props} />;
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
                  CustomEditor.toggleBulletList(editor);
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

  toggleBulletList(editor: CustomTypes['Editor']) {
    const [codeElement] = Editor.nodes(editor, {
      match: (n: Node): n is CustomTypes['Element'] => n.type === 'BulletList',
    });
    Transforms.setNodes(
      editor,
      { type: codeElement ? 'Paragraph' : 'BulletList' },
      {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      },
    );
  },
};

function Toolbar() {
  const slate = useSlate();
  const el = slate.children.at(0) as CustomTypes['Element'];
  return <p>{el.children![0].text}</p>;
}
