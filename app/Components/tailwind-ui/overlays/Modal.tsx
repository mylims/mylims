import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import polyfill from 'dialog-polyfill-universal';
import React, {
  createElement,
  ElementType,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from 'react';

import { useLockBodyScroll } from '../hooks/useLockBodyScroll';
import { dispatchContext } from '../shortcuts/KeyboardActionContext';
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
  icon: ReactNode;
  iconColor: Color;
  hasCloseButton?: boolean;
  requestCloseOnBackdrop?: boolean;
  requestCloseOnEsc?: boolean;
  wrapperComponent?: T;
  animated?: boolean;
  fluid?: boolean;
  wrapperProps?: Omit<PropsOf<T>, 'children'>;
}

// @ts-ignore Chrome isn't in the standard
const isChrome = typeof window !== 'undefined' && window.chrome;

export function Modal<T extends ElementType>(props: ModalProps<T>) {
  const {
    isOpen,
    onRequestClose,
    hasCloseButton = true,
    requestCloseOnBackdrop = true,
    requestCloseOnEsc = true,
    animated = true,
    fluid = true,
  } = props;

  useLockBodyScroll(isOpen);
  const { dispatch } = useContext(dispatchContext);
  const ref = useRef(props.isOpen);
  useEffect(() => {
    if (!ref.current) {
      dispatch({ type: 'DISABLE_COUNT' });
    }
  }, [dispatch]);
  useEffect(() => {
    if (isOpen) {
      dispatch({
        type: 'DISABLE_COUNT',
      });
    } else {
      dispatch({
        type: 'ENABLE_COUNT',
      });
    }
  }, [dispatch, isOpen]);

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
      dialogRef.current?.showModal();
    } else if (!isOpen && dialogRef.current?.hasAttribute('open')) {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  let modalContents = (
    <div>
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

      <div className="w-full max-h-full sm:flex sm:items-start">
        <div
          className={clsx(
            'flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10',
            bgColors[props.iconColor],
          )}
        >
          <span
            className={clsx(textColors[props.iconColor], 'text-2xl w-6 h-6')}
          >
            {props.icon}
          </span>
        </div>
        <div className="flex flex-col flex-grow min-w-0 mt-3 text-center sm:max-h-full sm:mt-0 sm:ml-4 sm:text-left">
          {props.children}
        </div>
      </div>
    </div>
  );

  if (props.wrapperComponent) {
    modalContents = createElement(
      props.wrapperComponent,
      props.wrapperProps,
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
        style={
          !isChrome
            ? {
                position: 'fixed',
                top: '50%',
                transform: 'translate(0, -50%)',
                maxHeight: 'calc((100% - 6px) - 2em)',
                overflow: 'auto',
              }
            : undefined
        }
        className={clsx(
          'text-left align-bottom bg-white rounded-lg shadow-xl',
          {
            'sm:max-w-lg sm:w-full': !fluid,
            'max-w-full': fluid,
          },
        )}
      >
        <Transition
          show={props.isOpen}
          enter={clsx('ease-out', { 'duration-300': animated })}
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave={clsx('ease-in', {
            'duration-200': animated,
          })}
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          className="px-4 pt-5 pb-4"
        >
          {modalContents}
        </Transition>
      </dialog>
    </Portal>
  );
}

Modal.Header = function ModalHeader(props: { children: ReactNode }) {
  return (
    <h3
      className="mr-10 text-lg font-semibold text-neutral-900"
      id="modal-headline"
    >
      {props.children}
    </h3>
  );
};

Modal.Body = function ModalBody(props: { children: ReactNode }) {
  return (
    <div className="max-w-full min-h-0 mt-2 overflow-auto">
      {props.children}
    </div>
  );
};

Modal.Description = function ModalDescription(props: { children: ReactNode }) {
  return <div className="text-sm text-neutral-500">{props.children}</div>;
};

Modal.Footer = function ModalFooter(props: {
  children: ReactNode;
  align?: 'right' | 'left' | 'center';
}) {
  const { align = 'right' } = props;
  return (
    <div
      className={clsx(
        'mt-5 sm:mt-4 flex space-y-2 flex-col sm:flex-row sm:space-x-3 sm:space-y-0',
        {
          'sm:justify-end': align === 'right',
          'sm:justify-center': align === 'center',
        },
      )}
    >
      {props.children}
    </div>
  );
};
