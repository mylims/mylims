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
  hasCloseButton?: boolean;
}

export function SlideOver<T extends ElementType>(props: SlideOverProps<T>) {
  const {
    requestCloseOnClickOutside = true,
    maxWidth: maxWidthSlideOver = Size.medium,
    allowPageInteraction = false,
    hasCloseButton = true,
    children,
    isOpen,
    onClose,
    afterOpen,
    afterClose,
    wrapperComponent,
    wrapperProps,
  } = props;

  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    if (requestCloseOnClickOutside) {
      onClose?.();
    }
  });

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
          afterEnter={afterOpen}
          afterLeave={afterClose}
        >
          <div
            ref={ref}
            style={{
              gridTemplateColumns: '1fr auto',
              gridTemplateRows: 'auto 1fr auto',
              gridTemplateAreas:
                "'header close' 'content content' 'footer footer'",
            }}
            className="grid h-full pt-6 bg-white shadow gap-y-6"
          >
            {onClose && hasCloseButton && (
              <div style={{ gridArea: 'close' }} className="pr-4 h-7 sm:pr-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white rounded-full text-neutral-400 hover:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                >
                  <XIcon className="w-6 h-6" />
                </button>
              </div>
            )}
            {children}
          </div>
        </Transition.Child>
      </section>
    </div>
  );

  if (wrapperComponent) {
    slideOverContents = createElement(
      wrapperComponent,
      wrapperProps,
      slideOverContents,
    );
  }

  return (
    <Portal>
      <Transition
        show={isOpen}
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
  return (
    <header
      style={{ gridArea: 'header' }}
      className={clsx('px-4 sm:px-6', props.className)}
    >
      {props.children}
    </header>
  );
};

SlideOver.Content = function SlideOverContent(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      style={{ gridArea: 'content' }}
      className={clsx(
        'px-4 sm:px-6 relative flex-1 overflow-y-auto',
        props.className,
      )}
    >
      {props.children}
    </main>
  );
};

SlideOver.Footer = function SlideOverFooter(props: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <footer
      style={{ gridArea: 'footer' }}
      className={clsx(
        'px-4 sm:px-6 flex justify-end flex-shrink-0 py-4 space-x-3 border-t border-neutral-200',
        props.className,
      )}
    >
      {props.children}
    </footer>
  );
};
