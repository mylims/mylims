// eslint-disable-next-line no-restricted-imports
import { FieldValues, useFormContext } from 'react-hook-form';

export function useCheckedFormRHFContext<TFieldValues extends FieldValues>() {
  const context = useFormContext<TFieldValues>();
  if (!context) {
    throw new Error('Cannot use RHF fields outside of FormRHF context');
  }
  return context;
}
