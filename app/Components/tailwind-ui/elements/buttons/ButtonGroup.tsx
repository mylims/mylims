import React from 'react';

import { Variant, Color } from '../../types';

export interface ButtonGroupProps {
  variant?: Variant;
  color?: Color;
  size?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any[];
}

export function ButtonGroup(props: ButtonGroupProps): JSX.Element {
  const { children, variant = Variant.primary, color = Color.primary } = props;

  const elements = React.Children.map(children, (child, index) => {
    const group =
      index === 0
        ? 'left'
        : index === (props.size ? props.size - 1 : props.children.length - 1)
        ? 'right'
        : 'middle';

    return React.cloneElement(child, {
      group,
      variant: child.props.variant ? child.props.variant : variant,
      color,
    });
  });

  return (
    <span className="relative z-0 inline-flex rounded-md shadow-sm">
      {elements}
    </span>
  );
}
