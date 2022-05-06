import { REMOVE_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapLeafNodesInElements } from '@lexical/selection';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalCommand,
} from 'lexical';
import React from 'react';

export interface ButtonFormatListProps {
  title: string;
  isActive: boolean;
  insert: LexicalCommand<void>;
}
export function ButtonFormatList({
  title,
  isActive,
  insert,
}: ButtonFormatListProps) {
  const [editor] = useLexicalComposerContext();

  const formatBlock = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        $wrapLeafNodesInElements(selection, () => $createParagraphNode());
      }
    });
    editor.dispatchCommand(!isActive ? insert : REMOVE_LIST_COMMAND, undefined);
  };

  return (
    <button type="button" onClick={formatBlock} title={title}>
      {title}
    </button>
  );
}
