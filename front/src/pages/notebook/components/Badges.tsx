import React from 'react';

import { Badge, BadgeVariant, Color } from '@/components/tailwind-ui';
import { NotebookListItem } from '@/pages/notebook/models';

interface NotebookProps {
  notebook: NotebookListItem;
}
export function SampleCodeBadge({ notebook: { samples } }: NotebookProps) {
  if (samples.length === 0) return <span>-</span>;
  return (
    <>
      {samples.map((sample) => (
        <Badge
          key={sample.id}
          variant={BadgeVariant.COLORED_BACKGROUND}
          label={sample.sampleCode.join('_')}
          color={Color.primary}
        />
      ))}
    </>
  );
}

export function LabelsBadge({ notebook: { labels, id } }: NotebookProps) {
  if (!labels || labels.length === 0) return <span>-</span>;

  return (
    <>
      {labels.map((label) => (
        <Badge
          key={`${id}-${label}`}
          variant={BadgeVariant.COLORED_BACKGROUND}
          label={label}
          color={Color.primary}
        />
      ))}
    </>
  );
}
