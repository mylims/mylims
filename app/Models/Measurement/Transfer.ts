import { field } from '@ioc:Zakodium/Mongodb/Odm';

import { BaseMeasurement } from 'App/Models/Measurement/Base';

export interface TransferType {
  thresholdVoltage: {
    index: number;
    value: number;
  };
  subthresholdSlope: {
    medianSlope: number;
    toIndex: number;
    fromIndex: number;
  };
}

export class TransferMeasurement extends BaseMeasurement {
  public static collectionName = 'measurement.transfer';

  @field()
  public derived: TransferType;
}
