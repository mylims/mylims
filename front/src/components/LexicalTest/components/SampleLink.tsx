import { CheckIcon, XIcon, ChipIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';

import {
  Button,
  Spinner,
  Variant,
  Color,
  useDebounce,
} from '@/components/tailwind-ui';

enum IconState {
  IDLE = 'IDLE',
  WAITING = 'WAITING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

function getIcon(state: IconState) {
  switch (state) {
    case IconState.WAITING:
      return <Spinner className="h-5 w-5" />;
    case IconState.SUCCESS:
      return <CheckIcon className="h-5 w-5" />;
    case IconState.ERROR:
      return <XIcon className="h-5 w-5" />;
    case IconState.IDLE:
    default:
      return <ChipIcon className="h-5 w-5" />;
  }
}
function getColor(state: IconState) {
  switch (state) {
    case IconState.SUCCESS:
      return Color.success;
    case IconState.ERROR:
      return Color.warning;
    case IconState.WAITING:
    case IconState.IDLE:
    default:
      return Color.neutral;
  }
}

interface SampleLinkProps {
  keyNode: string;
  sampleCode: string;
  setSampleCode(sampleCode: string): void;
}
export function SampleLink({
  keyNode,
  sampleCode,
  setSampleCode,
}: SampleLinkProps) {
  const id = `sample-link-${keyNode}`;
  const [iconState, setIconState] = useState(IconState.IDLE);
  const code = useDebounce(sampleCode, 1000);

  useEffect(() => {
    let timeId: NodeJS.Timeout | null = null;

    if (iconState === IconState.SUCCESS || iconState === IconState.ERROR) {
      timeId = setTimeout(() => {
        setIconState(IconState.IDLE);
      }, 3000);
    }

    return () => {
      if (timeId !== null) clearTimeout(timeId);
    };
  }, [iconState]);

  return (
    <span className="inline-flex shadow-sm">
      <Button
        className="inline-flex items-center rounded-l-md rounded-r-none border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 sm:text-sm"
        disabled={iconState !== IconState.IDLE}
        variant={Variant.secondary}
        color={getColor(iconState)}
        style={{ padding: '0.25rem 0.5rem' }}
      >
        {getIcon(iconState)}
      </Button>
      <label
        htmlFor={id}
        className={clsx(
          'rounded-r-md border bg-white py-1 px-2 focus-within:ring-1',
          'relative flex flex-1 flex-row items-center text-base shadow-sm sm:text-sm',
          'border-neutral-300 placeholder-neutral-400 focus-within:border-primary-500',
          'focus-within:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500',
        )}
      >
        <input
          type="text"
          id={id}
          className="flex-1 border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
          value={sampleCode}
          onChange={(e) => setSampleCode(e.target.value)}
          size={sampleCode.length}
          autoFocus
        />
      </label>
    </span>
  );
}
