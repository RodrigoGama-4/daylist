import { Editor, Transforms, Element, Node, Text } from 'slate';
import { Paragraph } from './slate';

const LIST_TYPES = [
  'number-list',
  'bullet-list',
  'check-list',
] as Element['type'][];

export const EditorCmd = {
  toggleType: (editor: Editor, type: Element['type']) => {
    const isList = LIST_TYPES.includes(type);
    const isActive = EditorCmd.isTypeActive(editor, type);

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
    format = EditorCmd.query<typeof format>(editor, (e) => {
      if (!(e.type === 'paragraph')) return format;
      if (e.align && e.align === format.align)
        format = { header: e.header, align: undefined };
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

  query<T>(editor: Editor, map: (e: Element) => T) {
    const [result] = Array.from(
      editor.nodes<Element>({
        match: (n) => !Editor.isEditor(n) && Element.isElement(n) && !!map(n),
      }),
    );
    // if (!result) return null;
    return map(result[0]);
  },

  updateElement(editor: Editor, newProps: Partial<Element>) {
    Transforms.setNodes<Element>(editor, newProps);
  },

  isTypeActive: (editor: Editor, type: Element['type']) => {
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
    const isActive = EditorCmd.isMarkActive(editor, mark);
    if (isActive) Editor.removeMark(editor, mark);
    else Editor.addMark(editor, mark, true);
  },
};
