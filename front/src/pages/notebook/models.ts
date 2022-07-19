import {
  MeasurementTypes,
  NotebookListQuery,
  NotebookQuery,
} from '@/generated/graphql';

export interface MeasurementNotebook {
  id: string;
  type: MeasurementTypes;
}
type BaseNotebook = Omit<
  NotebookQuery['notebook'],
  'samples' | 'measurements'
> & {
  samples: string[];
  measurements: MeasurementNotebook[];
};
export type UpdateNotebook = BaseNotebook;
export type CreateNotebook = Omit<BaseNotebook, 'user' | 'createdAt' | 'id'>;
export type NotebookListItem = NotebookListQuery['notebooks']['list'][number];
export type StateNotebook = UpdateNotebook | CreateNotebook;
export const defaultNotebook: CreateNotebook = {
  title: '',
  labels: [],
  content: undefined,
  samples: [],
  measurements: [],
};
