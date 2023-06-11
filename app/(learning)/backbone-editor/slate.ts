import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type ICustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type ICustomText = {
  text: string;
  bold?: true;
  italic?: true;
};

export interface IParagraphElement {
  type: 'paragraph';
  children: ICustomText[];
}

export interface ICodeElement {
  type: 'code';
  children: ICustomText[];
}

export type ICustomElement = ICodeElement | IParagraphElement;

// declare module 'slate' {
//   interface CustomTypes {
//     Editor: ICustomEditor;
//     Element: ICustomElement;
//     Text: ICustomText;
//   }
// }
