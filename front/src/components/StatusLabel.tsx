import React from 'react';

import { Badge, BadgeVariant, Color } from '@components/tailwind-ui';

export interface StatusLabelProps<T> {
  status: T;
  getTagColor(status: T): Color;
}

export function StatusLabel<T>({ status, getTagColor }: StatusLabelProps<T>) {
  const color = getTagColor(status);
  return (
    <Badge
      variant={BadgeVariant.COLORED_BACKGROUND}
      label={status}
      color={color}
    />
  );
}
