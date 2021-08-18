import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React from 'react';

import {
  Button,
  Color,
  InputField,
  Size,
  Variant,
} from '@components/tailwind-ui';

interface PatternEditProps {
  remove: ArrayHelpers['remove'];
  index: number;
}

export default function PatternEdit({ remove, index }: PatternEditProps) {
  return (
    <div className="grid grid-cols-3 p-2 m-1 rounded-lg shadow">
      <div className="col-span-2">
        <InputField name={`topics.${index}`} label="Topic" hiddenLabel />
      </div>
      <Button
        className="self-center justify-self-center"
        size={Size.xSmall}
        color={Color.danger}
        variant={Variant.secondary}
        onClick={() => remove(index)}
      >
        <TrashIcon className="w-5 h-5" />
      </Button>
    </div>
  );
}
