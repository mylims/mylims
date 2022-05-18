import {
  MeasurementTypes,
  NotebookListQuery,
  NotebookQuery,
} from '@/generated/graphql';

type BaseNotebook = Omit<
  NotebookQuery['notebook'],
  'samples' | 'measurements'
> & {
  samples: string[];
  measurements: { id: string; type: MeasurementTypes }[];
};
export type UpdateNotebook = BaseNotebook;
export type CreateNotebook = Omit<BaseNotebook, 'user' | 'createdAt' | 'id'>;
export type NotebookListItem = NotebookListQuery['notebooks']['list'][number];
export type StateNotebook = UpdateNotebook | CreateNotebook;
export const defaultNotebook: CreateNotebook = {
  title: '',
  labels: [],
  content: [],
  samples: [],
  measurements: [],
};
