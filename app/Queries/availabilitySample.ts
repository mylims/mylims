import type { Filter } from 'mongodb';

import type { ModelAttributes } from '@ioc:Zakodium/Mongodb/Odm';

import { Sample } from 'App/Models/Sample';

export interface Availability {
  sort: number;
  taken: number;
  total: number;
  defaultTotal: number;
}
export default async function availabilitySample(
  filter: Filter<ModelAttributes<Sample>>,
) {
  const aggregation = [
    {
      $match: { ...filter, kind: 'wafer' },
    },
    {
      $lookup: {
        from: 'samples',
        let: { waferId: '$_id' },
        pipeline: [
          {
            $match: {
              kind: 'sample',
              $expr: { $eq: [{ $first: '$parents' }, '$$waferId'] },
            },
          },
          {
            $group: {
              _id: { $first: '$parents' },
              total: { $sum: 1 },
              taken: { $sum: { $cond: ['$meta.reserved', 1, 0] } },
            },
          },
        ],
        as: 'rawAvailability',
      },
    },
    {
      $set: {
        rawAvailability: { $first: '$rawAvailability' },
        defaultTotal: {
          $switch: {
            branches: [
              { case: { $eq: ['$meta.size', '2'] }, then: 4 },
              { case: { $eq: ['$meta.size', '4'] }, then: 16 },
              { case: { $eq: ['$meta.size', '6'] }, then: 38 },
              { case: { $eq: ['$meta.size', '6 inch'] }, then: 38 },
            ],
            default: 1,
          },
        },
      },
    },
    {
      $set: {
        'meta.availability': {
          taken: { $ifNull: ['$rawAvailability.taken', 0] },
          total: { $max: ['$rawAvailability.total', '$defaultTotal'] },
          defaultTotal: '$defaultTotal',
          sort: {
            $divide: [
              { $ifNull: ['$rawAvailability.taken', 0] },
              { $max: ['$rawAvailability.total', '$defaultTotal'] },
            ],
          },
        },
      },
    },
  ];
  return (await Sample.getCollection()).aggregate<Sample>(aggregation);
}
