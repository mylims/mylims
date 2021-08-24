import React from 'react';

import { StatusLabel } from '@components/StatusLabel';
import { Color } from '@components/tailwind-ui';
import { FileStatus } from '@generated/graphql';

interface FileStatusLabelProps {
  status: FileStatus;
}

export function getTagColor(status: FileStatus): Color {
  switch (status) {
    case 'imported': {
      return Color.primary;
    }
    case 'import_fail': {
      return Color.danger;
    }
    default: {
      return Color.warning;
    }
  }
}
export function FileStatusLabel({ status }: FileStatusLabelProps) {
  const color = getTagColor(status);
  return <StatusLabel status={status} color={color} />;
}
