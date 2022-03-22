import React, { ReactNode } from 'react';

interface FormLayoutProps {
  formGrid: ReactNode;
  formAttachments: ReactNode;
  formEditor: ReactNode;
}
export function FormLayout({
  formGrid,
  formAttachments,
  formEditor,
}: FormLayoutProps) {
  return (
    <div className="my-2 flex flex-col lg:w-full lg:flex-row lg:gap-4">
      <div className="lg:w-2/3">
        <div className="grid-cols-auto grid items-end gap-4">{formGrid}</div>
        <div>{formAttachments}</div>
      </div>
      <div className="lg:w-1/3">{formEditor}</div>
    </div>
  );
}
