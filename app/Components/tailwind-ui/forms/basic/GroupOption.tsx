import React, { Children, ReactElement } from 'react';

import {
  GroupOptionInternal,
  Option,
  OptionProps,
} from './internal/GroupOption';

export type { OptionProps };

export interface GroupOptionProps {
  label?: string;
  disabled?: boolean;
  hiddenLabel?: boolean;
  required?: boolean;
  children: ReactElement<OptionProps> | Array<React.ReactElement<OptionProps>>;
}

export function GroupOption(props: GroupOptionProps) {
  Children.forEach(props.children, (child) => {
    if (child.type !== Option) {
      throw new Error(
        'GroupOption expects children to be GroupOption.Option components only',
      );
    }
  });
  return <GroupOptionInternal {...props} />;
}

GroupOption.Option = Option;
