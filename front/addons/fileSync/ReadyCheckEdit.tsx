import { TrashIcon } from '@heroicons/react/solid';
import { ArrayHelpers } from 'formik';
import React, { useMemo } from 'react';

import {
  Button,
  Card,
  Color,
  InputField,
  RadioField,
  SelectField,
  Size,
} from '../../components/tailwind-ui';

interface ReadyCheckEditProps {
  remove: ArrayHelpers['remove'];
  index: number;
  checkNames: string[];
}

export default function ReadyCheckEdit({
  remove,
  index,
  checkNames,
}: ReadyCheckEditProps) {
  const checkNamesOptions = useMemo(() => {
    return checkNames.map((checkName) => ({
      label: checkName,
      value: checkName,
    }));
  }, [checkNames]);

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
        <div className="p-2 space-y-2">
          <SelectField
            name={`readyChecks.${index}.name`}
            options={checkNamesOptions}
            resolveTo="value"
          />
          <div>
            <RadioField
              value="dynamic"
              name={`readyChecks.${index}.type`}
              label="Dynamic"
            />
            <RadioField
              value="static"
              name={`readyChecks.${index}.type`}
              label="Static"
            />
          </div>
          <InputField
            name={`readyChecks.${index}.keyValue`}
            label="Key / Value"
          />
        </div>
      </Card>
    </div>
  );
}
