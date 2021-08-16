import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/solid';
import React from 'react';

import { Button, Color, Roundness, Variant } from '@components/tailwind-ui';

interface ExpandButtonProps {
  expanded: boolean;
  onExpand: () => void;
}

export default function ExpandButton({
  expanded,
  onExpand,
}: ExpandButtonProps) {
  return (
    <Button
      color={Color.neutral}
      roundness={Roundness.circular}
      variant={Variant.secondary}
      className="mr-2"
      title="Expand"
      onClick={onExpand}
    >
      {expanded ? (
        <ChevronUpIcon className="w-3 h-3" />
      ) : (
        <ChevronDownIcon className="w-3 h-3" />
      )}
    </Button>
  );
}
