import { ImageAdd24Regular } from '@fluentui/react-icons';
import React from 'react';
import { Editor, Transforms, Element as SlateElement } from 'slate';
import { useSlate } from 'slate-react';

import { CustomEditor, ImageElement } from '../types';

import { IconButton } from './IconButton';

export default function ImageButton() {
  const editor = useSlate();
  return (
    <IconButton
      onClick={(event) => {
        event.preventDefault();
        const url = window.prompt('Enter the URL of the image:');
        if (!url) {
          alert('URL is not an image');
          return;
        }
        insertImage(editor, url);
      }}
      active={isImageActive(editor)}
    >
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
