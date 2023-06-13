import { useSlate } from 'slate-react';
import { Editor, Transforms, Element, Node, Text } from 'slate';

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
import { BsTypeH1, BsTypeH2, BsTypeH3 } from 'react-icons/bs';

import { MdAudioFile, MdImage, MdPlayArrow } from 'react-icons/md';
import { CustomElement, Paragraph } from './slate';

export default function Toolbar() {
  const editor = useSlate();
  return (
    <div className="px-2 flex space-x-2 [&>*]:rounded text-3xl text-slate-700 [&>div>*]:cursor-pointer">
      <div className="flex space-x-1">
        <BiBold onClick={() => Teste.toggleMark(editor, 'bold')} />
        <BiItalic onClick={() => Teste.toggleMark(editor, 'italic')} />
        <BiStrikethrough onClick={() => Teste.toggleMark(editor, 'strike')} />
        <BiUnderline onClick={() => Teste.toggleMark(editor, 'underline')} />
      </div>
      <div className="flex space-x-1">
        <BiListUl onClick={() => Teste.toggleBlock(editor, 'bullet-list')} />
        <BiListOl onClick={() => Teste.toggleBlock(editor, 'number-list')} />
        <BiListCheck onClick={() => Teste.toggleBlock(editor, 'check-list')} />
      </div>
      <div className="flex space-x-1">
        <BiAlignLeft
          onClick={() => Teste.toggleParagraphProp(editor, { align: 'left' })}
        />
        <BiAlignRight
          onClick={() => Teste.toggleParagraphProp(editor, { align: 'right' })}
        />
        <BiAlignMiddle
          onClick={() => Teste.toggleParagraphProp(editor, { align: 'center' })}
        />
        <BiAlignJustify
          onClick={() =>
            Teste.toggleParagraphProp(editor, { align: 'justify' })
          }
        />
      </div>
      <div className="flex space-x-1">
        <BsTypeH1
          onClick={() => Teste.toggleParagraphProp(editor, { header: 1 })}
        />
        <BsTypeH2
          onClick={() => Teste.toggleParagraphProp(editor, { header: 2 })}
        />
        <BsTypeH3
          onClick={() => Teste.toggleParagraphProp(editor, { header: 3 })}
        />
      </div>
      <div className="flex space-x-1">
        <MdImage onClick={() => Teste.toggleBlock(editor, 'image')} />
        <MdAudioFile onClick={() => Teste.toggleBlock(editor, 'audio')} />
      </div>
    </div>
  );
}

// helpers

const LIST_TYPES = ['number-list', 'bullet-list'];

const Teste = {
  toggleBlock: (editor: Editor, type: Element['type']) => {
    const isList = LIST_TYPES.includes(type);
    const isBlock = Teste.isBlockActive(editor, type);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });
    let newProperties: Partial<Element> = {
      type: isBlock ? 'paragraph' : isList ? 'list-item' : type,
    };
    Transforms.setNodes(editor, newProperties);
    if (!isBlock && isList) {
      const block = { type: type, children: [] } as Element;
      Transforms.wrapNodes(editor, block);
    }
  },

  toggleParagraphProp: (
    editor: Editor,
    format: Pick<Paragraph, 'header' | 'align'>,
  ) => {
    if (!Teste.isBlockActive(editor, 'paragraph')) return;
    Transforms.setNodes(editor, { ...format });
  },

  isBlockActive: (editor: Editor, type: Element['type']) => {
    const { selection } = editor;
    if (!selection) return false;
    const [match] = Array.from(
      Editor.nodes(editor, {
        at: Editor.unhangRange(editor, selection),
        match: (n) =>
          !Editor.isEditor(n) && Element.isElement(n) && n.type === type,
      }),
    );
    return !!match;
  },

  isMarkActive: (editor: Editor, mark: keyof Omit<Text, 'text' | 'color'>) => {
    const marks = Editor.marks(editor);
    return (marks && marks[mark]) || false;
  },
  toggleMark: (editor: Editor, mark: keyof Omit<Text, 'text' | 'color'>) => {
    const isActive = Teste.isMarkActive(editor, mark);
    if (isActive) Editor.removeMark(editor, mark);
    else Editor.addMark(editor, mark, true);
  },
};
