import {
  TextBold20Regular,
  TextItalic20Regular,
  TextUnderline20Regular,
} from '@fluentui/react-icons';
import React from 'react';
import { Editor } from 'slate';
import { useSlate } from 'slate-react';

import { CustomEditor } from '../types';

import { IconButton } from './IconButton';

const ICONS = {
  formatBold: <TextBold20Regular />,
  formatItalic: <TextItalic20Regular />,
  formatUnderlined: <TextUnderline20Regular />,
};

export type MarkFormat = 'bold' | 'italic' | 'underline';
export interface MarkButtonProps {
  format: MarkFormat;
  icon: keyof typeof ICONS;
}
export function MarkButton({ format, icon }: MarkButtonProps) {
  const editor = useSlate();
  const Icon = ICONS[icon];
  return (
    <IconButton
      onClick={(event) => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
      active={isMarkActive(editor, format)}
    >
      {Icon}
    </IconButton>
  );
}

export function toggleMark(editor: CustomEditor, format: MarkFormat) {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

function isMarkActive(editor: CustomEditor, format: MarkFormat) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}
