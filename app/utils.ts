import escapeStringRegexp from 'escape-string-regexp';

import {
  GqlFilterDate,
  GqlFilterList,
  GqlFilterNumber,
  GqlFilterText,
  GqlFilterTextOperator,
  Maybe,
} from 'App/graphql';

export type ExcludeNull<T> = {
  [P in keyof T]: Exclude<T[P], null | undefined>;
};
export type NotReadOnly<T> = {
  -readonly [P in keyof T]: T[P];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function removeNullable<T extends Record<string, any>>(
  obj: T,
): ExcludeNull<T> {
  // @ts-expect-error Initiating the non-nullable type
  let result: ExcludeNull<T> = {};
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
}

export function filterDate(date: Maybe<GqlFilterDate> | undefined) {
  if (!date) return undefined;
  return {
    $gte: date?.from ?? new Date(0),
    $lte: date?.to ?? new Date(Date.now()),
  };
}

export function filterNumber(number: Maybe<GqlFilterNumber> | undefined) {
  if (!number) return undefined;
  return {
    $gte: number?.min ?? 0,
    $lte: number?.max ?? Infinity,
  };
}

export function filterText(text: Maybe<GqlFilterText> | undefined) {
  if (!text) return undefined;
  const { operator, value } = text;
  switch (operator) {
    case GqlFilterTextOperator.CONTAINS:
      return { $regex: escapeStringRegexp(value), $options: 'i' };
    case GqlFilterTextOperator.STARTSWITH:
      return { $regex: `^${escapeStringRegexp(value)}`, $options: 'i' };
    case GqlFilterTextOperator.EQUALS:
      return value;
    default:
      return undefined;
  }
}

export function filterTextArray(
  path: string,
  list: Maybe<GqlFilterList[]> | undefined,
) {
  if (!list) return {};
  let filter: Record<string, string | Record<'$regex' | '$options', string>> =
    {};
  for (const { index, value } of list) {
    const key =
      index !== undefined && index !== null ? `${path}.${index}` : path;
    const filterValue = filterText(value);

    if (filterValue) filter[key] = filterValue;
  }
  return filter;
}
