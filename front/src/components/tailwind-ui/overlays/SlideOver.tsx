import { Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, {
  ElementType,
  ReactElement,
  ReactNode,
  createElement,
  useRef,
} from 'react';

import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { PropsOf, Size } from '../types';

import { Portal } from './Portal';

function getSizeClassname(size: Size): string {
  const record: Record<Size, string> = {
    xSmall: 'max-w-xs',
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xLarge: 'max-w-xl',
  };

  return record[size];
}

export interface SlideOverProps<T extends ElementType> {
  isOpen: boolean;
  children: Array<ReactElement>;
  onClose?: () => void;
  wrapperComponent?: T;
  wrapperProps?: Omit<PropsOf<T>, 'children'>;
  requestCloseOnClickOutside?: boolean;
  maxWidth?: Size;
  allowPageInteraction?: boolean;
  afterOpen?: () => void;
  afterClose?: () => void;
}

export function SlideOver<T extends ElementType>(props: SlideOverProps<T>) {
  const {
    requestCloseOnClickOutside = true,
    maxWidth: maxWidthSlideOver = Size.medium,
    allowPageInteraction = false,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    if (requestCloseOnClickOutside) {
      props.onClose?.();
    }
  });

  const Header = props.children.find((node) =>
    // @ts-expect-error Should be removed when we move to CSS Grid implementation.
    node.type.name?.endsWith('Header'),
  );
  const Footer = props.children.find((node) =>
    // @ts-expect-error Ditto.
    node.type.name?.endsWith('Footer'),
  );
  const Content = props.children.find((node) =>
    // @ts-expect-error Ditto.
    node.type.name?.endsWith('Content'),
  );

  let slideOverContents = (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <section className="absolute inset-y-0 right-0 flex max-w-full pl-10 pointer-events-auto">
        <Transition.Child
          enter="transform transition ease-out duration-400 sm:duration-500"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-out duration-500 sm:duration-600"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className={clsx('w-screen', getSizeClassname(maxWidthSlideOver))}
          afterEnter={props.afterOpen}
          afterLeave={props.afterClose}
        >
          <div
            ref={ref}
            className="flex flex-col h-full bg-white divide-y shadow divide-neutral-200"
          >
            <div className="flex flex-col flex-1 min-h-0 gap-6 py-6 ">
              <header className="px-4 sm:px-6">
                <div className="flex items-start justify-between space-x-3">
                  {Header}
                  {props.onClose && (
                    <div className="flex items-center h-7">
                      <button
                        type="button"
                        onClick={props.onClose}
                        className="bg-white rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                      >
                        <XIcon className="w-6 h-6" />
                      </button>
                    </div>
                  )}
                </div>
              </header>
              {Content}
            </div>
            {Footer}
          </div>
        </Transition.Child>
      </section>
    </div>
  );

  if (props.wrapperComponent) {
    slideOverContents = createElement(
      props.wrapperComponent,
      props.wrapperProps,
      slideOverContents,
    );
  }

  return (
    <Portal>
      <Transition
        show={props.isOpen}
        className={clsx(
          'fixed inset-0 z-50 overflow-hidden',
          allowPageInteraction && 'pointer-events-none',
        )}
      >
        {slideOverContents}
      </Transition>
    </Portal>
  );
}

SlideOver.Header = function SlideOverHeader(props: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={props.className}>{props.children}</div>;
};

SlideOver.Content = function SlideOverContent(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'relative flex-1 px-4 overflow-y-auto sm:px-6',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};

SlideOver.Footer = function SlideOverFooter(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        'flex justify-end flex-shrink-0 px-4 py-4 space-x-3',
        props.className,
      )}
    >
      {props.children}
    </div>
  );
};
