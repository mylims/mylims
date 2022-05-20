import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef, ReactNode, Ref } from 'react';

import { Help, labelColor, labelDisabledColor } from './common';

export interface ToggleProps {
  label: string;
  activated: boolean;
  onToggle: (activated: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: ToggleSize;
  name?: string;
  error?: string;
}

interface TogglePropsWithRef extends ToggleProps {
  inputRef: Ref<HTMLInputElement>;
}

export enum ToggleSize {
  Small = 'Small',
  Large = 'Large',
}

function noop() {
  // noop
}

const switchFocus =
  'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500';

export const Toggle = forwardRef(function ToggleForwardRef(
  props: ToggleProps,
  ref: Ref<HTMLInputElement>,
) {
  return (
    <WrapperToggle error={props.error}>
      {props.size === ToggleSize.Large ? (
        <LargeToggle {...props} inputRef={ref} />
      ) : (
        <SmallToggle {...props} inputRef={ref} />
      )}
    </WrapperToggle>
  );
});

function WrapperToggle(props: { children: ReactNode; error?: string }) {
  const { children, error } = props;

  return (
    <div>
      {children}
      {error && <Help error={error} />}
    </div>
  );
}

function LargeToggle(props: Omit<TogglePropsWithRef, 'size'>): JSX.Element {
  const { label, activated, onToggle, disabled, name, inputRef, error } = props;

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
          'relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out  disabled:bg-neutral-100',
          switchFocus,
          disabled ? 'cursor-default' : 'cursor-pointer',
          activated && !error ? 'bg-primary-600' : 'bg-neutral-200',
        )}
      >
        {({ checked }) => (
          <>
            {name && (
              <input
                ref={inputRef}
                name={name}
                value={String(checked)}
                type="checkbox"
                className="sr-only"
              />
            )}
            <span
              className={clsx(
                'inline-block h-5 w-5 translate-x-0 rounded-full shadow ring-0 transition duration-200 ease-in-out',
                checked ? 'translate-x-5' : 'translate-x-0',
                {
                  'bg-danger-600': error,
                  'bg-white': !error,
                },
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

function SmallToggle(props: Omit<TogglePropsWithRef, 'size'>) {
  const { label, activated, onToggle, disabled, name, inputRef, error } = props;

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
          'group relative inline-flex h-5 w-10 shrink-0 items-center justify-center rounded-full',
          switchFocus,
          disabled ? 'cursor-default' : 'cursor-pointer',
        )}
      >
        {({ checked }) => (
          <>
            {name && (
              <input
                ref={inputRef}
                name={name}
                value={String(checked)}
                type="checkbox"
                className="sr-only"
              />
            )}
            <span
              className={clsx(
                'absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out',
                {
                  'bg-neutral-200': !disabled && !activated && !error,
                  'bg-primary-600': !disabled && activated && !error,
                  'bg-neutral-100': disabled && !error,
                  'bg-danger-600': error,
                },
              )}
            />
            <span
              className={clsx(
                'absolute left-0 inline-block h-5 w-5 rounded-full border border-neutral-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out',
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
