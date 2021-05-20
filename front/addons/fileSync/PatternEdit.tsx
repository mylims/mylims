import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React from 'react';

import {
  Button,
  Card,
  Color,
  InputField,
  RadioField,
  Size,
} from '../../components/tailwind-ui';

interface PatternEditProps {
  remove: ArrayHelpers['remove'];
  index: number;
}

export default function PatternEdit({ remove, index }: PatternEditProps) {
  return (
    <div className="m-2 min-w-1/3">
      <Card>
        <Card.Header>
          <Button
            size={Size.xSmall}
            color={Color.danger}
            onClick={() => remove(index)}
          >
            <TrashIcon className="h-5 w-5" />
          </Button>
        </Card.Header>
        <div className="p-2">
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
      </Card>
    </div>
  );
}