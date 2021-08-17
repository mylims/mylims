import React from 'react';

import { Color } from '@components/tailwind-ui';
import { FileStatus } from '@generated/graphql';
import { StatusLabel } from '@components/StatusLabel';

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
  return <StatusLabel status={status} getTagColor={getTagColor} />;
}
