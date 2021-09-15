import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React, { useMemo } from 'react';

import { ReadyCheckDescriptor, ReadyCheckInput } from '@/generated/graphql';

import {
  Button,
  Color,
  InputField,
  SelectField,
  Size,
  Variant,
} from '@/components/tailwind-ui';

function simpleGetValueRenderOption(option: string) {
  return option;
}

interface ReadyCheckEditProps {
  remove: ArrayHelpers['remove'];
  index: number;
  checks: ReadyCheckDescriptor[];
  readyCheck: ReadyCheckInput;
}

export default function ReadyCheckEdit({
  remove,
  index,
  checks,
  readyCheck,
}: ReadyCheckEditProps) {
  const checkNamesOptions = useMemo(() => {
    return checks.map(({ name }) => name);
  }, [checks]);

  return (
    <div className="grid grid-cols-3 p-2 m-1 space-x-4 rounded-lg shadow">
      <div className="col-span-2">
        <SelectField
          name={`readyChecks.${index}.name`}
          options={checkNamesOptions}
          getValue={simpleGetValueRenderOption}
          renderOption={simpleGetValueRenderOption}
        />
        {checks.some(
          (check) => check.name === readyCheck.name && check.hasArg,
        ) && (
          <InputField name={`readyChecks.${index}.value`} label="Parameter" />
        )}
      </div>
      <div className="self-center justify-self-center">
        <Button
          size={Size.xSmall}
          color={Color.danger}
          variant={Variant.secondary}
          onClick={() => remove(index)}
        >
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
