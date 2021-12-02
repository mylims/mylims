export type ExcludeNull<T> = {
  [P in keyof T]: Exclude<T[P], null | undefined>;
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
