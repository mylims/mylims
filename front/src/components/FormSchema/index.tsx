import { JSONSchema7 } from 'json-schema';
import React, { useMemo } from 'react';

import {
  FormRHF,
  FormErrorRHF,
  SubmitButtonRHF,
} from '@/components/tailwind-ui';

import { parseSchema } from './parseSchema';
import type { FormSchemaProps } from './types';
import { useParseSchema } from './useParseSchema';

export function FormSchema({ schema, data, onSubmit }: FormSchemaProps) {
  const plainForm = useMemo(() => {
    if (!schema.properties || typeof schema.properties !== 'object') {
      return [];
    }
    return parseSchema({
      properties: schema.properties as Record<string, JSONSchema7>,
      required: schema.required || [],
    });
  }, [schema]);
  const { formFields, validationSchema } = useParseSchema(plainForm);

  return (
    <FormRHF defaultValues={data} onSubmit={onSubmit}>
      <div
        className="grid max-w-screen-xl gap-4"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
      >
        {formFields}
      </div>
      <FormErrorRHF />
      <SubmitButtonRHF>Submit</SubmitButtonRHF>
    </FormRHF>
  );
}
