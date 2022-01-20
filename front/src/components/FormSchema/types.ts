import type { JSONSchema7 } from 'json-schema';

type FormData = Record<string, any>;
export interface FormSchemaProps {
  schema: JSONSchema7;
  data: FormData;
  onSubmit: (values: FormData) => void;
}

export interface ParserProps {
  properties: Record<string, JSONSchema7>;
  required: string[];
}

type SelOptions = Record<'label' | 'value', string>;
export type ParsedForm = {
  label: string;
  name: string;
  required?: boolean;
} & (
  | { type: FormType.STRING }
  | { type: FormType.NUMBER }
  | { type: FormType.DATE }
  | { type: FormType.BOOLEAN }
  | { type: FormType.ATTACHMENT }
  | { type: FormType.SELECT; options: SelOptions[] }
  | { type: FormType.MULTISELECT; options: SelOptions[] }
);

export enum FormType {
  STRING = 'string',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  ATTACHMENT = 'attachment',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
}
