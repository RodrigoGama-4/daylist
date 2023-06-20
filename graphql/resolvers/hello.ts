/** Typed resolvers */
import { auth, db } from '@/src/firebase';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  documentId,
} from 'firebase/firestore';
import { Resolvers, Note, Layout, SaveNoteInput, Tag } from '../types/graphql';

const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello',
    world: () => 'World!',

    note: async (_, args) => {
      return await getDocument<FstoreNote>(Fstore.NOTES, args.id);
    },
    notes: async (_, { uid }) => {
      const q = query(
        collection(db, Fstore.NOTES),
        where('uid', '==', `${uid}`),
      );
      const docs = (await getDocs(q)).docs;
      const notes = docs.map((d) => d.data() as FstoreNote);
      return notes;
    },
    layout: async (_, args) => {
      const doc = await getDocument<FstoreLayouts>(Fstore.LAYOUTS, args.uid);
      return doc
        ? {
            uid: `${args.uid}`,
            ...doc,
          }
        : null;
    },
    tags: async (_, args) => {
      return (
        (await getDocument<FstoreTags>(Fstore.TAGS, args.uid))?.tags ?? null
      );
    },
  },
  Mutation: {
    createNote: async (_, args) => {
      const _doc = await addDoc(collection(db, Fstore.NOTES), args.note);
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
      note.
      return {
        success: true,
      };
    },
    teste: () => ({ success: true, teste: 'caso geral' }),
  },
  StatusOk: {
    teste: (parent) =>
      parent.teste === 'caso geral'
        ? 'Executou caso geral e SOBREESCREVEU com o resolver específico'
        : 'Não deve ocorrer',
  },
};
export default resolvers;

async function getDocument<T extends FstoreData>(
  collection: Fstore,
  id: string | number,
) {
  const r = await getDoc(doc(db, collection, `${id}`));
  if (!r.exists()) return null;
  return r.data() as T;
}

//

enum Fstore {
  NOTES = 'notes',
  TAGS = 'tags',
  LAYOUTS = 'layouts',
}
type FstoreData = FstoreNote | FstoreLayouts | FstoreTags;
// interface FstoreNote {}
type FstoreNote = Note;
type FstoreLayouts = {
  layouts: Layout[];
};
type FstoreTags = {
  tags: Tag[];
};
