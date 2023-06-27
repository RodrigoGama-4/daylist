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
import { Note, NoteInput } from '@/graphql/types/graphql';
import { Descendant } from 'slate';
import { auth } from '@/src/firebase';
import { toLayoutInput } from './Mural';

/** Container para Note, Section ou Image */
export function MuralElement({
  layout,
  setLayouts,
}: {
  layout: RGL.Layout;
  setLayouts: Dispatch<SetStateAction<RGL.Layout[]>>;
}) {
  const itemID = `item-${layout.i}`;
  const [isEditMode, __setEditMode] = useState(false);
  const toggleEditMode = () => {
    const v = !isEditMode;
    __setEditMode(v);
    onToggleEditMode$.next(v);
  };

  // buscar nota
  const [GetNoteContent, noteData] = useLazyQuery(GET_NOTE_CONTENT);
  const note = noteData.data?.noteOfLayout;
  useEffect(() => {
    if (!auth.currentUser) return;
    GetNoteContent({
      variables: {
        layoutID: layout.i,
        uid: auth.currentUser.uid,
      },
    });
  }, []);
  const initialValue: Descendant[] | undefined = note
    ? JSON.parse(note.content)
    : undefined;

  // adicionar cor de fundo aleatória
  const [color, setColor] = useState('AAA');
  useEffect(() => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    setColor(randomColor);
  }, []);

  // salvar rect do RGL.Layout para fazer transição ao modo de edição
  const [parentRect, setParentRect] = useState<DOMRect>();
  useEffect(() => {
    const parent = document.querySelector(`#outer-layout-${layout.i}`);
    setParentRect(parent?.getBoundingClientRect());
  }, [isEditMode, layout]);
  const { windowX, windowY } = useWindowSize();
  const newHeight = 600,
    newWidth = 600;

  return (
    <SlateProvider initialValue={initialValue}>
      <EditingOverlay {...{ isEditMode, toggleEditMode, note, layout }} />
      <motion.div
        key={layout.i}
        id={itemID}
        onDoubleClick={() => !isEditMode && toggleEditMode()}
        layout
        initial="notEditing"
        animate={
          isEditMode
            ? {
                x:
                  (parentRect ? -(parentRect.x + newWidth / 2) : 0) +
                  windowX / 2,
                y:
                  (parentRect ? -(parentRect.y + newHeight / 2) : 0) +
                  windowY / 2,
                width: newWidth,
                height: newHeight,
              }
            : {
                x: 0,
                y: 0,
                width: '100%',
                height: '100%',
              }
        }
        whileHover={{
          outline: isEditMode ? '0x solid transparent' : `4px solid #${color}`,
        }}
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
}: {
  isEditMode: boolean;
  toggleEditMode: () => void;
  note: Nota | null | undefined;
  layout: RGL.Layout;
}) {
  const [saveNote, { error }] = useMutation(SAVE_NOTE);
  const [saveLayout] = useMutation(SAVE_LAYOUT);
  const user = useUser();
  const editor = useSlate();

  if (error)
    alert(`Erro ao salvar nota
      ${error.cause}\n${error.message}`);

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
        const _note: NoteInput = {
          id,
          content: JSON.stringify(editor.children),
          owner: user.uid,
        };
        if (note === null) {
          // TODO salvar layout com ID da nota nova
          alert('inserindo id da nota no layout');
          saveLayout({
            variables: {
              layoutUid: {
                ...toLayoutInput(layout),
                uid: user.uid,
                note: id,
              },
            },
          });
        }

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

type Nota = Pick<Note, 'id' | 'content'>;
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
