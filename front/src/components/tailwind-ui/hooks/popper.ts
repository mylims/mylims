import { useState } from 'react';
import { Modifier, usePopper } from 'react-popper';

const sameWidth: Modifier<'sameWidth'> = {
  name: 'sameWidth',
  enabled: true,
  phase: 'beforeWrite',
  requires: ['computeStyles'],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect: ({ state }) => {
    state.elements.popper.style.width = `${
      state.elements.reference.getBoundingClientRect().width
    }px`;
  },
};

export function useSameWidthPopper(options: {
  placement: 'top' | 'bottom';
  distance?: number;
}) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const modifiers: Modifier<'sameWidth' | 'offset'>[] = [sameWidth];
  if (options.distance) {
    modifiers.push({
      name: 'offset',
      options: {
        offset: [0, options.distance],
      },
    });
  }

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: options.placement,
    strategy: 'fixed',
    modifiers,
  });

  return {
    setReferenceElement,
    setPopperElement,
    popperProps: {
      style: styles.popper,
      ...attributes.popper,
    },
  };
}
