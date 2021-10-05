import { field } from '@ioc:Zakodium/Mongodb/Odm';

import { BaseMeasurement } from 'App/Models/Measurement/Base';

export class GeneralMeasurement extends BaseMeasurement {
  public static collectionName = 'measurement.general';

  @field()
  public derived?: Record<string, unknown>;
  public collection: string;
}
