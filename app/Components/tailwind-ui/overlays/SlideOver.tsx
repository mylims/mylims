import { Transition } from '@headlessui/react';
import React, {
  ElementType,
  ReactElement,
  ReactNode,
  createElement,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';

import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { SvgOutlineX } from '../svg/heroicon/outline';
import { PropsOf } from '../types';

export interface SlideOverProps<T extends ElementType> {
  isOpen: boolean;
  children: Array<ReactElement>;
  onClose?: () => void;
  wrapperComponent?: T;
  wrapperProps?: Omit<PropsOf<T>, 'children'>;
}

export function SlideOver<T extends ElementType>(props: SlideOverProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => {
    props.onClose?.();
  });

  const Header = props.children.find((node) => node.type === SlideOver.Header);
  const Footer = props.children.find((node) => node.type === SlideOver.Footer);
  const Content = props.children.find(
    (node) => node.type === SlideOver.Content,
  );

  let slideOverContents = (
    <div className="absolute inset-0 overflow-hidden">
      <section className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <Transition.Child
          enter="transform transition ease-out duration-400 sm:duration-500"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-out duration-500 sm:duration-600"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="w-screen max-w-md"
        >
          <div
            ref={ref}
            className="flex flex-col h-full bg-white divide-y shadow divide-neutral-200"
          >
            <div className="flex flex-col flex-1 min-h-0 py-6 space-y-6 ">
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
                        <SvgOutlineX className="w-6 h-6" />
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
        className="fixed inset-0 z-50 overflow-hidden"
      >
        {slideOverContents}
      </Transition>
    </Portal>
  );
}

SlideOver.Header = function (props: { children: ReactNode }) {
  return <>{props.children}</>;
};

SlideOver.Content = function (props: { children: ReactNode }) {
  return <div className="relative flex-1 px-4 sm:px-6">{props.children}</div>;
};

SlideOver.Footer = function (props: { children: ReactNode }) {
  return (
    <div className="flex justify-end flex-shrink-0 px-4 py-4 space-x-3">
      {props.children}
    </div>
  );
};

const Portal: React.FC = ({ children }) => {
  return ReactDOM.createPortal(children, document.body);
};
