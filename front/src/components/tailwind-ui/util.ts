import React from 'react';

/*
 * Use this function to create a Component with ref button
 * https://github.com/tailwindlabs/headlessui/blob/24725216e4e2fb9280bdf3b96583a9fe573410e4/packages/%40headlessui-react/src/utils/render.ts#L175-L181
 */
export function forwardRefWithAs<T>(component: T): T {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return React.forwardRef(component as unknown as any) as any;
}

const _userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
export const commandKeyExists =
  _userAgent.includes('Macintosh') ||
  _userAgent.includes('iPad') ||
  _userAgent.includes('iPhone');
