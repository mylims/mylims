import escapeStringRegexp from 'escape-string-regexp';

import { Sample } from 'App/Models/Sample';

export default async function sampleCodeFlat(
  sampleCode: string,
  kind?: string | null | undefined,
) {
  let aggregation: Record<string, unknown>[] = [
    {
      $addFields: {
        code: {
          $reduce: {
            input: '$sampleCode',
            initialValue: '',
            in: {
              $concat: [
                '$$value',
                // Avoid trailing underscore
                { $cond: [{ $eq: ['$$value', ''] }, '', '_'] },
                '$$this',
              ],
            },
          },
        },
      },
    },
    {
      $match: {
        code: { $regex: escapeStringRegexp(sampleCode), $options: 'i' },
      },
    },
  ];

  if (kind) aggregation.unshift({ $match: { kind } });

  return (await Sample.getCollection()).aggregate<Sample>(aggregation);
}
