import {
  TextHeader120Regular,
  TextHeader220Regular,
  TextNumberListLtr20Regular,
  TextBulletListLtr20Regular,
} from '@fluentui/react-icons';
import React from 'react';
import { Transforms, Editor, Element as SlateElement } from 'slate';
import { useSlate } from 'slate-react';

import { CustomEditor, CustomFormat as BlockFormat } from '../types';

import { IconButton } from './IconButton';

const ICONS = {
  looksOne: <TextHeader120Regular />,
  looksTwo: <TextHeader220Regular />,
  formatListNumbered: <TextNumberListLtr20Regular />,
  formatListBulleted: <TextBulletListLtr20Regular />,
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

interface BlockButtonProps {
  format: BlockFormat;
  icon: keyof typeof ICONS;
}
export function BlockButton({ format, icon }: BlockButtonProps) {
  const editor = useSlate();
  const Icon = ICONS[icon];
  return (
    <IconButton
      onClick={(event) => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
      active={isBlockActive(editor, format)}
    >
      {Icon}
    </IconButton>
  );
}

/**
 * Applies format to selected text
 * @param editor Instance of slate editor
 * @param format Which block format to toggle
 */
function toggleBlock(editor: CustomEditor, format: BlockFormat) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes(n.type),
    split: true,
  });
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

/**
 * Checks if the current selection is matching the format type block
 * @param editor Instance of slate editor
 * @param format Which block format to check
 */
function isBlockActive(editor: CustomEditor, format: BlockFormat) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        node.type === format,
    }),
  );

  return !!match;
}
