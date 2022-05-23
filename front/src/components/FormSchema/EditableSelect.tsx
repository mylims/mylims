import React, { useState } from 'react';

import {
  SearchSelectFieldRHF,
  SearchSelectOnCreateCallback,
  useMultiSearchSelect,
} from '@/components/tailwind-ui';

interface EditableSelectProps {
  name: string;
  label: string;
  required?: boolean;
  options: Record<'value' | 'label', string>[];
}
export default function EditableSelect({
  name,
  label,
  required,
  options: initialOptions,
}: EditableSelectProps) {
  const [options, setOptions] = useState(initialOptions);
  const searchSelect = useMultiSearchSelect({ options });
  const handleCreate: SearchSelectOnCreateCallback<
    Record<'value' | 'label', string>
  > = (value, select) => {
    const newOption = { label: value, value };
    setOptions([...options, newOption]);
    select(newOption);
  };

  return (
    <SearchSelectFieldRHF
      name={name}
      label={label}
      required={required}
      canCreate={(val) => {
        return options.find(({ value }) => value === val) === undefined;
      }}
      onCreate={handleCreate}
      clearable
      {...searchSelect}
    />
  );
}
