/* eslint-disable @typescript-eslint/no-explicit-any */

export function omitDeep(obj: any, props: string[] | string) {
  if (typeof props === 'string') {
    props = [props];
  }
  const newObj: any = {};
  Object.keys(obj)
    .filter((objKey) => !props.includes(objKey))
    .forEach((objKey) => {
      if (Array.isArray(obj[objKey])) {
        newObj[objKey] = obj[objKey].map((subObj: any) =>
          omitDeep(subObj, props),
        );
      } else if (typeof obj[objKey] === 'object' && obj[objKey] !== null) {
        newObj[objKey] = omitDeep(obj[objKey], props);
      } else {
        newObj[objKey] = obj[objKey];
      }
    });
  return newObj;
}
