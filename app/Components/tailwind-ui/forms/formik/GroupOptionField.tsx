import { useField } from 'formik';
import React, { Children, cloneElement } from 'react';

import { GroupOptionProps, OptionProps } from '../basic/GroupOption';
import { Help } from '../basic/common';
import { GroupOptionInternal, Option } from '../basic/internal/GroupOption';

export function GroupOptionField(
  props: GroupOptionProps & {
    name: string;
  },
) {
  const [, meta] = useField(props.name);
  const childrenWithName = Children.map(props.children, (child) => {
    if (child.type !== OptionField) {
      throw new Error(
        'GroupOptionField expects children to be GroupOptionField.Option components only',
      );
    }
    return cloneElement(child, { name: props.name });
  });
  return (
    <div>
      <GroupOptionInternal {...props} children={childrenWithName} />
      {meta.touched && meta.error && <Help error={meta.error} />}
    </div>
  );
}

export function OptionField(props: OptionProps): JSX.Element {
  const [field] = useField({ ...props, type: 'radio' });
  return <Option {...props} {...field} />;
}

GroupOptionField.Option = OptionField as (
  props: Omit<OptionProps, 'name'>,
) => JSX.Element;
