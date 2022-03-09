import React, { useState } from 'react';

import {
  MultiSearchSelectFieldRHF,
  useMultiSearchSelectFieldRHF,
} from '@/components/tailwind-ui';

interface MultiSelectProps {
  name: string;
  label: string;
  required?: boolean;
  options?: string[];
}
export default function MultiSelect({
  name,
  label,
  required,
  options: initialOptions,
}: MultiSelectProps) {
  const [options, setOptions] = useState(initialOptions ?? []);
  const multiSearchSelect = useMultiSearchSelectFieldRHF({ name, options });

  return (
    <MultiSearchSelectFieldRHF
      label={label}
      required={required}
      canCreate={(val) => {
        return options.find((value) => value === val) === undefined;
      }}
      onCreate={(value) => {
        setOptions([...options, value]);
        multiSearchSelect.onSelect([...multiSearchSelect.selected, value]);
      }}
      clearable
      {...multiSearchSelect}
    />
  );
}
