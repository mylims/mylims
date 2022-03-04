import { ImageAdd24Regular } from '@fluentui/react-icons';
import React, { MouseEvent } from 'react';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { useSlate } from 'slate-react';

import { CustomEditor, ImageElement } from '../types';

import { IconButton } from './IconButton';

interface ImageButtonProps {
  onClick(): void;
}
export default function ImageButton({ onClick }: ImageButtonProps) {
  const editor = useSlate();
  return (
    <IconButton onClick={onClick} active={isImageActive(editor)}>
      <ImageAdd24Regular />
    </IconButton>
  );
}

export function insertImage(editor: CustomEditor, url: string) {
  const image: ImageElement = {
    type: 'image',
    uuid: url,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, image);
}

function isImageActive(editor: CustomEditor) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (node) =>
        !Editor.isEditor(node) &&
        SlateElement.isElement(node) &&
        node.type === 'image',
    }),
  );

  return !!match;
}
