import { CheckIcon } from '@heroicons/react/outline';
import React, { useContext } from 'react';

import { Button } from '../elements/buttons/Button';
import { Alert, AlertType } from '../feedback/Alert';
import { NotificationContext } from '../overlays/NotificationContext';
import { Color } from '../types';

export function ErrorReport({
  error,
  componentStack,
}: {
  error: Error;
  componentStack?: string | null;
}) {
  componentStack = componentStack?.replace(/^\s+/, '');
  const details = `${
    componentStack ? `<br>Error details:\n\n${componentStack}\n\n\n` : ''
  }${error.stack || ''}`;
  const context = useContext(NotificationContext);

  return (
    <div className="text-justify">
      <Alert title="What should I do?" type={AlertType.WARNING}>
        <div>
          Please use the following button to copy the error report and send it
          to support with a description of your actions preceding the bug.
        </div>
        <Button
          className="mt-3"
          onClick={() => {
            void navigator.clipboard.writeText(details).then(() => {
              if (context) {
                context.addNotification(
                  {
                    title: 'Successfully copied error report',
                    content: '',
                    icon: <CheckIcon className="text-success-600" />,
                  },
                  3000,
                );
              }
            });
          }}
          color={Color.warning}
        >
          Copy report
        </Button>
      </Alert>
    </div>
  );
}
