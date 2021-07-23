import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import React from 'react';

import { labelColor, labelDisabledColor } from './common';

export interface ToggleProps {
  label: string;
  activated: boolean;
  onToggle: (activated: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: ToggleSize;
  name?: string;
}

export enum ToggleSize {
  Small = 'Small',
  Large = 'Large',
}

function noop() {
  // noop
}

export function Toggle(props: ToggleProps) {
  if (props.size === ToggleSize.Large) {
    return <LargeToggle {...props} />;
  } else {
    return <SmallToggle {...props} />;
  }
}

function LargeToggle(props: ToggleProps): JSX.Element {
  const { label, activated, onToggle, disabled, name } = props;

  return (
    <Switch.Group
      as="div"
      className={clsx('flex items-center space-x-4', props.className)}
    >
      <Switch
        as="button"
        disabled={disabled}
        checked={activated}
        onChange={props.disabled ? noop : onToggle}
        className={clsx(
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-neutral-100',
          disabled ? 'cursor-default' : 'cursor-pointer',
          activated ? 'bg-primary-600' : 'bg-neutral-200',
        )}
      >
        {({ checked }) => (
          <>
            {name && (
              <input name={name} value={String(checked)} type="hidden" />
            )}
            <span
              className={clsx(
                'translate-x-0 inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
                checked ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </>
        )}
      </Switch>
      <Switch.Label
        className={clsx(
          'text-sm font-semibold',
          disabled ? labelDisabledColor : labelColor,
        )}
      >
        {label}
      </Switch.Label>
    </Switch.Group>
  );
}

function SmallToggle(props: ToggleProps) {
  const { label, activated, onToggle, disabled, name } = props;

  return (
    <Switch.Group
      as="div"
      className={clsx('flex items-center space-x-4', props.className)}
    >
      <Switch
        as="button"
        disabled={disabled}
        checked={activated}
        onChange={props.disabled ? noop : onToggle}
        className={clsx(
          'flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
          disabled ? 'cursor-default' : 'cursor-pointer',
        )}
      >
        {({ checked }) => (
          <>
            {name && (
              <input name={name} value={String(checked)} type="hidden" />
            )}
            <span
              className={clsx(
                'absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
                {
                  'bg-neutral-200': !disabled && !activated,
                  'bg-primary-600': !disabled && activated,
                  'bg-neutral-100': disabled,
                },
              )}
            />
            <span
              className={clsx(
                'absolute left-0 inline-block h-5 w-5 border border-neutral-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200',
                checked ? 'translate-x-5' : 'translate-x-0',
              )}
            />
          </>
        )}
      </Switch>
      <Switch.Label
        className={clsx(
          'text-sm font-semibold',
          disabled ? labelDisabledColor : labelColor,
        )}
      >
        {label}
      </Switch.Label>
    </Switch.Group>
  );
}
