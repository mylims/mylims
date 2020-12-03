import React, { ReactNode } from 'react';

export default function Base(props: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <title>System configuration</title>
        <link rel="stylesheet" href="/tailwind.out.css" />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
