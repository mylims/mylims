import { useCallback, useEffect, useState } from 'react';

import {
  VerticalNavigationGroupOption,
  VerticalNavigationOption,
  VerticalNavigationOptions,
} from '../navigation/VerticalNavigation';

interface StateElement<T> {
  element: VerticalNavigationGroupOption<T>;
  isOpen: boolean;
}

function createState<T>(
  elements: VerticalNavigationOptions<T>[],
  selected?: VerticalNavigationOption<T>,
) {
  const result: Array<StateElement<T>> = [];

  for (const element of elements) {
    if (element.type === 'group') {
      result.push({
        element,
        isOpen: element.options.some((e) => e.id === selected?.id),
      });
    }
  }

  return result;
}

function updateState<T>(
  draft: Array<StateElement<T>>,
  elements: Array<VerticalNavigationOptions<T>>,
) {
  const result = draft.filter((d) => {
    return elements.some((e) => e.id === d.element.id);
  });

  for (const element of elements) {
    if (
      element.type === 'group' &&
      !result.some((r) => r.element.id === element.id)
    ) {
      result.push({ element, isOpen: false });
    }
  }

  return result;
}

function updateToggleState<T>(
  draft: Array<StateElement<T>>,
  found: StateElement<T>,
  autoCollapse: boolean,
) {
  return draft.map((e) => {
    if (e.element.id === found.element.id) {
      return {
        ...found,
        isOpen: !found.isOpen,
      };
    } else if (!autoCollapse) {
      return e;
    } else {
      return { ...e, isOpen: false };
    }
  });
}

export function useVerticalNavigationCollapse<T>(
  elements: Array<VerticalNavigationOptions<T>>,
  options: { autoCollapse: boolean; selected?: VerticalNavigationOption<T> },
) {
  const selectedOption = options.selected;
  const [state, setState] = useState<
    Array<{ element: VerticalNavigationGroupOption<T>; isOpen: boolean }>
  >(() => createState(elements, selectedOption));

  useEffect(() => {
    if (selectedOption) {
      // When the selected option changes externally, make sure the corresponding
      // group is opened.
      setState((draft) => {
        const matchingGroup = draft.findIndex((group) =>
          group.element.options.some(
            (option) => option.id === selectedOption.id,
          ),
        );
        if (matchingGroup === -1 || draft[matchingGroup].isOpen) {
          // Do nothing if no group matches or if it's already open.
          return draft;
        }
        const newState = draft.slice();
        newState[matchingGroup] = { ...newState[matchingGroup], isOpen: true };
        return newState;
      });
    }
  }, [selectedOption]);

  useEffect(() => {
    setState((draft) => updateState(draft, elements));
  }, [elements]);

  const isElementOpen = useCallback(
    (element: VerticalNavigationGroupOption<T>) => {
      const found = state.find((el) => el.element.id === element.id);
      return found?.isOpen || false;
    },
    [state],
  );

  const toggleElement = useCallback(
    (element: VerticalNavigationGroupOption<T>) => {
      const found = state.find((el) => el.element.id === element.id);
      if (found !== undefined) {
        setState((draft) =>
          updateToggleState(draft, found, options.autoCollapse),
        );
      }
    },
    [state, options.autoCollapse],
  );

  return {
    isElementOpen,
    toggleElement,
  };
}
