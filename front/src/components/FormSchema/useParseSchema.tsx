import React, { ReactNode } from 'react';
import { BaseSchema, boolean, array } from 'yup';

import {
  InputFieldRHF,
  ToggleFieldRHF,
  DatePickerFieldRHF,
  DropzoneFieldRHF,
  SelectFieldRHF,
  requiredObject,
  optionalString,
  requiredString,
  optionalNumber,
  requiredNumber,
  optionalDate,
  requiredDate,
  optionalObject,
} from '@/components/tailwind-ui';

import MultiSelect from './MultiSelect';
import { FormType, ParsedForm } from './types';

const selectValidator = { value: requiredString(), label: requiredString() };

export function useParseSchema(plainForm: ParsedForm[]) {
  let formFields: ReactNode[] = [];
  let validationSchema: Record<string, BaseSchema> = {};
  for (const field of plainForm) {
    switch (field.type) {
      case FormType.STRING: {
        formFields.push(
          <InputFieldRHF
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
          />,
        );
        validationSchema[field.name] = field.required
          ? requiredString()
          : optionalString();
        break;
      }
      case FormType.NUMBER: {
        formFields.push(
          <InputFieldRHF
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            type="number"
          />,
        );
        validationSchema[field.name] = field.required
          ? requiredNumber()
          : optionalNumber();
        break;
      }
      case FormType.BOOLEAN: {
        formFields.push(
          <ToggleFieldRHF
            key={field.name}
            name={field.name}
            label={field.label}
          />,
        );
        validationSchema[field.name] = boolean();
        break;
      }
      case FormType.DATE: {
        formFields.push(
          <DatePickerFieldRHF
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
          />,
        );
        validationSchema[field.name] = field.required
          ? requiredDate()
          : optionalDate();
        break;
      }
      case FormType.ATTACHMENT: {
        formFields.push(
          <DropzoneFieldRHF
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            showList
          />,
        );
        validationSchema[field.name] = field.required
          ? array().required().min(1, 'Please provide at least 1 file')
          : array();
        break;
      }
      case FormType.SELECT: {
        formFields.push(
          <SelectFieldRHF
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            options={field.options}
          />,
        );
        validationSchema[field.name] = field.required
          ? requiredObject(selectValidator)
          : optionalObject(selectValidator);
        break;
      }
      case FormType.MULTISELECT: {
        formFields.push(
          <MultiSelect
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            options={field.options}
          />,
        );
        validationSchema[field.name] = field.required
          ? array()
              .of(requiredObject(selectValidator))
              .required()
              .min(1, 'Select at least one element')
          : array().of(requiredObject(selectValidator));
        break;
      }
      default: {
        throw new Error('Unknown form type');
      }
    }
  }
  return { formFields, validationSchema: requiredObject(validationSchema) };
}
