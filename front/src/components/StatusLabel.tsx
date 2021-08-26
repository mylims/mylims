import React from 'react';

import { Badge, BadgeVariant, Color } from '@/components/tailwind-ui';

export interface StatusLabelProps {
  status: string;
  color: Color;
}

export function StatusLabel({ status, color }: StatusLabelProps) {
  return (
    <Badge
      variant={BadgeVariant.COLORED_BACKGROUND}
      label={status}
      color={color}
    />
  );
}
