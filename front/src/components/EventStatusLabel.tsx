import React from 'react';

import { StatusLabel } from '@/components/StatusLabel';
import { Color } from '@/components/tailwind-ui';
import { EventStatus } from '@/generated/graphql';

interface EventStatusLabelProps {
  status: EventStatus;
}

export function getTagColor(status: EventStatus): Color {
  switch (status) {
    case EventStatus.SUCCESS: {
      return Color.success;
    }
    case EventStatus.ERROR: {
      return Color.danger;
    }
    default: {
      return Color.warning;
    }
  }
}
export function EventStatusLabel({ status }: EventStatusLabelProps) {
  const color = getTagColor(status);
  return <StatusLabel status={status} color={color} />;
}
