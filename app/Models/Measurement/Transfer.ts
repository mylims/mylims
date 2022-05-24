import { field } from '@ioc:Zakodium/Mongodb/Odm';

import { BaseMeasurement } from 'App/Models/Measurement/Base';

export interface TransferType {
  thresholdVoltage: {
    index: number;
    value: number;
    units: string;
  };
  subthresholdSlope: {
    slope: { value: number; units: string };
    score: Record<string, number>;
    toIndex: number;
    fromIndex: number;
  };
}

export class TransferMeasurement extends BaseMeasurement {
  public static collectionName = 'measurement.transfers';

  @field()
  public derived: TransferType;
}
