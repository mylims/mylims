import React, { ReactNode } from 'react';

export default function Card(props: { title: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow">
      <div className="px-4 py-5 border-b border-neutral-200 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-neutral-900">
          {props.title}
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">{props.children}</div>
    </div>
  );
}
