import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CustomText = {
  type?: '__text';
  text: string;
  bold?: true;
  italic?: true;
};

export interface Paragraph {
  type: 'paragraph';
  children: CustomText[];
}

export interface CodeElement {
  type: 'code';
  children: CustomText[];
}

export type ICustomElement = CodeElement | Paragraph;
export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & { type?: '__editor' };

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: ICustomElement;
    Text: CustomText;
  }
}
