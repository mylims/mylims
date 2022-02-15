import React, { useState } from 'react';

import { SimpleWaferDicing } from '@/components/WaferDicing';
import {
  SearchSelectFieldRHF,
  Toggle,
  useSearchSelectFieldRHF,
} from '@/components/tailwind-ui';

interface WaferDiameterFieldProps {
  name: string;
  label: string;
  defaultCreation: boolean;
  setDefaultCreation(value: boolean): void;
  required?: boolean;
  options: Record<'value' | 'label', string>[];
}
export default function WaferDiameterField({
  name,
  label,
  required,
  defaultCreation,
  setDefaultCreation,
  options: initialOptions,
}: WaferDiameterFieldProps) {
  const [options, setOptions] = useState(initialOptions);
  const searchSelect = useSearchSelectFieldRHF({ name, options });

  return (
    <div className="flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
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
      <Toggle
        label="Create samples from diameter"
        onToggle={setDefaultCreation}
        activated={defaultCreation}
        className="my-4 md:my-0"
      />
      {defaultCreation && searchSelect.selected && (
        <div className="row-span-2">
          <SimpleWaferDicing
            size={250}
            diameter={searchSelect.selected.value}
          />
        </div>
      )}
    </div>
  );
}
