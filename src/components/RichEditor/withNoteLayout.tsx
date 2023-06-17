import { Editor, Element, Node, Transforms } from 'slate';
import { NoteTitle, Paragraph } from './slate';

export default function withNoteLayout(editor: Editor) {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      const title: NoteTitle = {
        type: 'note-title',
        children: [{ text: '' }],
      };
      const paragraph: Paragraph = {
        type: 'paragraph',
        children: [{ text: '' }],
      };
      if (editor.children.length <= 1 && Editor.string(editor, [0, 0]) === '') {
        Transforms.insertNodes(editor, [title, paragraph], {
          at: path.concat(0),
          select: true,
        });
      }

      if (editor.children.length < 2) {
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) });
      }

      for (const [child, childPath] of Array.from(
        Node.children(editor, path),
      )) {
        const slateIndex = childPath[0];
        const enforceType = ({
          type,
          avoid,
        }: {
          type?: Element['type'];
          avoid?: Element['type'];
        }) => {
          if (
            Element.isElement(child) &&
            (child.type !== type || child.type === avoid)
          ) {
            const newProperties: Partial<Element> = {
              type: type ?? (avoid && 'paragraph'),
            };
            Transforms.setNodes<Element>(editor, newProperties, {
              at: childPath,
            });
          }
        };

        switch (slateIndex) {
          case 0:
            enforceType({ type: 'note-title' });
            break;
          case 1:
            enforceType({ avoid: 'note-title' });
          default:
            break;
        }
      }
    }

    return normalizeNode([node, path]);
  };

  return editor;
}
