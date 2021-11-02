import React, { createContext, useContext } from 'react';

import { Variant, Color } from '../../types';

import { Button, ButtonProps } from './Button';

const context = createContext<{
  variant: Variant;
  color: Color;
  position: 'left' | 'right' | 'middle';
} | null>(null);

export interface ButtonGroupProps {
  variant?: Variant;
  color?: Color;
  size?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any[];
}

export function ButtonGroup(props: ButtonGroupProps): JSX.Element {
  const { children, variant = Variant.primary, color = Color.primary } = props;

  const definedChildren = children.filter((child) => child != null);
  const elements = React.Children.map(definedChildren, (child, index) => {
    const position =
      index === 0
        ? 'left'
        : index === (props.size ? props.size - 1 : definedChildren.length - 1)
        ? 'right'
        : 'middle';

    return (
      <context.Provider value={{ color, variant, position }}>
        {child}
      </context.Provider>
    );
  });

  return <span className="inline-flex rounded-md shadow-sm">{elements}</span>;
}

ButtonGroup.Button = function ButtonGroupButton(
  props: Omit<ButtonProps, 'group'>,
) {
  const ctx = useContext(context);

  if (ctx === null) {
    throw new Error('context for ButtonGroup was not provided');
  }

  const {
    children,
    color = ctx.color,
    variant = ctx.variant,
    ...other
  } = props;

  return (
    <Button color={color} variant={variant} group={ctx.position} {...other}>
      {children}
    </Button>
  );
};
