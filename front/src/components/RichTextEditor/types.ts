// This example is for an Editor with `ReactEditor` and `HistoryEditor`
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

interface BaseElement<T> {
  type: T;
  children: CustomText[];
}
export type ParagraphElement = BaseElement<'paragraph'>;
export type HeadingElement = BaseElement<'heading-one' | 'heading-two'>;
export type ListItemElement = BaseElement<'list-item'>;
export interface BulletedListElement {
  type: 'bulleted-list';
  children: ListItemElement[];
}
export interface NumberedListElement {
  type: 'numbered-list';
  children: ListItemElement[];
}

export type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement;
export type CustomFormat = CustomElement['type'];

export interface FormattedText {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
}

export type CustomText = FormattedText;

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
