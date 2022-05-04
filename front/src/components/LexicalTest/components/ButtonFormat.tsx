import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $wrapLeafNodesInElements } from '@lexical/selection';
import { $getSelection, $isRangeSelection, ElementNode } from 'lexical';
import React from 'react';

export interface ButtonFormatProps {
  title: string;
  isActive: boolean;
  onClick(result: boolean): void;
  createElement(): ElementNode;
}
export function ButtonFormat({
  title,
  isActive,
  onClick,
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
    onClick(false);
  };

  return (
    <button className="item" type="button" onClick={formatBlock}>
      <span className="text">{title}</span>
      {isActive && <span className="active" />}
    </button>
  );
}
