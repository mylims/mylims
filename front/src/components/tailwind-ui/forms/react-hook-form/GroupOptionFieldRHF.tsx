import React, { Children, cloneElement } from 'react';
import { useFormContext, get } from 'react-hook-form';

import { GroupOptionProps, OptionProps } from '../basic/GroupOption';
import { Help } from '../basic/common';
import {
  GroupOption as GroupOptionInternal,
  Option,
} from '../basic/internal/GroupOption';
import { defaultErrorSerializer, FieldProps } from '../util';

export type GroupOptionFieldRHFProps = GroupOptionProps &
  FieldProps & {
    name: string;
  };

export function GroupOptionFieldRHF(props: GroupOptionFieldRHFProps) {
  const {
    formState: { errors },
  } = useFormContext();
  const error = get(errors, props.name);
  const childrenWithName = Children.map(props.children, (child) => {
    if (child.type !== OptionFieldRHF) {
      throw new Error(
        'GroupOptionFieldRHF expects children to be GroupOptionFieldRHF.Option components only',
      );
    }
    return cloneElement(child, { name: props.name });
  });

  const { serializeError = defaultErrorSerializer, ...otherProps } = props;
  return (
    <div>
      <GroupOptionInternal {...otherProps} children={childrenWithName} />
      {error && <Help error={serializeError(error)} />}
    </div>
  );
}

export function OptionFieldRHF(props: OptionProps): JSX.Element {
  const { register } = useFormContext();
  return <Option {...props} {...register(props.name)} />;
}

GroupOptionFieldRHF.Option = OptionFieldRHF as (
  props: Omit<OptionProps, 'name'>,
) => JSX.Element;
