import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React, { useMemo } from 'react';

import {
  Button,
  Color,
  InputField,
  SelectField,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import { ReadyCheckDescriptor, ReadyCheckInput } from '@/generated/graphql';

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
    <div className="m-1 grid grid-cols-3 space-x-4 rounded-lg p-2 shadow">
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
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
