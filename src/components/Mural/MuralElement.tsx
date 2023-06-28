'use client';
import {
  ReactNode,
  HTMLAttributes,
  useState,
  useEffect,
  useRef,
  Dispatch,
  useMemo,
  SetStateAction,
  useCallback,
} from 'react';
import RichEditor from '@/src/components/RichEditor/RichEditor';
import Toolbar from '@/src/components/RichEditor/Toolbar';
import SlateProvider from '@/src/components/RichEditor/SlateProvider';
import { motion, Variants } from 'framer-motion';
import { MdDragHandle, MdDragIndicator } from 'react-icons/md';
import { Subject } from 'rxjs';
import _ from 'lodash';
import RGL from 'react-grid-layout';
import useWindowSize from '@/src/hooks/useWindowSize';
import { graphql } from '@/graphql/types';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useUser } from '@/src/providers/UserContext';
import { useSlate } from 'slate-react';
import { Layout, Note, NoteInput } from '@/graphql/types/graphql';
import { Descendant } from 'slate';
import { filterLayoutFields } from './LayoutGrid';

/** Container para Note, Section ou Image */
export function MuralElement({
  layout,
  setLayouts,
  itemID,
}: {
  layout: Layout;
  setLayouts: Dispatch<SetStateAction<Layout[]>>;
  itemID: string;
}) {
  const [isEditMode, __setEditMode] = useState(false);
  const toggleEditMode = () => {
    const v = !isEditMode;
    __setEditMode(v);
    onToggleEditMode$.next(v);
  };
  const [color, setColor] = useState('AAA');

  const [GetNoteContent, noteData] = useLazyQuery(GET_NOTE_CONTENT);
  useUser((u) => {
    console.log('.........................');
    GetNoteContent({
      variables: {
        layoutID: layout.i,
        uid: u.uid,
      },
    });
  });
  const note = noteData.data?.noteOfLayout;
  const noteContent: Descendant[] | undefined = note
    ? JSON.parse(note.content)
    : undefined;

  const [parentRect, setParentRect] = useState<DOMRect>();
  const { windowX, windowY } = useWindowSize();
  const newHeight = 600,
    newWidth = 600;
  const variants: Variants = {
    editing: {
      x: (parentRect ? -(parentRect.x + newWidth / 2) : 0) + windowX / 2,
      y: (parentRect ? -(parentRect.y + newHeight / 2) : 0) + windowY / 2,
      width: newWidth,
      height: newHeight,
    },
    default: {
      x: 0,
      y: 0,
      width: '100%',
      height: '100%',
    },
    hover: {
      outline: isEditMode ? '0x solid transparent' : `4px solid #${color}`,
    },
  };

  // adicionar cor de fundo aleatória
  useEffect(() => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setColor(randomColor);
  }, []);

  // salvar rect do RGL.Layout para fazer transição ao modo de edição
  useEffect(() => {
    const parent = document.querySelector(`#outer-layout-${layout.i}`);
    setParentRect(parent?.getBoundingClientRect());
  }, [isEditMode, layout]);

  return (
    <SlateProvider initialValue={noteContent}>
      <EditingOverlay
        {...{ isEditMode, toggleEditMode, note, layout, setLayouts }}
      />
      <motion.div
        key={layout.i}
        id={itemID}
        onDoubleClick={() => !isEditMode && toggleEditMode()}
        layout
        variants={variants}
        animate={isEditMode ? 'editing' : 'readonly'}
        whileHover={'hover'}
        transition={{
          duration: 0.4,
          ease: 'backOut',
        }}
        className={`drop-shadow h-full w-full overflow-x-hidden flex flex-col m-auto ${
          !isEditMode ? 'select-none react-draggable-handle' : 'z-50 shadow-lg'
        }`}
        style={{
          background: '#' + color,
        }}
      >
        <RichEditor className="flex-1 m-0 p-1 px-4" readOnly={!isEditMode} />
        {/* {!isEditMode && <DragHandle />} */}
      </motion.div>
      {isEditMode && (
        <div className="fixed flex justify-center bottom-4 left-0 right-0 z-50">
          <Toolbar />
        </div>
      )}
    </SlateProvider>
  );
}

// TODO: refatorar para usar um único overlay pro mural inteiro
function EditingOverlay({
  isEditMode,
  toggleEditMode,
  note,
  layout,
  setLayouts,
}: {
  isEditMode: boolean;
  toggleEditMode: () => void;
  note: NoteFragment | null | undefined;
  layout: Layout;
  setLayouts: Dispatch<SetStateAction<Layout[]>>;
}) {
  const [saveNote, { error }] = useMutation(SAVE_NOTE);
  const [saveLayout] = useMutation(SAVE_LAYOUT);
  const user = useUser();
  const editor = useSlate();

  if (error) throw error;

  return (
    <div
      className={`fixed bottom-0 top-0 right-0 left-0 transition-all duration-500  backdrop-blur ${
        isEditMode
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0'
      }`}
      onClick={() => {
        isEditMode && toggleEditMode();
        if (!user || note === undefined) return;
        const id = note === null ? Date.now() : note.id;
        if (note !== null) {
          // include note in layout and update layouts state
          saveLayout({
            variables: {
              layoutUid: {
                ...filterLayoutFields(layout),
                uid: user.uid,
                note: id,
              },
            },
          });
          setLayouts((layouts) => {
            const rest = layouts.filter((l) => l.i !== layout.i);
            const modified = { ...layout, note: `${id}` };
            return [...rest, modified];
          });
        }
        const _note: NoteInput = {
          id,
          content: JSON.stringify(editor.children),
          owner: user.uid,
        };
        saveNote({ variables: { note: _note } });
      }}
    />
  );
}

export function DragHandle() {
  return (
    <div
      className="react-draggable-handle absolute top-0 right-0 opacity-30"
      style={{
        cursor: 'move',
      }}
    >
      <MdDragIndicator />
    </div>
  );
}
export function ResizeHandle() {
  return (
    <div
      className={`react-resizable-handle w-4 h-4 opacity-0 overflow-hidden absolute -bottom-2 -right-2`}
      style={{
        cursor: 'se-resize',
      }}
    >
      <MdDragHandle />
    </div>
  );
}

export const onToggleEditMode$ = new Subject<boolean>();

const SAVE_NOTE = graphql(`
  mutation SaveNote($note: NoteInput!) {
    saveNote(note: $note) {
      success
    }
  }
`);

type NoteFragment = Pick<Note, 'id' | 'content'>;
const GET_NOTE_CONTENT = graphql(`
  query GetLayoutNote($uid: ID!, $layoutID: ID!) {
    noteOfLayout(uid: $uid, lid: $layoutID) {
      id
      content
    }
  }
`);

const SAVE_LAYOUT = graphql(`
  mutation SaveLayout($layoutUid: LayoutUIDInput!) {
    saveLayout(layout: $layoutUid) {
      success
    }
  }
`);
