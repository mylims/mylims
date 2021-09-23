import { RegisterOptions } from 'react-hook-form';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorSerializer = (error: any) => string | undefined;

export interface FieldProps {
  /**
   * Compatible with RHF fields only, not Formik fields.
   * Transforms the field error into a message displayed to the user
   */
  serializeError?: ErrorSerializer;
  /**
   * Compatible with RHF fields only, not Formik fields.
   * List of fields whose validation are dependent of the current field.
   */
  deps?: string[];
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function defaultErrorSerializer(error: any): string {
  return error?.message;
}

export interface RHFRegisterProps {
  /**
   * forward options to react-hook-form's register function
   */
  rhfOptions?: Pick<RegisterOptions, 'deps' | 'setValueAs'>;
}

export interface RHFControlledProps {
  /**
   * List of fields whose validation are dependent of the current field.
   */
  deps?: string[];
}
