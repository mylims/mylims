import { v4 as uuid } from '@lukeed/uuid';
import React, { ReactNode, useMemo, useReducer } from 'react';

import {
  context,
  KeyboardActions,
  dispatchContext,
} from './KeyboardActionContext';

export interface KeyboardActionState {
  keys: string[];
  cmdKey: boolean;
  description: string;
  hookId: string;
  id: string;
}

export interface KeyboardAction {
  keys: string[];
  handler: (event: KeyboardEvent) => void;
  cmdKey?: boolean;
  description: string;
}

interface KeyboardActionReducerState {
  actions: KeyboardActionState[];
  disabled: boolean;
  disableCount: number;
}

function reducer(
  state: KeyboardActionReducerState,
  action: KeyboardActions,
): KeyboardActionReducerState {
  const newState = { ...state };
  switch (action.type) {
    case 'ADD_ACTIONS': {
      if (action.payload.actions.length === 0) return state;
      const hookId = action.payload.hookId;
      newState.actions = newState.actions.slice();
      newState.actions.push(
        ...action.payload.actions.map((action) => {
          const { cmdKey = false, keys, description } = action;
          return {
            keys,
            cmdKey,
            hookId,
            description,
            id: uuid(),
          };
        }),
      );
      const newKeys = newState.actions
        .map((act) => act.keys.map((key) => `${act.cmdKey ? 'cmd' : ''}${key}`))
        .flat();
      const uniqueShortcuts = new Set(newKeys);
      if (newKeys.length !== uniqueShortcuts.size) {
        throw new Error(
          '2 keyboard action handlers use the same key combination',
        );
      }
      break;
    }
    case 'REMOVE_ACTIONS':
      if (!state.actions.some((act) => act.hookId === action.payload)) {
        return state;
      }
      newState.actions = state.actions.filter(
        (act) => act.hookId !== action.payload,
      );
      break;
    case 'DISABLE':
      if (state.disabled) return state;
      newState.disabled = true;
      break;
    case 'ENABLE':
      if (!state.disabled) return state;
      newState.disabled = false;
      break;
    case 'ENABLE_COUNT':
      --newState.disableCount;
      break;
    case 'DISABLE_COUNT':
      ++newState.disableCount;
      break;
    default:
      throw new Error('unreachable');
  }
  return newState;
}

const initialState: KeyboardActionReducerState = {
  actions: [],
  disabled: false,
  disableCount: 0,
};

export function KeyboardActionProvider(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchProviderValue = useMemo(() => {
    return {
      dispatch,
      disabled: state.disabled ? true : state.disableCount > 0,
    };
  }, [dispatch, state.disabled, state.disableCount]);
  return (
    <div className="outline-none" tabIndex={0}>
      <dispatchContext.Provider value={dispatchProviderValue}>
        <context.Provider value={{ actions: state.actions }}>
          {props.children}
        </context.Provider>
      </dispatchContext.Provider>
    </div>
  );
}
