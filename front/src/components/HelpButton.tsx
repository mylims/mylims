import { QuestionMarkCircleIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React from 'react';

import { Button, Color, Roundness, Variant } from '@/components/tailwind-ui';

interface HelpButtonProps {
  description: string;
  className?: string;
}

export default function HelpButton({
  description,
  className,
}: HelpButtonProps) {
  return (
    <Button
      color={Color.neutral}
      roundness={Roundness.circular}
      variant={Variant.secondary}
      className={clsx(className)}
      title={description}
    >
      <QuestionMarkCircleIcon className="w-3 h-3" />
    </Button>
  );
}
