import clsx from 'clsx';
import React from 'react';
import { useFormState } from 'react-hook-form';

import { Button, ButtonProps } from '../../elements/buttons/Button';

export type SubmitProps = Omit<ButtonProps, 'type'>;

export function SubmitButtonRHF(props: SubmitProps): JSX.Element {
  const { disabled, className, ...otherProps } = props;
  const { isSubmitting } = useFormState();

  return (
    <Button
      disabled={isSubmitting || disabled}
      type="submit"
      className={clsx('sm:self-start', className)}
      {...otherProps}
    />
  );
}
