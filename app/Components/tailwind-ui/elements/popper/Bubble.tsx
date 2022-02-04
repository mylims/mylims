import { Placement } from '@popperjs/core';
import clsx from 'clsx';
import React, { cloneElement, useRef, ReactNode, Ref } from 'react';
import { Popper as ReactPopper, Manager, Reference } from 'react-popper';

import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface PopperRenderCallbackArgs {
  scheduleUpdate: () => void;
  placement: Placement;
}

type TypeReference =
  | JSX.Element
  | ((props: { ref: Ref<unknown> }) => JSX.Element);

export interface BubbleProps {
  visible: boolean;
  placement?: Placement;
  reference: TypeReference;
  children: ReactNode | ((args: PopperRenderCallbackArgs) => ReactNode);
  className?: string;
  popperClassName?: string;
  onClickOutside: (event: Event) => void;
}

export function Bubble(props: BubbleProps) {
  const { reference, children, visible, placement, onClickOutside } = props;

  const popperRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(popperRef, onClickOutside);
  return (
    <Manager>
      <Reference>
        {({ ref }) => {
          let toRender;
          if (typeof reference === 'function') {
            toRender = reference({ ref });
          } else {
            toRender = cloneElement(reference, { ref });
          }
          return (
            <>
              {visible && (
                <div className="fixed inset-0 z-30 block bg-transparent" />
              )}
              {toRender}
            </>
          );
        }}
      </Reference>
      <ReactPopper placement={placement}>
        {({ ref, style, placement: innerPlacement, arrowProps, update }) => {
          if (!visible) return null;
          let popperElement: ReactNode;
          if (typeof children === 'function') {
            popperElement = children({
              scheduleUpdate: update,
              placement: innerPlacement,
            });
          } else {
            popperElement = children;
          }

          if (popperElement === null) return null;
          return (
            <div
              ref={ref}
              className={clsx(props.popperClassName, 'z-50')}
              style={style}
            >
              <div ref={popperRef}>
                <div
                  className="rounded-lg border-2 border-neutral-200 bg-white"
                  style={{
                    margin: '0.9em',
                  }}
                >
                  {popperElement}
                </div>
                <div
                  className="bubble-arrow"
                  ref={arrowProps.ref}
                  style={arrowProps.style}
                  data-placement={innerPlacement}
                />
              </div>
            </div>
          );
        }}
      </ReactPopper>
    </Manager>
  );
}
