import { useState, useEffect, useRef } from 'react';

import { InputProps } from '../forms/basic/Input';

import { useDebounce } from './useDebounce';

export interface InputAsyncValidationCallbackResult {
  valid: boolean;
  message?: string; // Validation or error message
}

export type InputAsyncValidationCallback = (
  searchValue: string,
) => Promise<InputAsyncValidationCallbackResult>;

type InputAsyncValidationHookResult = Pick<
  InputProps,
  'valid' | 'error' | 'loading'
>;

export function useInputAsyncValidation(
  value: string,
  debounceDelay: number,
  callback: InputAsyncValidationCallback,
): InputAsyncValidationHookResult {
  const [result, setResult] = useState<
    Pick<InputAsyncValidationHookResult, 'valid' | 'error'>
  >({
    valid: undefined,
    error: undefined,
  });
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(value, debounceDelay);
  const callbackRef = useRef<InputAsyncValidationCallback>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    let shouldComplete = true;
    if (!debouncedValue) {
      setLoading(false);
      setResult({
        error: undefined,
        valid: undefined,
      });
      return;
    }
    setLoading(true);
    callbackRef
      .current(debouncedValue)
      .then((result) => {
        if (shouldComplete) {
          setLoading(false);
          setResult({
            error: result.valid ? undefined : result.message,
            valid: result.valid ? result.message : undefined,
          });
        }
      })
      .catch((e) => {
        if (shouldComplete) {
          // eslint-disable-next-line no-console
          console.error(e);
          setLoading(false);
          setResult({
            error: undefined,
            valid: undefined,
          });
        }
      });

    return () => {
      shouldComplete = false;
    };
  }, [debouncedValue]);

  return {
    loading,
    ...result,
  };
}
