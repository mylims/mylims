import clsx from 'clsx';
import React from 'react';

import { Alert, AlertType } from '../../feedback/Alert';

import { useFormStatus } from './FormRHF';

const graphqlPrefix = 'GraphQL error: ';

export function FormErrorRHF(props: {
  className?: string;
}): JSX.Element | null {
  const [status] = useFormStatus();

  if (!status?.error) {
    return null;
  }

  const message =
    typeof status.error.message === 'string' && status.error.message !== ''
      ? status.error.message.replace(graphqlPrefix, '')
      : 'Unknown error';

  return (
    <Alert
      className={clsx(props.className, 'whitespace-pre-wrap')}
      title={message}
      type={AlertType.ERROR}
    />
  );
}
