import React from 'react';

import {
  MultiSearchSelectFieldRHF,
  useMultiSearchSelect,
} from '@/components/tailwind-ui';

interface MultiSelectProps {
  name: string;
  label: string;
  required?: boolean;
  options: Record<'value' | 'label', string>[];
}
export default function MultiSelect({
  name,
  label,
  required,
  options,
}: MultiSelectProps) {
  const multiSearchSelectSimple = useMultiSearchSelect({ options });
  return (
    <MultiSearchSelectFieldRHF
      name={name}
      label={label}
      required={required}
      {...multiSearchSelectSimple}
    />
  );
}
