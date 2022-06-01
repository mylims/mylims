import { PlotQuery } from '@/components/PlotJcamp/types';
import { MeasurementQuery, MeasurementTypes } from '@/generated/graphql';

import { TransferModel } from './Transfer';
import { XRayModel } from './XRay';

export interface PlotDetailProps {
  measurement: MeasurementQuery['measurement'];
  data: string | null;
}
export interface BaseMeasurement {
  type: MeasurementTypes;
  Form(): JSX.Element;
  plotQuery: PlotQuery;
  PlotDetail(props: PlotDetailProps): JSX.Element;
}

export const MeasurementMap: Record<MeasurementTypes, BaseMeasurement> = {
  [MeasurementTypes.TRANSFER]: new TransferModel(),
  [MeasurementTypes.XRAY]: new XRayModel(),
};
