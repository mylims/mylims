import { CheckIcon, ClipboardCopyIcon, XIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';

import { Spinner, Variant, Button } from '../..';

interface ClipboardButtonProps {
  onCopy: () => Promise<string>;
}

enum IconState {
  IDLE = 'IDLE',
  WAITING = 'WAITING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

function getClipboardIcon(state: IconState) {
  switch (state) {
    case IconState.IDLE:
      return <ClipboardCopyIcon className="w-5 h-5" />;
    case IconState.WAITING:
      return <Spinner className="w-5 h-5" />;
    case IconState.SUCCESS:
      return <CheckIcon className="w-5 h-5 text-success-400" />;
    case IconState.ERROR:
      return <XIcon className="w-5 h-5 text-danger-400" />;
    default:
      return <ClipboardCopyIcon className="w-5 h-5" />;
  }
}

export function ClipboardButton(props: ClipboardButtonProps) {
  const [iconState, setIconState] = useState(IconState.IDLE);

  useEffect(() => {
    let timeId: NodeJS.Timeout | null = null;

    if (iconState === IconState.SUCCESS || iconState === IconState.ERROR) {
      timeId = setTimeout(() => {
        setIconState(IconState.IDLE);
      }, 3000);
    }

    return () => {
      if (timeId !== null) {
        clearTimeout(timeId);
      }
    };
  }, [iconState]);

  function handleClick() {
    if (iconState !== IconState.IDLE) {
      return;
    }

    setIconState(IconState.WAITING);

    props
      .onCopy()
      .then((result) => {
        return navigator.clipboard.writeText(result).then(() => {
          setIconState(IconState.SUCCESS);
        });
      })
      .catch(() => {
        setIconState(IconState.ERROR);
      });
  }

  return (
    <Button
      disabled={iconState !== IconState.IDLE}
      variant={Variant.white}
      onClick={handleClick}
    >
      {getClipboardIcon(iconState)}
    </Button>
  );
}
