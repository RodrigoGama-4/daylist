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
  MuralAspect,
  UserInput,
  User,
} from '../types/graphql';
import fetcher from '@/src/fetcher';

function inputToNote(noteInput: FstoreNote): Note {
  return {
    id: `${noteInput.id}`,
    owner: {
      // este uid é usado abaixo para buscar o objeto User
      uid: `${noteInput.owner}`,
    },
    title: 'todo',
    content: noteInput.content,
  };
}
async function getNote(id: string | number): Promise<Note | null> {
  const noteInput = await getDocument<FstoreNote>(Fstore.NOTES, id);
  return noteInput ? inputToNote(noteInput) : null;
}
const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello',
    world: () => 'World!',

    note: async (_, args) => getNote(args.id),

    noteOfLayout: async (_, args) => {
      const mural = await getDocument<FstoreLayouts>(Fstore.LAYOUTS, args.uid);
      const layout = mural?.layouts.find((l) => l.i === args.lid);
      const nid = layout?.note ? `${layout.note}` : null;
      return nid ? getNote(nid) : null;
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

    user: async (_, args) => {
      const u = await getDocument<FstoreUsers>(Fstore.USERS, args.uid);
      return u
        ? {
            uid: `${u.uid}`,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
          }
        : null;
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
    /** Salva todos os layouts por usuário */
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
    /** cria ou atualiza o doc referente à um UID */
    updateUser: async (_, args) => {
      const user = args.user;
      setDocument(Fstore.USERS, user.uid!, user);
      return null;
    },
  },

  Note: {
    owner: async (parent) => {
      const user = (await getDocument<FstoreUsers>(
        Fstore.USERS,
        parent.owner.uid,
      ))!;
      return {
        uid: `${user.uid}`,
        photoURL: user.photoURL,
        email: user.email,
        displayName: user.displayName,
      };
    },
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

const enum Fstore {
  NOTES = 'notes',
  TAGS = 'tags',
  LAYOUTS = 'layouts',
  USERS = 'users',
}
type FstoreData = FstoreNote | FstoreLayouts | FstoreTags | FstoreUsers;
type FstoreNote = NoteInput;
type FstoreLayouts = MuralInput;
type FstoreUsers = UserInput;
// type FstoreUser =
type FstoreTags = {
  tags: Tag[];
};
