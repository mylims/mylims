import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapLeafNodesInElements } from '@lexical/selection';
import { $getSelection, $isRangeSelection, ElementNode } from 'lexical';
import React from 'react';

export interface ButtonFormatProps {
  title: string;
  isActive: boolean;
  createElement(): ElementNode;
}
export function ButtonFormat({
  title,
  isActive,
  createElement,
}: ButtonFormatProps) {
  const [editor] = useLexicalComposerContext();

  const formatBlock = () => {
    if (!isActive) {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, createElement);
        }
      });
    }
  };

  return (
    <button type="button" onClick={formatBlock} title={title}>
      {title}
    </button>
  );
}
