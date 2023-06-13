import { BaseEditor, BaseElement } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type RichText = {
  text: string;
  bold?: true;
  italic?: true;
  strike?: true;
  underline?: true;
  color?: string;
};

interface CommonProps<T extends string> {
  type: T;
  children?: RichText[];
}

interface BulletList extends CommonProps<'bullet-list'> {}
interface NumberList extends CommonProps<'number-list'> {}
interface ListItem extends CommonProps<'list-item'> {}
interface CheckList extends CommonProps<'check-list'> {}
interface CheckItem extends CommonProps<'check-item'> {}
export interface Paragraph extends CommonProps<'paragraph'> {
  align?: 'left' | 'center' | 'right' | 'justify';
  header?: 1 | 2 | 3;
}
interface Image extends CommonProps<'image'> {
  url: string;
}
interface Audio extends CommonProps<'audio'> {
  url: string;
}

export type CustomElement =
  | Paragraph
  | BulletList
  | NumberList
  | ListItem
  | CheckList
  | CheckItem
  | Image
  | Audio;
export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: RichText;
  }
}
