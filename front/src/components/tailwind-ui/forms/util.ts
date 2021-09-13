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
