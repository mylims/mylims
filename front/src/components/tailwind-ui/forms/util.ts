import { ControllerProps, RegisterOptions } from 'react-hook-form';

import type { InputProps } from '..';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorSerializer = (error: any) => string | undefined;

export interface FieldProps {
  /**
   * Compatible with RHF fields only, not Formik fields.
   * Transforms the field error into a message displayed to the user
   */
  serializeError?: ErrorSerializer;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defaultErrorSerializer(error: any): string {
  return error?.message;
}

export interface RHFValidationProps {
  /**
   * List of fields whose validation are dependent of the current field.
   */
  deps?: string[];
}

/*
 * Props for components which use react-hook-form's useController
 */
export interface RHFControllerProps {
  rhfOptions?: Pick<ControllerProps, 'shouldUnregister'>;
}

export interface RHFRegisterProps {
  /**
   * forward options to react-hook-form's register function
   */
  rhfOptions?: Pick<RegisterOptions, 'setValueAs' | 'shouldUnregister'>;
}

export type EmptyValue = string | number | null | undefined;

export function getEmptyValueProp(
  ...args: {
    emptyValue?: EmptyValue;
  }[]
) {
  for (let arg of args) {
    if (Object.prototype.hasOwnProperty.call(arg, 'emptyValue')) {
      // return early, first one wins
      return arg.emptyValue;
    }
  }

  return null;
}

export function getSetValueAs(
  emptyValue: EmptyValue,
  type: InputProps['type'],
) {
  if (type === 'number') {
    return getSetValueAsNumber(emptyValue);
  } else {
    return getSetValueAsString(emptyValue);
  }
}

function getSetValueAsNumber(emptyValue: EmptyValue) {
  return function setValueAsNumber(value: string | number) {
    // setValueAs also receives the default value, which should normally be a number
    if (typeof value === 'number') {
      return value;
    }

    if (!value) return emptyValue;
    return Number(value);
  };
}

function getSetValueAsString(emptyValue: EmptyValue) {
  return function setValueAsString(value: string) {
    if (!value) return emptyValue;
    return value;
  };
}
