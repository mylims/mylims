import React, { ReactNode } from 'react';

import { useBackendUrl } from '../hooks/useBackendUrl';

export default function Base(props: { children: ReactNode }) {
  const backendUrl = useBackendUrl();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>System configuration</title>
        <link rel="stylesheet" href={`${backendUrl}/tailwind.out.css`} />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
