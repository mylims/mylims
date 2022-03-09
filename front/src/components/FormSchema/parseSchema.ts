import { FormType, ParsedForm, ParserProps } from './types';

export function parseSchema({
  properties,
  required,
}: ParserProps): ParsedForm[] {
  return Object.entries(properties).map(([key, value]) => {
    const base = {
      name: key,
      label: value.title || key,
      required: required.includes(key),
    };
    switch (value.type) {
      case 'string': {
        if (value.format && ['date', 'date-time'].includes(value.format)) {
          return { type: FormType.DATE, ...base };
        }
        if (value.enum) {
          const options = value.enum
            .map((label) => (typeof label === 'string' ? label : null))
            .filter((val): val is string => !!val);
          const type =
            value.const === 'multiple' ? FormType.MULTISELECT : FormType.SELECT;
          return { type, options, ...base };
        }
        return { type: FormType.STRING, ...base };
      }
      case 'number':
      case 'integer': {
        return { type: FormType.NUMBER, ...base };
      }
      case 'boolean': {
        return { type: FormType.BOOLEAN, ...base };
      }
      case 'object': {
        if (value.const === 'attachment') {
          return { type: FormType.ATTACHMENT, ...base };
        } else {
          throw new Error('Unsupported schema type: non-attachment object');
        }
      }
      default: {
        throw new Error(`Unsupported schema type: ${value.type as string}`);
      }
    }
  });
}
