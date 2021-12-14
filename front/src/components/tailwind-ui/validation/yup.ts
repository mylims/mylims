import { object, date, string, number } from 'yup';
import type { ObjectShape } from 'yup/lib/object';

const requiredMessage = 'This field is required.';

export function requiredString(message?: string) {
  return string()
    .required(message || requiredMessage)
    .nullable();
}

export function requiredNumber(message?: string) {
  return number()
    .required(message || requiredMessage)
    .nullable();
}

export function requiredObject<T extends ObjectShape>(
  spec?: T,
  message?: string,
) {
  return object(spec)
    .required(message || requiredMessage)
    .nullable();
}

export function requiredDate(message?: string) {
  return date()
    .required(message || requiredMessage)
    .nullable();
}

export function optionalString() {
  return string().nullable();
}

export function optionalNumber() {
  return number().nullable();
}

export function optionalObject<T extends ObjectShape>(spec: T) {
  return object(spec).nullable();
}

export function optionalDate() {
  return date().nullable();
}
