import { ReactNode } from 'react';
import { BaseSchema } from 'yup';

import { SampleQuery } from '@/generated/graphql';
import { SampleLevelsTypes } from '@/models/sample';

import { Device } from './Device';
import { Dye } from './Dye';
import { Sample } from './Sample';
import { Wafer } from './Wafer';

export interface SampleParams {
  id?: string;
  kind?: SampleLevelsTypes;
  [key: string]: string | undefined;
}

interface FieldDescription {
  title: string;
  description: string | null | undefined;
  hide?: boolean;
  type?: 'string' | 'boolean';
}
export interface BaseSample {
  description(sample: SampleQuery['sample']): FieldDescription[];
  actions?: (sample: SampleQuery['sample']) => ReactNode;
  codeLength: number;
  updateSchema: Record<string, BaseSchema>;
  updateForm: ReactNode;
}

export const SamplesMap: Record<SampleLevelsTypes, BaseSample> = {
  wafer: new Wafer(),
  sample: new Sample(),
  dye: new Dye(),
  device: new Device(),
};
