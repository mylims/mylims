import React, { forwardRef, PropsWithoutRef } from 'react';

// https://fettblog.eu/typescript-react-generic-forward-refs/
export function forwardRefWithGeneric<T, P = unknown>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
): (
  props: PropsWithoutRef<P> & React.RefAttributes<T>,
) => React.ReactElement | null {
  return forwardRef(render);
}

const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
export const commandKeyExists =
  userAgent.includes('Macintosh') ||
  userAgent.includes('iPad') ||
  userAgent.includes('iPhone');

export function assertUnreachable(x: never): never {
  throw new Error(`unreachable: ${String(x)}`);
}

export function delve(
  object: object,
  key: string | Array<string | number>,
  defaultValue?: unknown,
): unknown {
  key = typeof key === 'string' ? key.split('.') : key;
  for (const k of key) {
    // @ts-expect-error
    object = object ? object[k] : undefined;
  }
  return object === undefined ? defaultValue : object;
}
