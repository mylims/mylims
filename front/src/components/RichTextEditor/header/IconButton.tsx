import React from 'react';

import { Button, Color, Size, Variant } from '@/components/tailwind-ui';

export interface IconButtonProps {
  onClick(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  active?: boolean;
  children: React.ReactNode;
}
export function IconButton({ onClick, active, children }: IconButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant={active ? Variant.secondary : Variant.white}
      color={Color.primary}
      size={Size.xSmall}
    >
      {children}
    </Button>
  );
}
