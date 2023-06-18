/** Typed resolvers */
import { auth, db } from '@/src/firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { Resolvers, Note, Layout, SaveNoteInput, Tag } from '../types/graphql';

const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello',
    world: () => 'World!',

    note: async (_, args) => {
      const nota = await getDocument('notes', args.id);
      return nota as Note | null;
    },
    notes: () => [], // TODO using where note.uid === user.id
    layout: async (_, args) => {
      const doc = await getDocument<{ layouts: Layout[] }>('layouts', args.uid);
      return doc
        ? {
            uid: `${args.uid}`,
            ...doc,
          }
        : null;
    },
    tags: async (_, args) => {
      return (
        (await getDocument<{ tags: Tag[] }>('tags', args.uid))?.tags ?? null
      );
    },
  },
  Mutation: {
    createNote: async (_, args) => {
      const _doc = await addDoc(collection(db, 'notes'), args.note);
      return {
        id: _doc.id,
        ...args.note,
      };
    },
    saveNote: async (_, args) => {
      // TODO
      const note: SaveNoteInput = {
        ...args.note,
      };
      return {
        success: true,
      };
    },
    teste: () => ({ success: true, teste: 'caso geral' }),
  },
  StatusOk: {
    teste: (parent) =>
      parent.teste === 'caso geral'
        ? 'Executou caso geral, e sobreescreveu com o resolver específico'
        : 'Não ocorre',
  },
};
export default resolvers;

async function getDocument<T>(
  at: 'notes' | 'tags' | 'layouts',
  id: string | number,
) {
  const r = await getDoc(doc(db, at, `${id}`));
  if (!r.exists()) return null;
  else return r.data() as T;
}
