import { REMOVE_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalCommand } from 'lexical';
import React from 'react';

export interface ButtonFormatListProps {
  title: string;
  isActive: boolean;
  insert: LexicalCommand<void>;
  onClick(result: boolean): void;
}
export function ButtonFormatList({
  title,
  isActive,
  insert,
  onClick,
}: ButtonFormatListProps) {
  const [editor] = useLexicalComposerContext();

  const formatBlock = () => {
    editor.dispatchCommand(!isActive ? insert : REMOVE_LIST_COMMAND, undefined);
    onClick(false);
  };

  return (
    <button className="item" type="button" onClick={formatBlock}>
      <span className="text">{title}</span>
      {isActive && <span className="active" />}
    </button>
  );
}
