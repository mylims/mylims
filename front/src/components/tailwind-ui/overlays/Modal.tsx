import { Transition } from '@headlessui/react';
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
  animated?: boolean;
  fluid?: boolean;
  wrapperProps?: Omit<PropsOf<T>, 'children'>;
  dialogStyle?: CSSProperties;
}

// @ts-expect-error Chrome isn't in the standard
const isChrome = typeof window !== 'undefined' && window.chrome;

export function Modal<T extends ElementType>(props: ModalProps<T>) {
  const {
    isOpen,
    onRequestClose,
    icon = <AnnotationIcon />,
    iconColor = Color.primary,
    hasCloseButton = true,
    requestCloseOnBackdrop = true,
    requestCloseOnEsc = true,
    animated = true,
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
    if (isOpen) {
      // @ts-ignore
      dialogRef.current?.showModal();
    } else if (!isOpen && dialogRef.current?.hasAttribute('open')) {
      // @ts-ignore
      dialogRef.current?.close();
    }
  }, [isOpen]);

  let modalContents = (
    <div className="flex flex-1">
      {onRequestClose && hasCloseButton ? (
        <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
          <button
            type="button"
            onClick={onRequestClose}
            className="bg-white rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
            aria-label="Close"
          >
            <XIcon className="w-6 h-6" />
          </button>
        </div>
      ) : null}

      <div className="flex flex-col w-full max-h-full sm:flex-row sm:items-start">
        <div
          className={clsx(
            'flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10',
            bgColors[iconColor],
          )}
        >
          <span className={clsx(textColors[iconColor], 'w-6 h-6')}>{icon}</span>
        </div>
        <div className="flex flex-col flex-grow min-w-0 min-h-0 gap-2 text-center sm:gap-3 sm:max-h-full sm:mt-0 sm:ml-4 sm:text-left">
          {children}
        </div>
      </div>
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
          !isChrome
            ? {
                top: '50%',
                // Custom transform is cumulative
                transform: `translateY(-50%) ${
                  dialogStyle?.transform ? dialogStyle.transform : ''
                }`,
                maxHeight: 'calc((100% - 6px) - 2em)',
              }
            : {},
        )}
        className={clsx(
          'fixed text-left flex align-bottom bg-white rounded-lg shadow-xl',
          {
            'sm:max-w-lg sm:w-full': !fluid,
          },
        )}
      >
        <Transition
          show={isOpen}
          enter={clsx('ease-out', { 'duration-300': animated })}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave={clsx('ease-in', {
            'duration-200': animated,
          })}
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="flex flex-1 px-2 pt-5 pb-4 sm:pl-6 sm:pr-4 sm:py-6"
        >
          {modalContents}
        </Transition>
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
        'pl-2 text-lg font-semibold sm:mr-8 text-neutral-900',
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
        'px-2 pb-2 flex flex-col max-w-full min-h-0 overflow-auto',
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
        'px-2 flex gap-2 sm:gap-3 flex-col-reverse sm:flex-row',
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
