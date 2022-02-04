import clsx from 'clsx';
import {
  Formik,
  Form as FormikForm,
  FormikFormProps,
  FormikConfig,
  FormikHelpers,
} from 'formik';
import React, { CSSProperties } from 'react';

type InnerFormProps = Omit<FormikFormProps, 'children' | 'className' | 'style'>;

export interface FormProps<T> extends FormikConfig<T> {
  className?: string;
  style?: CSSProperties;
  noDefaultStyle?: boolean;
  formProps?: InnerFormProps;
}

export function Form<T>(props: FormProps<T>): JSX.Element {
  const {
    children,
    className,
    style,
    onSubmit,
    noDefaultStyle = false,
    formProps: { noValidate = true, ...otherFormProps } = {},
    ...otherProps
  } = props;

  async function handleSubmit(values: T, helpers: FormikHelpers<T>) {
    try {
      helpers.setStatus(null);
      await onSubmit(values, helpers);
    } catch (error) {
      helpers.setStatus({ error });
    } finally {
      helpers.setSubmitting(false);
    }
  }

  return (
    <Formik onSubmit={handleSubmit} {...otherProps}>
      {(formik) => {
        return (
          <FormikForm
            className={clsx(
              { 'flex flex-1 flex-col gap-y-4': !noDefaultStyle },
              className,
            )}
            style={style}
            noValidate={noValidate}
            {...otherFormProps}
          >
            {typeof children === 'function' ? children(formik) : children}
          </FormikForm>
        );
      }}
    </Formik>
  );
}
