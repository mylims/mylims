import clsx from 'clsx';
import { useFormikContext } from 'formik';
import React from 'react';

import { Button, ButtonProps } from '../../elements/buttons/Button';

export type SubmitProps = Omit<ButtonProps, 'type'>;

export function SubmitButton(props: SubmitProps): JSX.Element {
  const { disabled, className, ...otherProps } = props;
  const { isSubmitting } = useFormikContext();

  return (
    <Button
      disabled={isSubmitting || disabled}
      type="submit"
      className={clsx('sm:self-start', className)}
      {...otherProps}
    />
  );
}
