import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorPage } from './ErrorPage';
import { ErrorReport } from './ErrorReport';

function ErrorReported(props: { error: Error }) {
  return (
    <ErrorPage title="Oooops" subtitle="Something unexpectedly went wrong">
      <div className="mr-8">
        <ErrorReport error={props.error} />
      </div>
    </ErrorPage>
  );
}

interface PageErrorBoundaryProps {
  children: ReactNode;
}

export function PageErrorBoundary(props: PageErrorBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorReported}>
      {props.children}
    </ErrorBoundary>
  );
}
