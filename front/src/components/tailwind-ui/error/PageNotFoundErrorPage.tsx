import React from 'react';

import { ErrorPage } from './ErrorPage';

interface PageNotFoundErrorPageProps {
  url: string;
}

export function PageNotFoundErrorPage(props: PageNotFoundErrorPageProps) {
  return (
    <ErrorPage
      title="Not found"
      subtitle={
        <div className="flex flex-col">
          <span>The page you are trying to access does not exist.</span>
          <span>URL: {props.url}</span>
        </div>
      }
      code="404"
    />
  );
}
