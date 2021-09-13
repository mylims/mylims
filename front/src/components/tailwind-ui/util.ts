import React, { forwardRef } from 'react';

// https://fettblog.eu/typescript-react-generic-forward-refs/
export function forwardRefWithGeneric<T, P = unknown>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null,
): (props: P & React.RefAttributes<T>) => React.ReactElement | null {
  return forwardRef(render);
}

const _userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
export const commandKeyExists =
  _userAgent.includes('Macintosh') ||
  _userAgent.includes('iPad') ||
  _userAgent.includes('iPhone');
