import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  FieldValues,
  FormProvider,
  Resolver,
  ResolverResult,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  UseFormProps,
} from 'react-hook-form';
import type { AnyObjectSchema } from 'yup';

import { EmptyValue, getEmptyValueProp } from '../util';

interface FormStatus {
  error?: Error;
}

interface RHFConfig {
  emptyValue: EmptyValue;
}

const configContext = createContext<RHFConfig | null>(null);
export function useRHFConfig() {
  const value = useContext(configContext);
  if (value === null) {
    throw new Error(
      'missing RHF config value, make sure to call useRHFConfig in a descendant of FormRHF',
    );
  }
  return value;
}

const formStatusContext = createContext<
  | readonly [
      FormStatus | null,
      React.Dispatch<React.SetStateAction<FormStatus | null>>,
    ]
  | null
>(null);

function multiYupResolver<TValues extends FieldValues>(
  schemas: AnyObjectSchema | AnyObjectSchema[],
) {
  const superResolver: Resolver<TValues> = async (
    formValues,
    context,
    options,
  ) => {
    if (!Array.isArray(schemas)) {
      schemas = [schemas];
    }

    const allErrors = {};
    const allValues = {};
    for (let schema of schemas.slice().reverse()) {
      const resolver = yupResolver(schema);
      const { values, errors } = await resolver(formValues, context, options);
      Object.assign(allErrors, errors);
      Object.assign(allValues, values);
    }
    return {
      errors: allErrors,
      values: allValues,
    } as ResolverResult<TValues>;
  };
  return superResolver;
}

export type FormRHFProps<TValues extends FieldValues> = Omit<
  UseFormProps<TValues>,
  'resolver' | 'reValidateMode' | 'shouldUnregister'
> & {
  onSubmit: SubmitHandler<TValues>;
  onInvalidSubmit?: SubmitErrorHandler<TValues>;
  children: ReactNode;
  validationSchema?: AnyObjectSchema | AnyObjectSchema[];
  noDefaultStyle?: boolean;
  className?: string;
  defaultValues: TValues;
  emptyValue?: EmptyValue;
};

export function FormRHF<TValues extends FieldValues>(
  props: FormRHFProps<TValues>,
) {
  const {
    onSubmit,
    onInvalidSubmit,
    noDefaultStyle = false,
    className,
    validationSchema,
    children,
    emptyValue,
    ...formHookProps
  } = props;
  const methods = useForm<TValues>({
    ...formHookProps,
    shouldUseNativeValidation: false,
    resolver: validationSchema ? multiYupResolver(validationSchema) : undefined,
  });

  const finalEmptyValue = getEmptyValueProp(props);
  const configValue = useMemo(() => {
    return {
      emptyValue: finalEmptyValue,
    };
  }, [finalEmptyValue]);
  const [status, setStatus] = useState<FormStatus | null>(null);
  const contextValue = useMemo(() => {
    return [status, setStatus] as const;
  }, [status, setStatus]);

  return (
    <configContext.Provider value={configValue}>
      <formStatusContext.Provider value={contextValue}>
        <FormProvider {...methods}>
          <form
            className={clsx(
              { 'flex flex-1 flex-col gap-y-4': !noDefaultStyle },
              className,
            )}
            onSubmit={(event) => {
              const submit = methods.handleSubmit(onSubmit, onInvalidSubmit);
              submit(event).catch((err) => {
                if (!(err instanceof Error)) {
                  // eslint-disable-next-line no-console
                  console.error(
                    err,
                    'FormRHF submit resulted in a non-error exception',
                  );
                }
                setStatus({
                  error: err as Error,
                });
                // Make sure RHF counts this submit as unsuccessful
                throw err;
              });
            }}
            noValidate
          >
            {children}
          </form>
        </FormProvider>
      </formStatusContext.Provider>
    </configContext.Provider>
  );
}

export function useFormStatus() {
  const context = useContext(formStatusContext);
  if (context === null) {
    throw new Error('useFormStatus cannot be used outside a Provider');
  }
  return context;
}
