import React, { useState } from 'react';

import {
  MultiSearchSelectFieldRHF,
  SearchSelectOnCreateCallback,
  useMultiSearchSelect,
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
  const multiSearchSelect = useMultiSearchSelect({ options });
  const handleCreate: SearchSelectOnCreateCallback<string> = (
    value,
    select,
  ) => {
    setOptions([...options, value]);
    select(value);
  };

  return (
    <MultiSearchSelectFieldRHF
      name={name}
      label={label}
      required={required}
      canCreate={(val) => {
        return options.find((value) => value === val) === undefined;
      }}
      onCreate={handleCreate}
      clearable
      {...multiSearchSelect}
    />
  );
}
