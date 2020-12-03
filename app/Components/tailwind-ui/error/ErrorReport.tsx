import React from 'react';

import { Button } from '../elements/buttons/Button';
import { Alert, AlertType } from '../feedback/Alert';
import { useNotificationCenter } from '../overlays/NotificationCenter';
import { SvgOutlineCheck } from '../svg/heroicon/outline';
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
  const { addNotification } = useNotificationCenter();
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
              addNotification(
                {
                  title: 'Successfully copied error report',
                  content: '',
                  icon: (
                    <SvgOutlineCheck className="w-5 h-5 text-success-600" />
                  ),
                },
                3000,
              );
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
