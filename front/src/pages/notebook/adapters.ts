import { NotebookInput, NotebookQuery } from '@/generated/graphql';

import { StateNotebook } from './models';

export function notebookStateToInput(
  data: StateNotebook,
  userId: string,
): NotebookInput {
  return {
    title: data.title,
    description: data.description,
    labels: data.labels,
    project: data.project,
    content: data.content,
    userId,
    samples: data.samples,
    measurements: data.measurements,
  };
}

export function notebookInputToState(
  data: NotebookQuery['notebook'] | undefined,
): StateNotebook | undefined {
  if (!data) return undefined;
  return {
    ...data,
    samples: data.samples.map((sample) => sample.id),
    measurements: data.measurements.map(({ id, type }) => ({ id, type })),
  };
}
