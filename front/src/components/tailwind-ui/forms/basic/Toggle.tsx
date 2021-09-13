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

function LargeToggle(props: TogglePropsWithRef): JSX.Element {
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
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200  disabled:bg-neutral-100',
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
                'translate-x-0 inline-block h-5 w-5 rounded-full shadow transform ring-0 transition ease-in-out duration-200',
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

function SmallToggle(props: TogglePropsWithRef) {
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
          'flex-shrink-0 group relative rounded-full inline-flex items-center justify-center h-5 w-10',
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
                'absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
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
