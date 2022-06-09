import React, { ReactNode } from 'react';
import { Link, To } from 'react-router-dom';

import {
  Color,
  Button,
  Variant,
  Size,
  Roundness,
} from '@/components/tailwind-ui';

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
        aria-label={title}
      >
        {children}
      </Button>
    </Link>
  );
}

export function LinkIcon({
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
        roundness={Roundness.circular}
        color={color ?? Color.primary}
        size={Size.small}
        aria-label={title}
      >
        {children}
      </Button>
    </Link>
  );
}

export function DownloadButton({
  to,
  color,
  className,
  title,
  children,
}: LinkButtonProps) {
  if (typeof to !== 'string') return null;
  return (
    <a href={to} target="_blank" rel="noreferrer" title={title}>
      <Button
        className={className}
        variant={Variant.secondary}
        roundness={Roundness.circular}
        color={color ?? Color.primary}
        size={Size.small}
        aria-label={title}
      >
        {children}
      </Button>
    </a>
  );
}
