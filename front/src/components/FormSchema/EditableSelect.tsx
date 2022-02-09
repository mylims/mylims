import React, { useState } from 'react';

import {
  SearchSelectFieldRHF,
  useSearchSelectFieldRHF,
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
  const searchSelect = useSearchSelectFieldRHF({ name, options });

  return (
    <SearchSelectFieldRHF
      label={label}
      required={required}
      canCreate={(val) => {
        return options.find(({ value }) => value === val) === undefined;
      }}
      onCreate={(value) => {
        const newOption = { label: value, value };
        setOptions([...options, newOption]);
        searchSelect.onSelect(newOption);
      }}
      clearable
      {...searchSelect}
    />
  );
}
