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
  setDoc,
} from 'firebase/firestore';
import {
  Resolvers,
  Note,
  Layout,
  NoteInput,
  Tag,
  MuralInput,
  Mural,
} from '../types/graphql';
import fetcher from '@/src/fetcher';

function inputToNote(noteInput: FstoreNote): Note {
  return {
    ...noteInput,
    id: `${noteInput.id}`,
    owner: {
      id: 'todo',
      email: 'todo',
      name: 'todo',
      photoUrl: '',
    },
    title: 'todo',
    stats: [],
    tags: [],
    group: null,
  };
}

const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello',
    world: () => 'World!',

    note: async (_, args) => {
      const noteInput = await getDocument<FstoreNote>(Fstore.NOTES, args.id);
      return noteInput ? inputToNote(noteInput) : null;
    },

    notes: async (_, { uid }) => {
      const q = query(
        collection(db, Fstore.NOTES),
        where('uid', '==', `${uid}`),
      );
      const docs = (await getDocs(q)).docs;
      const notes = docs.map((d) => d.data() as FstoreNote);
      return notes.map((n) => inputToNote(n));
    },

    mural: async (_, args) => {
      const doc = await getDocument<FstoreLayouts>(Fstore.LAYOUTS, args.uid);
      return {
        // 1 to 1 map
        uid: `${args.uid}`,
        layouts: (doc?.layouts as Layout[]) ?? [],
      };
    },

    tags: async (_, args) => {
      return (
        (await getDocument<FstoreTags>(Fstore.TAGS, args.uid))?.tags ?? null
      );
    },
  },

  Mutation: {
    createNote: async (_, args) => {
      const note: FstoreNote = args.note;
      // const obj = await addDoc(collection(db, Fstore.NOTES), args.note);
      const ok = await setDocument(Fstore.NOTES, note.id, note);
      return {
        success: ok,
      };
    },

    saveNote: async (_, args) => {
      const note: FstoreNote = args.note;
      const ok = await setDocument(Fstore.NOTES, note.id, note);
      return {
        success: ok,
      };
    },

    saveMural: async (_, args) => {
      const layout: FstoreLayouts = {
        uid: `${args.mural.uid}`,
        layouts: args.mural.layouts,
      };
      const ok = await setDocument(Fstore.LAYOUTS, layout.uid!, layout);
      return {
        success: ok,
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
  colecao: Fstore,
  id: string | number,
) {
  const r = await getDoc(doc(db, colecao, `${id}`));
  if (!r.exists()) return null;
  return r.data() as T;
}
async function setDocument(
  collection: Fstore,
  id: string | number,
  data: FstoreData,
) {
  const [, err] = await fetcher(setDoc(doc(db, collection, `${id}`), data));
  return err === null;
}

//

enum Fstore {
  NOTES = 'notes',
  TAGS = 'tags',
  LAYOUTS = 'layouts',
}
type FstoreData = FstoreNote | FstoreLayouts | FstoreTags;
type FstoreNote = NoteInput;
type FstoreLayouts = MuralInput;
type FstoreTags = {
  tags: Tag[];
};
