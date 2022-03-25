import React, { ReactNode } from 'react';
import { Link, To } from 'react-router-dom';

import { Color, Button, Variant, Size } from '@/components/tailwind-ui';

interface LinkButtonProps {
  to: To;
  color?: Color;
  className?: string;
  title?: string;
  children: ReactNode;
}
export function LinkButton({
  to,
  color,
  className,
  title,
  children,
}: LinkButtonProps) {
  return (
    <Link to={to} title={title}>
      <Button
        className={className}
        variant={Variant.secondary}
        color={color ?? Color.primary}
        size={Size.small}
      >
        {children}
      </Button>
    </Link>
  );
}
