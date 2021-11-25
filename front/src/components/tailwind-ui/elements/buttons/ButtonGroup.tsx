import clsx from 'clsx';
import React, { Children, createContext, ReactNode, useContext } from 'react';

import { Roundness, Size } from '../..';
import { Variant, Color } from '../../types';
import { Dropdown, DropdownProps } from '../dropdown/Dropdown';

import { Button, ButtonProps } from './Button';
import { getButtonClassName } from './utils';

interface ButtonGroupContext {
  variant: Variant;
  color: Color;
  group: 'left' | 'right' | 'middle';
  size: Size;
  roundness: Roundness.full | Roundness.light;
}

const context = createContext<ButtonGroupContext | null>(null);

export interface ButtonGroupProps {
  variant?: Variant;
  color?: Color;
  children: ReactNode;
  size?: Size;
  roundness?: Roundness.full | Roundness.light;
}

export function ButtonGroup(props: ButtonGroupProps): JSX.Element {
  const {
    children,
    variant = Variant.white,
    color = Color.primary,
    size = Size.medium,
    roundness = Roundness.light,
  } = props;

  const definedChildren = Children.toArray(children).filter(
    (child) => child != null,
  );
  const childrenCount = Children.count(definedChildren);
  const elements = Children.map(definedChildren, (child, index) => {
    const group =
      index === 0 ? 'left' : index === childrenCount - 1 ? 'right' : 'middle';

    return (
      <context.Provider value={{ color, variant, group, size, roundness }}>
        {child}
      </context.Provider>
    );
  });

  return (
    <span
      className={clsx(
        'inline-flex shadow-sm',
        roundness === Roundness.full ? 'rounded-full' : 'rounded-md',
      )}
    >
      {elements}
    </span>
  );
}

ButtonGroup.Button = function ButtonGroupButton(
  props: Omit<ButtonProps, 'group'>,
) {
  const ctx = useContext(context);

  if (ctx === null) {
    throw new Error('context for ButtonGroup was not provided');
  }

  const {
    variant = ctx.variant,
    color = ctx.color,
    size = ctx.size,
    roundness = ctx.roundness,
  } = props;

  return (
    <Button
      {...props}
      group={ctx.group}
      variant={variant}
      color={color}
      size={size}
      roundness={roundness}
    />
  );
};

ButtonGroup.Dropdown = function ButtonGroupDropdown<T>(
  props: Omit<DropdownProps<T>, 'buttonClassName' | 'noDefaultButtonStyle'> &
    Pick<ButtonProps, 'variant' | 'color'>,
) {
  const ctx = useContext(context);

  if (ctx === null) {
    throw new Error('context for ButtonGroup was not provided');
  }

  const options = {
    ...ctx,
    ...props,
  };
  const className = getButtonClassName({
    ...options,
    noBorder: false,
  });

  return (
    <Dropdown
      {...props}
      buttonClassName={className}
      noDefaultButtonStyle
      {...ctx}
    />
  );
};
