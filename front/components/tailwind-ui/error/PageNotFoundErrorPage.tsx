import React, { useContext } from 'react';

import { Button } from '../elements/buttons/Button';
import { Alert, AlertType } from '../feedback/Alert';
import { NotificationContext } from '../overlays/NotificationContext';
import { SvgOutlineCheck } from '../svg/heroicon/outline';
import { Color } from '../types';

import { ErrorPage } from './ErrorPage';

interface PageNotFoundErrorPageProps {
  url: string;
}

export function PageNotFoundErrorPage(props: PageNotFoundErrorPageProps) {
  const context = useContext(NotificationContext);
  const errorReport = `The page ${props.url} was not found`;

  return (
    <ErrorPage
      title="Not found"
      subtitle="The page you are trying to access does not exist."
    >
      <div className="text-justify">
        <Alert title="What should I do?" type={AlertType.WARNING}>
          <p>
            If you landed on this page following an external link, the URL is
            probably outdated and not valid anymore, and there is no action to
            take.
          </p>
          <p className="mt-1">
            If you landed here while following a link in the application, then
            it&apos;s probably a bug. Please use the following button to copy
            the error report and send it to support with a description of the
            actions leading to the bug.
          </p>
          <Button
            className="mt-3"
            onClick={() => {
              void navigator.clipboard.writeText(errorReport).then(() => {
                if (context) {
                  context.addNotification(
                    {
                      title: 'Successfully copied error report',
                      content: '',
                      icon: <SvgOutlineCheck className="text-success-600" />,
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
    </ErrorPage>
  );
}
