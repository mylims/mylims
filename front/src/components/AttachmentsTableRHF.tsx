import React from 'react';
import { useController } from 'react-hook-form';

import AttachmentsTable from './AttachmentsTable';

interface RichTextFieldRHFProps {
  name: string;
  className?: string;
}
export default function AttachmentsTableRHF({
  name,
  className,
}: RichTextFieldRHFProps) {
  const { field } = useController({ name });
  return <AttachmentsTable attachments={field.value} className={className} />;
}
