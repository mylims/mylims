import { useField } from 'formik';
import React from 'react';

import { Toggle, ToggleProps } from '../basic/Toggle';

export interface ToggleFieldProps
  extends Omit<ToggleProps, 'activated' | 'onToggle'> {
  name: string;
  label: string;
}

export function ToggleField(props: ToggleFieldProps): JSX.Element {
  const { name, ...otherProps } = props;
  const [field, , helper] = useField(name);

  return (
    <Toggle
      onToggle={helper.setValue}
      activated={Boolean(field.value)}
      {...otherProps}
      {...field}
    />
  );
}
