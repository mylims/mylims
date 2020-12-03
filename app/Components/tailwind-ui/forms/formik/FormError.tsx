import { useFormikContext } from 'formik';
import React from 'react';

import { Alert, AlertType } from '../../feedback/Alert';

const graphqlPrefix = 'GraphQL error: ';

export function FormError<T>(props: {
  className?: string;
}): JSX.Element | null {
  const { status } = useFormikContext<T>();

  if (!status?.error) {
    return null;
  }

  const message =
    typeof status.error.message === 'string' && status.error.message !== ''
      ? status.error.message.replace(graphqlPrefix, '')
      : 'Unknown error';

  return (
    <Alert className={props.className} title={message} type={AlertType.ERROR} />
  );
}
