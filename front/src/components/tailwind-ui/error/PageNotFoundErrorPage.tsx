import { CheckIcon } from '@heroicons/react/outline';
import React, { useContext } from 'react';

import { Button } from '../elements/buttons/Button';
import { notificationContext } from '../overlays/NotificationContext';
import { Color } from '../types';

import { ErrorPage } from './ErrorPage';

interface PageNotFoundErrorPageProps {
  url: string;
}

export function PageNotFoundErrorPage(props: PageNotFoundErrorPageProps) {
  const context = useContext(notificationContext);
  const errorReport = `The page ${props.url} was not found`;

  function handleCopyReport() {
    void navigator.clipboard.writeText(errorReport).then(() => {
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
  }

  return (
    <ErrorPage
      title="Not found"
      subtitle="The page you are trying to access does not exist."
      code="404"
    >
      <Button onClick={handleCopyReport} color={Color.primary}>
        Copy report
      </Button>
    </ErrorPage>
  );
}
