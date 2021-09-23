import React from 'react';
import { useFormState } from 'react-hook-form';

import { Button } from '../../elements/buttons/Button';
import { SubmitProps } from '../formik/SubmitButton';

export function SubmitButtonRHF(props: SubmitProps): JSX.Element {
  const { disabled, ...otherProps } = props;
  const { isSubmitting } = useFormState();

  return (
    <Button disabled={isSubmitting || disabled} type="submit" {...otherProps} />
  );
}
