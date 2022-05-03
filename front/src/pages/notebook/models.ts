import { NotebookListQuery, NotebookQuery } from '@/generated/graphql';

export type UpdateNotebook = NotebookQuery['notebook'];
export type CreateNotebook = Omit<
  NotebookQuery['notebook'],
  'user' | 'createdAt' | 'id'
>;
export type NotebookListItem = NotebookListQuery['notebooks']['list'][number];
export type StateNotebook = UpdateNotebook | CreateNotebook;
export const defaultNotebook: CreateNotebook = {
  title: '',
  labels: [],
  content: [],
  samples: [],
  measurements: [],
};
