import clsx from 'clsx';
import React, { ComponentType, ReactNode } from 'react';
import type { FieldValues } from 'react-hook-form';

import { FormRHF, FormRHFProps } from '../forms/react-hook-form/FormRHF';

import { SlideOver, SlideOverProps } from './SlideOver';

export type FormRHFSlideOverProps<TValues extends FieldValues> = Omit<
  SlideOverProps<ComponentType<FormRHFProps<TValues>>>,
  'wrapperProps' | 'wrapperComponent'
> &
  Omit<FormRHFProps<TValues>, 'className' | 'children'>;

export function FormRHFSlideOver<TValues extends FieldValues>(
  props: FormRHFSlideOverProps<TValues>,
) {
  const { children, requestCloseOnClickOutside = false, ...otherProps } = props;
  return (
    <SlideOver<ComponentType<FormRHFProps<TValues>>>
      {...otherProps}
      requestCloseOnClickOutside={requestCloseOnClickOutside}
      // TODO: Remove when we want to force update to React 18.
      // @ts-ignore Weird error.
      wrapperComponent={FormRHF}
      wrapperProps={otherProps}
    >
      {children}
    </SlideOver>
  );
}

FormRHFSlideOver.Header = SlideOver.Header;

FormRHFSlideOver.Content = function FormRHFModalContent(props: {
  children: ReactNode;
  className?: string;
  noDefaultStyle?: boolean;
}) {
  const { noDefaultStyle = false, className, children } = props;
  return (
    <SlideOver.Content
      className={clsx({ 'space-y-4': !noDefaultStyle }, className)}
    >
      {children}
    </SlideOver.Content>
  );
};

FormRHFSlideOver.Footer = SlideOver.Footer;
