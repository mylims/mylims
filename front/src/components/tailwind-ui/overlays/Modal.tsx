import { XIcon, AnnotationIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import polyfill from 'dialog-polyfill-universal';
import React, {
  createElement,
  CSSProperties,
  ElementType,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { useKbsDisableGlobal } from 'react-kbs';

import { IconButton } from '../elements/buttons/IconButton';
import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { Color, PropsOf } from '../types';

import { Portal } from './Portal';

const bgColors = {
  [Color.primary]: 'bg-primary-100',
  [Color.alternative]: 'bg-alternative-100',
  [Color.danger]: 'bg-danger-100',
  [Color.neutral]: 'bg-neutral-100',
  [Color.success]: 'bg-success-100',
  [Color.warning]: 'bg-warning-100',
};

const textColors = {
  [Color.primary]: 'text-primary-600',
  [Color.alternative]: 'text-alternative-600',
  [Color.danger]: 'text-danger-600',
  [Color.neutral]: 'text-neutral-600',
  [Color.success]: 'text-success-600',
  [Color.warning]: 'text-warning-600',
};

export interface ModalProps<T extends ElementType> {
  children: ReactNode;
  isOpen: boolean;
  onRequestClose?: () => void;
  icon?: ReactNode;
  iconColor?: Color;
  hasCloseButton?: boolean;
  requestCloseOnBackdrop?: boolean;
  requestCloseOnEsc?: boolean;
  wrapperComponent?: T;
  // This prop isn't used anymore but kept for backwards-compatibility in case
  // we re-add the functionality in the future.
  // eslint-disable-next-line react/no-unused-prop-types
  animated?: boolean;
  fluid?: boolean;
  wrapperProps?: Omit<PropsOf<T>, 'children'>;
  dialogStyle?: CSSProperties;
}

const isFirefox =
  typeof navigator !== 'undefined'
    ? navigator.userAgent.toLowerCase().includes('firefox')
    : null;

export function Modal<T extends ElementType>(props: ModalProps<T>) {
  const {
    isOpen,
    onRequestClose,
    icon = <AnnotationIcon />,
    iconColor = Color.primary,
    hasCloseButton = true,
    requestCloseOnBackdrop = true,
    requestCloseOnEsc = true,
    fluid = true,
    dialogStyle,
    wrapperComponent,
    wrapperProps,
    children,
  } = props;

  useLockBodyScroll(isOpen);
  useKbsDisableGlobal(isOpen);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    function onEsc(event: Event) {
      event.preventDefault();
      if (requestCloseOnEsc && onRequestClose) {
        onRequestClose();
      }
    }
    const dialog = dialogRef.current;
    if (dialog) {
      dialog.addEventListener('cancel', onEsc);
      return () => dialog.removeEventListener('cancel', onEsc);
    }
  }, [onRequestClose, requestCloseOnEsc]);

  useEffect(() => {
    if (dialogRef.current) {
      polyfill.registerDialog(dialogRef.current);
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && isOpen) {
      // @ts-ignore
      dialog.showModal();
      // @ts-ignore
      return () => dialog.close();
    }
  }, [isOpen]);

  let modalContents = (
    <div className="flex max-h-full flex-1 flex-col">
      <div className="flex max-h-full w-full flex-col sm:flex-row sm:items-start">
        <div
          className={clsx(
            'mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10',
            bgColors[iconColor],
          )}
        >
          <span className={clsx(textColors[iconColor], 'h-6 w-6')}>{icon}</span>
        </div>
        <div className="flex min-h-0 min-w-0 grow flex-col gap-2 text-center sm:mt-0 sm:ml-4 sm:max-h-full sm:gap-3 sm:text-left">
          {children}
        </div>
      </div>
      {onRequestClose && hasCloseButton ? (
        <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
          <IconButton
            className="rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
            onClick={onRequestClose}
            aria-label="Close"
            color="none"
            icon={<XIcon />}
            size="6"
          />
        </div>
      ) : null}
    </div>
  );

  if (wrapperComponent) {
    modalContents = createElement(
      wrapperComponent,
      wrapperProps,
      modalContents,
    );
  }

  return (
    <Portal>
      <dialog
        onClick={(event) => {
          // Since the dialog has no size of itself, this condition is only
          // `true` when we click on the backdrop.
          if (event.target === event.currentTarget && requestCloseOnBackdrop) {
            onRequestClose?.();
          }
        }}
        ref={dialogRef}
        style={Object.assign(
          { maxWidth: fluid ? 'calc(100% - 2rem)' : undefined },
          dialogStyle,
          isFirefox
            ? {
                maxHeight: 'calc((100% - 6px) - 2em)',
              }
            : {},
        )}
        className={clsx(
          'fixed flex rounded-lg bg-white text-left align-bottom shadow-xl',
          {
            'sm:w-full sm:max-w-lg': !fluid,
            hidden: !isOpen,
          },
        )}
      >
        <div className="flex flex-1 px-2 pt-5 pb-4 sm:py-6 sm:pl-6 sm:pr-4">
          {isOpen ? modalContents : null}
        </div>
      </dialog>
    </Portal>
  );
}

Modal.Header = function ModalHeader(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h3
      className={clsx(
        'pl-2 text-lg font-semibold text-neutral-900 sm:mr-8',
        props.className,
      )}
    >
      {props.children}
    </h3>
  );
};

Modal.Body = function ModalBody(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex min-h-0 max-w-full flex-col overflow-auto px-2 pt-1 pb-2',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

Modal.Description = function ModalDescription(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-sm text-neutral-500', props.className)}>
      {props.children}
    </div>
  );
};

Modal.Footer = function ModalFooter(props: {
  children: ReactNode;
  className?: string;
  align?: 'right' | 'left' | 'center';
}) {
  const { align = 'right' } = props;
  return (
    <div
      className={clsx(
        'flex flex-col-reverse gap-1 px-2 sm:flex-row sm:gap-2',
        {
          'sm:justify-end': align === 'right',
          'sm:justify-center': align === 'center',
        },
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
