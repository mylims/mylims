import { Analysis } from 'base-analysis';
import { UseFormSetValue } from 'react-hook-form';

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
  plotQuery: PlotQuery;
  metaColumns: React.ReactNode[];
  setMetadata(
    meta: Record<string, string>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setValue: UseFormSetValue<Record<string, any>>,
  ): void;
  PlotDetail(props: PlotDetailProps): JSX.Element;
  toAnalysis(data: string): Analysis[];
}

export const MeasurementMap: Record<MeasurementTypes, BaseMeasurement> = {
  [MeasurementTypes.TRANSFER]: TransferModel,
  [MeasurementTypes.XRAY]: XRayModel,
};
