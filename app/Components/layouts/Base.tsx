import React, { ReactNode } from 'react';

import env from '../../../env';

const backendUrl = env.BACKEND_URL;

export default function Base(props: { children: ReactNode }) {
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
