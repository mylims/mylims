import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalCommand } from 'lexical';
import React from 'react';

import { Button, Color, Size, Variant } from '@/components/tailwind-ui';

interface ButtonCommandProps {
  title: string;
  command: [LexicalCommand<void>, unknown];
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}
export function ButtonCommand({
  disabled,
  title,
  command,
  active,
  children,
}: ButtonCommandProps) {
  const [editor] = useLexicalComposerContext();
  return (
    <Button
      disabled={disabled}
      onClick={() => {
        editor.dispatchCommand(...command);
      }}
      aria-label={title}
      title={title}
      variant={active ? Variant.secondary : Variant.white}
      color={Color.primary}
      size={Size.xSmall}
    >
      {children}
    </Button>
  );
}

export function DivButtonCommand({
  command,
  children,
}: Omit<ButtonCommandProps, 'title' | 'active' | 'disabled'>) {
  const [editor] = useLexicalComposerContext();
  return (
    <div
      onClick={() => {
        editor.dispatchCommand(...command);
      }}
    >
      {children}
    </div>
  );
}
