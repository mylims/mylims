import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React, { useMemo } from 'react';

import {
  Button,
  Card,
  Color,
  InputField,
  SelectField,
  Size,
} from '@components/tailwind-ui';


import { ReadyCheckDescriptor, ReadyCheckInput } from './generated/graphql';

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
    <div className="p-2">
      <Card>
        <Card.Header>
          <Button
            size={Size.xSmall}
            color={Color.danger}
            onClick={() => remove(index)}
          >
            <TrashIcon className="w-5 h-5" />
          </Button>
        </Card.Header>
        <div className="p-2 space-y-2">
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
      </Card>
    </div>
  );
}
