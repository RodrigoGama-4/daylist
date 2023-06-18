/** Typed resolvers */
import { db } from '@/src/firebase';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { Resolvers, Note, StatusOk } from '../types/graphql';

const resolvers: Resolvers = {
  Query: {
    hello: () => 'Hello',
    world: () => 'World!',
    note: (p, args) => {
      const id = args.id;
      const note: Note = {
        content: 'conteudo',
        id: id as string,
        title: 'titulo',
        owner: {
          id: '1',
          name: 'nome da pessoa',
          email: 'email@gmail.com',
        },
      };
      return note;
    },
  },
  Mutation: {
    teste: () => {
      return { success: true, teste: 'caso geral' };
    },
    createNote: async (_, args) => {
      const _doc = await addDoc(collection(db, 'notes'), {
        content: args.content,
      });
      const id = _doc.id;
      return { id, content: args.content };
    },
  },
  StatusOK: {
    teste: (parent) =>
      parent.teste === 'caso geral'
        ? 'Executou caso geral, e sobreescreveu com o resolver específico'
        : 'Não ocorre',
  },
};
export default resolvers;
