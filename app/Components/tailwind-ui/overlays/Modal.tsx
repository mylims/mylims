import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import React, {
  ElementType,
  ReactNode,
  createElement,
  useContext,
  useEffect,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';

import { useLockBodyScroll } from '..';
import { dispatchContext } from '../shortcuts/KeyboardActionContext';
import { SvgOutlineX } from '../svg/heroicon/outline';
import { Color, PropsOf } from '../types';

export interface ModalProps<T extends ElementType> {
  isOpen: boolean;
  icon: ReactNode;
  iconColor: Color;
  children: ReactNode;
  onRequestClose?: () => void;
  requestCloseOnEsc?: boolean;
  fluid?: boolean;
  animated?: boolean;
  wrapperComponent?: T;
  wrapperProps?: Omit<PropsOf<T>, 'children'>;
}

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

export function Modal<T extends ElementType>(props: ModalProps<T>) {
  const { isOpen, onRequestClose, requestCloseOnEsc } = props;
  useLockBodyScroll(isOpen);
  const { dispatch } = useContext(dispatchContext);
  const ref = useRef(props.isOpen);
  useEffect(() => {
    if (!ref.current) {
      dispatch({ type: 'DISABLE_COUNT' });
    }
  }, [dispatch]);
  useEffect(() => {
    if (props.isOpen) {
      dispatch({
        type: 'DISABLE_COUNT',
      });
    } else {
      dispatch({
        type: 'ENABLE_COUNT',
      });
    }
  }, [dispatch, props.isOpen]);

  useEffect(() => {
    function onEsc(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onRequestClose?.();
      }
    }
    if (isOpen && requestCloseOnEsc) {
      document.addEventListener('keydown', onEsc);
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
    };
  }, [onRequestClose, isOpen, requestCloseOnEsc]);

  const { animated: animation = true } = props;

  let modalContents = (
    <div
      className="flex items-end justify-center h-full px-4 pt-4 pb-20 text-center sm:block"
      onClick={props.onRequestClose}
    >
      <div className="fixed inset-0">
        <div className="absolute inset-0 opacity-75 bg-neutral-500" />
      </div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" />
      &#8203;
      <div
        onClick={(event) => {
          if (props.onRequestClose) {
            // don't let overlay receive the click event to prevent modal from closing
            event.stopPropagation();
          }
        }}
        className={clsx(
          'max-h-full inline-flex px-4 pt-5 pb-4 overflow-x-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6',
          {
            'sm:max-w-lg sm:w-full': !props.fluid,
            'max-w-full': props.fluid,
          },
        )}
      >
        {props.onRequestClose !== undefined && (
          <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              onClick={props.onRequestClose}
              className="bg-white rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
              aria-label="Close"
            >
              <SvgOutlineX className="w-6 h-6" />
            </button>
          </div>
        )}
        <div className="w-full max-h-full sm:flex sm:items-start">
          <div
            className={clsx(
              'flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto rounded-full sm:mx-0 sm:h-10 sm:w-10',
              bgColors[props.iconColor],
            )}
          >
            <span className={clsx(textColors[props.iconColor], 'text-2xl')}>
              {props.icon}
            </span>
          </div>
          <div className="flex flex-col flex-grow min-w-0 mt-3 text-center sm:max-h-full sm:mt-0 sm:ml-4 sm:text-left">
            {props.children}
          </div>
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
      <Transition
        className="fixed inset-0 z-50 overflow-y-auto"
        show={props.isOpen}
        enter={clsx('ease-out', { 'duration-300': animation })}
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave={clsx('ease-in', {
          'duration-200': animation,
        })}
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {modalContents}
      </Transition>
    </Portal>
  );
}

Modal.Header = function (props: { children: ReactNode }) {
  return (
    <h3 className="text-lg font-semibold text-neutral-900" id="modal-headline">
      {props.children}
    </h3>
  );
};

Modal.Body = function (props: { children: ReactNode }) {
  return (
    <div className="max-w-full min-h-0 mt-2 overflow-auto">
      {props.children}
    </div>
  );
};

Modal.Description = function (props: { children: ReactNode }) {
  return <p className="text-sm text-neutral-500">{props.children}</p>;
};

Modal.Footer = function (props: {
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

const Portal: React.FC = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};
