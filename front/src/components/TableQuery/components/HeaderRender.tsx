import React, { ReactNode } from 'react';

interface HeaderRenderProps {
  title: string;
  children?: ReactNode;
}

const titleClassName =
  'px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase rounded-t-lg text-neutral-500 ';
export default function HeaderRender({ title, children }: HeaderRenderProps) {
  if (!children) return <th className={titleClassName}>{title}</th>;
  return (
    <th>
      <div className={titleClassName}>{title}</div>
      <div className="p-2">{children}</div>
    </th>
  );
}
