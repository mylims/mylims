import { useField } from 'formik';
import React from 'react';

import { Toggle } from '../basic/Toggle';

export interface ToggleFieldProps {
  name: string;
  label: string;
  disabled?: boolean;
}

export function ToggleField(props: ToggleFieldProps): JSX.Element {
  const [field, , helper] = useField(props);

  return (
    <Toggle
      label={props.label}
      disabled={props.disabled}
      onToggle={helper.setValue}
      activated={Boolean(field.value)}
      {...field}
    />
  );
}
