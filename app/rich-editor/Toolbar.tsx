import { useSlate } from 'slate-react';
import { Editor, Transforms, Element, Node, Text } from 'slate';
import { BiHeading } from 'react-icons/bi';
import {
  BiAlignLeft,
  BiAlignRight,
  BiAlignMiddle,
  BiAlignJustify,
} from 'react-icons/bi';
import { LuHeading, LuHeading2, LuHeading3 } from 'react-icons/lu';
import {
  MdAudioFile,
  MdFormatListBulleted,
  MdFormatListNumbered,
  MdChecklist,
  MdAudiotrack,
  MdImage,
  MdFormatUnderlined,
  MdFormatStrikethrough,
  MdFormatItalic,
  MdFormatBold,
} from 'react-icons/md';
import { Paragraph } from './slate';
import _ from 'lodash';
import { BsCardHeading } from 'react-icons/bs';

export default function Toolbar() {
  const editor = useSlate();
  return (
    <div className="px-2 flex space-x-2 [&>*]:rounded text-3xl text-slate-700 [&>div>*]:cursor-pointer">
      <div className="flex space-x-1">
        <BsCardHeading
          onClick={() => Teste.toggleParagraphProp(editor, { header: 1 })}
        />
      </div>
      <div className="flex space-x-1">
        <MdFormatBold onClick={() => Teste.toggleMark(editor, 'bold')} />
        <MdFormatItalic onClick={() => Teste.toggleMark(editor, 'italic')} />
        <MdFormatStrikethrough
          onClick={() => Teste.toggleMark(editor, 'strike')}
        />
        <MdFormatUnderlined
          onClick={() => Teste.toggleMark(editor, 'underline')}
        />
      </div>
      <div className="flex space-x-1">
        <MdFormatListBulleted
          onClick={() => Teste.toggleBlock(editor, 'bullet-list')}
        />
        <MdFormatListNumbered
          onClick={() => Teste.toggleBlock(editor, 'number-list')}
        />
        <MdChecklist onClick={() => Teste.toggleBlock(editor, 'check-list')} />
      </div>
      <div className="flex space-x-1">
        <BiAlignLeft
          onClick={() => Teste.toggleParagraphProp(editor, { align: 'left' })}
        />
        <BiAlignMiddle
          onClick={() => Teste.toggleParagraphProp(editor, { align: 'center' })}
        />
        <BiAlignRight
          onClick={() => Teste.toggleParagraphProp(editor, { align: 'right' })}
        />
        <BiAlignJustify
          onClick={() =>
            Teste.toggleParagraphProp(editor, { align: 'justify' })
          }
        />
      </div>

      <div className="flex space-x-1">
        <MdImage onClick={() => Teste.toggleBlock(editor, 'image')} />
        <MdAudiotrack onClick={() => Teste.toggleBlock(editor, 'audio')} />
      </div>
    </div>
  );
}

// helpers

const LIST_TYPES = [
  'number-list',
  'bullet-list',
  'check-list',
] as Element['type'][];

const Teste = {
  toggleBlock: (editor: Editor, type: Element['type']) => {
    const isList = LIST_TYPES.includes(type);
    const isActive = Teste.isActive(editor, type);

    Transforms.unwrapNodes(editor, {
      match: (n) =>
        !Editor.isEditor(n) &&
        Element.isElement(n) &&
        LIST_TYPES.includes(n.type),
      split: true,
    });
    let newProperties: Partial<Element> = {
      type: isActive
        ? 'paragraph'
        : isList
        ? type === 'check-list'
          ? 'check-item'
          : 'list-item'
        : type,
    };
    Transforms.setNodes<Element>(editor, newProperties);
    if (!isActive && isList) {
      const block = { type: type, children: [] } as Element;
      Transforms.wrapNodes(editor, block);
    }
  },

  toggleParagraphProp: (
    editor: Editor,
    format: Pick<Paragraph, 'header' | 'align'>,
  ) => {
    format = Teste.query<typeof format>(editor, (e) => {
      if (!(e.type === 'paragraph')) return format;
      if (e.align && e.align === format.align)
        format = { ...format, align: undefined };
      if (format.header)
        format = {
          ...format,
          header: (e.header
            ? e.header > 0
              ? e.header - 1
              : undefined
            : 3) as (typeof format)['header'],
        };
      return format;
    });

    Transforms.setNodes<Paragraph>(editor, format, {
      match: (n) => Element.isElement(n) && n.type === 'paragraph',
    });
  },

  query: function <T>(editor: Editor, map: (e: Element) => T) {
    const [result] = Array.from(
      editor.nodes<Element>({
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && !!map(n),
      }),
    );
    // if (!result) return null;
    return map(result[0]);
  },

  isActive: (editor: Editor, type: Element['type']) => {
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
