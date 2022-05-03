import { NotebookInput } from '@/generated/graphql';

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
    samples: data.samples.map(({ id }) => id),
    measurements: data.measurements.map(({ id, type }) => ({ id, type })),
  };
}
