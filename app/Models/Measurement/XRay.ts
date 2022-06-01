import { field } from '@ioc:Zakodium/Mongodb/Odm';

import { BaseMeasurement } from 'App/Models/Measurement/Base';

interface XRayPeak {
  x: number;
  y: number;
  shape?: { kind: 'pseudoVoigt'; fwhm?: number; mu?: number };
  parameters?: Record<
    string,
    { init?: number; min?: number; max?: number; gradientDifference?: number }
  >;
}
export interface XRayType {
  peaks: XRayPeak[];
}

export class XRayMeasurement extends BaseMeasurement {
  public static collectionName = 'measurement.xray';

  @field()
  public derived: XRayType;
}
