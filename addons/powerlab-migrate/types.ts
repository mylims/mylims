import { BaseEditor } from 'slate';

export type CustomEditor = BaseEditor;

interface BaseElement<T> {
  type: T;
  children: CustomText[];
}
export interface ImageElement extends BaseElement<'image'> {
  uuid: string;
  alt?: string;
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
  | ImageElement
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
