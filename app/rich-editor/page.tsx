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
import {
  BiBold,
  BiItalic,
  BiStrikethrough,
  BiUnderline,
  BiAlignLeft,
  BiListOl,
  BiListUl,
  BiListCheck,
  BiAlignRight,
  BiAlignMiddle,
  BiAlignJustify,
} from 'react-icons/bi';
import { MdAudioFile, MdImage, MdPlayArrow } from 'react-icons/md';

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
      case 'bullet-list':
        return <BulletList {...props} />;
      case 'number-list':
        return <NumberList {...props} />;
      case 'check-list':
        return <CheckList {...props} />;
      case 'image':
        return <ImageElement {...props} />;
      case 'audio':
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
            onKeyDown={(event) => {
              if (!event.ctrlKey) return;
              switch (event.key) {
                case 'k':
                  event.preventDefault();
                  CustomEditor.toggleBullet(editor);
                  break;
                case 'b':
                  event.preventDefault();
                  CustomEditor.toggleBold(editor);
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
  isBold(editor: CustomTypes['Editor']) {
    const [match] = Editor.nodes(editor, {
      match: (n) => (n as CustomTypes['Text']).bold === true,
      universal: true,
    });
    return !!match;
  },

  toggleBold(editor: CustomTypes['Editor']) {
    const isActive = CustomEditor.isBold(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? undefined : true },
      { match: (n) => Text.isText(n), split: true },
    );
  },

  toggleBullet(editor: CustomTypes['Editor']) {
    const [codeElement] = Editor.nodes(editor, {
      match: (n: Node): n is CustomTypes['Element'] => n.type === 'bullet-list',
    });
    Transforms.setNodes(
      editor,
      { type: codeElement ? 'paragraph' : 'bullet-list' },
      {
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      },
    );
  },
};

function Toolbar() {
  const editor = useSlate();
  const el = editor.children.at(0) as CustomTypes['Element'];
  // return <p>{el.children![0].text}</p>;
  return (
    <div className="px-2 flex space-x-2 [&>*]:rounded text-3xl text-slate-700 [&>div>*]:cursor-pointer">
      <div className="flex space-x-1">
        <BiBold />
        <BiItalic />
        <BiStrikethrough />
        <BiUnderline />
      </div>
      <div className="flex space-x-1">
        <BiListUl onClick={() => CustomEditor.toggleBullet(editor)} />
        <BiListOl />
        <BiListCheck />
      </div>
      <div className="flex space-x-1">
        <BiAlignLeft />
        <BiAlignRight />
        <BiAlignMiddle />
        <BiAlignJustify />
      </div>
      <div className="flex space-x-1">
        <MdImage />
        <MdAudioFile />
      </div>
    </div>
  );
}
