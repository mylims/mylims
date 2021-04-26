import React, { ReactNode, useMemo } from 'react';

import { useAdonisContext } from '@ioc:React';

export default function Base(props: { children: ReactNode }) {
  const {
    app: { env },
  } = useAdonisContext();

  const backendUrl = useMemo(() => env.get('BACKEND_URL'), [env]);

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
