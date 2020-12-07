import { v4 as uuid } from '@lukeed/uuid';
import { useContext, useEffect, useMemo } from 'react';

import { dispatchContext } from '../shortcuts/KeyboardActionContext';
import { KeyboardAction } from '../shortcuts/KeyboardActionProvider';
import { commandKeyExists } from '../util';

export function useGlobalKeyboardActions(options: KeyboardAction[]) {
  const { dispatch, disabled } = useContext(dispatchContext);

  const hookId = useMemo(() => {
    return uuid();
  }, []);
  useEffect(() => {
    const handlers = options.map((option) => (event: KeyboardEvent) => {
      const { keys, cmdKey = false, handler } = option;

      if (disabled) return;

      if (!keys.includes(event.key)) {
        return;
      }

      const eventCmdKey = commandKeyExists ? event.metaKey : event.ctrlKey;
      if (eventCmdKey !== cmdKey) {
        return;
      }
      if (event.target) {
        const tagName = (event.target as HTMLElement).tagName;
        if (tagName === 'INPUT' || tagName === 'TEXTAREA') {
          return;
        }
      }
      event.preventDefault();
      event.stopPropagation();
      handler(event);
    });
    handlers.forEach((handler) => {
      document.addEventListener('keydown', handler, true);
    });
    dispatch({
      type: 'ADD_ACTIONS',
      payload: {
        actions: options,
        hookId,
      },
    });

    return () => {
      dispatch({
        type: 'REMOVE_ACTIONS',
        payload: hookId,
      });
      handlers.forEach((handler) =>
        document.removeEventListener('keydown', handler, true),
      );
    };
  }, [options, hookId, dispatch, disabled]);
}

export function useGlobalKeyboardOnOff() {
  const { dispatch } = useContext(dispatchContext);
  return useMemo(() => {
    return [
      () => {
        dispatch({
          type: 'ENABLE',
        });
      },
      () => {
        dispatch({
          type: 'DISABLE',
        });
      },
    ];
  }, [dispatch]);
}
