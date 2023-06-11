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
  type: 'paragraph';
  children: RichText[];
  align?: 'left' | 'center' | 'right' | 'justify';
  header?: 1 | 2 | 3;
}

export interface BulletList {
  type: 'bullet-list';
  children: RichText[];
}

export interface NumberList {
  type: 'number-list';
  children: RichText[];
}

export interface CheckList {
  type: 'check-list';
  children: RichText[];
}

export interface Image {
  type: 'image';
  url: string;
  children?: null;
}

export interface Audio {
  type: 'audio';
  url: string;
  children?: null;
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
