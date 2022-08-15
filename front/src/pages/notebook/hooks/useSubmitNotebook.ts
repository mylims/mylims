import type { FetchResult } from '@apollo/client';
import { useState } from 'react';

import { NotebookInput } from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';

import { notebookStateToInput } from '../adapters';
import { StateNotebook } from '../models';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;
interface UseSubmitNotebook<T> {
  onSuccess(data: T): void;
  submissionFunc(input: NotebookInput): Promise<FetchResult<T, Json, Json>>;
}
export function useSubmitNotebook<T>({
  submissionFunc,
  onSuccess,
}: UseSubmitNotebook<T>) {
  const { id: userId } = useAuth();
  const [error, setError] = useState<Error | null>(null);

  async function onSubmit(data: StateNotebook) {
    if (userId) {
      try {
        const input = notebookStateToInput(data, userId);
        const { errors, data: res } = await submissionFunc(input);
        if (errors) {
          setError(new Error(errors[0].message));
        } else if (!res) {
          setError(new Error('Error during notebook submission'));
        } else {
          onSuccess(res);
        }
      } catch (error) {
        setError(error as Error);
      }
    } else {
      setError(new Error('Not authenticated'));
    }
  }

  return { onSubmit, error };
}
