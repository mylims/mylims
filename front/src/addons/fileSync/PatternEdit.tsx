import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React from 'react';

import {
  Button,
  Color,
  InputField,
  RadioField,
  Size,
  Variant,
} from '@/components/tailwind-ui';

interface PatternEditProps {
  remove: ArrayHelpers['remove'];
  index: number;
}

export default function PatternEdit({ remove, index }: PatternEditProps) {
  return (
    <div className="m-1 grid grid-cols-3 rounded-lg p-2 shadow">
      <div className="col-span-2">
        <RadioField
          value="include"
          name={`patterns.${index}.type`}
          label="Include"
        />
        <RadioField
          value="exclude"
          name={`patterns.${index}.type`}
          label="Exclude"
        />
        <InputField
          name={`patterns.${index}.pattern`}
          label="Pattern"
          hiddenLabel
        />
      </div>
      <Button
        className="self-center justify-self-center"
        size={Size.xSmall}
        color={Color.danger}
        variant={Variant.secondary}
        onClick={() => remove(index)}
      >
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
