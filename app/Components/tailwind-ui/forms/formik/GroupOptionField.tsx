import { useField } from 'formik';
import React from 'react';

import { GroupOption, OptionProps } from '../basic/GroupOption';

type GroupOptionFieldProps = OptionProps;

export function OptionField(props: GroupOptionFieldProps): JSX.Element {
  const [field] = useField({ ...props, type: 'radio' });
  return <GroupOption.Option {...props} {...field} />;
}
