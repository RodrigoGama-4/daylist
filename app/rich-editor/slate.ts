import { BaseEditor, BaseElement } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type RichText = {
  type?: null;
  text: string;
  bold?: true;
  italic?: true;
  strike?: true;
  underline?: true;
  color?: string;
};

export interface Paragraph {
  type: 'Paragraph';
  children: RichText[];
  justify?: 'left' | 'center' | 'right' | 'even';
  header?: 1 | 2 | 3;
}

export interface BulletList {
  type: 'BulletList';
  children: RichText[];
}

export interface NumberList {
  type: 'NumberList';
  children: RichText[];
}

export interface CheckList {
  type: 'CheckList';
  children: RichText[];
}

export interface Image {
  type: 'Image';
  children: null;
}

export interface Audio {
  type: 'Audio';
  children: null;
}

export type CustomElement =
  | Paragraph
  | BulletList
  | NumberList
  | CheckList
  | Image
  | Audio;
export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & { type?: null };

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: RichText;
  }
}
