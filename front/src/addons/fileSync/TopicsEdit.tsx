import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React from 'react';

import {
  Button,
  Color,
  InputField,
  Size,
  Variant,
} from '@/components/tailwind-ui';

interface TopicsEditProps {
  remove: ArrayHelpers['remove'];
  index: number;
}

export default function TopicsEdit({ remove, index }: TopicsEditProps) {
  return (
    <div className="m-1 grid grid-cols-3 rounded-lg p-2 shadow">
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
        <TrashIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
