import { useField } from 'formik';
import React from 'react';

import { Toggle, ToggleProps } from '../basic/Toggle';

export interface ToggleFieldProps
  extends Omit<ToggleProps, 'activated' | 'onToggle'> {
  name: string;
  label: string;
}

export function ToggleField(props: ToggleFieldProps): JSX.Element {
  const { name, label } = props;
  const [field, meta, helper] = useField(name);

  return (
    <Toggle
      label={label}
      onToggle={helper.setValue}
      activated={Boolean(field.value)}
      error={meta.touched ? meta.error : undefined}
    />
  );
}
