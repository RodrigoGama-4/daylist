import { Descendant } from 'slate';
import { Priority } from './NoteInfo';
import { Note as Nota } from '@/graphql/types/graphql';

export default class Note {
  readonly id: string;
  /** Slate.js object of the note's entire content */
  readonly content: Descendant[];
  /** parsed title extracted from this.content */
  readonly title: string;
  priority = Priority.NONE;
  constructor(nota: Nota) {
    this.id = nota.id;
    this.content = JSON.parse(nota.content);
    // TODO: extrair título
    this.title = 'TODO';
  }
}
