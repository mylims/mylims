import { createContext } from 'react';

import { ActionType } from '../types';

import { KeyboardAction, KeyboardActionState } from './KeyboardActionProvider';

export type KeyboardActions =
  | ActionType<
      'ADD_ACTIONS',
      {
        actions: KeyboardAction[];
        hookId: string;
      }
    >
  | ActionType<'REMOVE_ACTIONS', string>
  | ActionType<'DISABLE'>
  | ActionType<'ENABLE'>
  | ActionType<'DISABLE_COUNT'>
  | ActionType<'ENABLE_COUNT'>;

export interface KeyboardActionContext {
  actions: KeyboardActionState[];
}

export const context = createContext<KeyboardActionContext>({
  actions: [],
});

export const dispatchContext = createContext<{
  dispatch: (type: KeyboardActions) => void;
  disabled: boolean;
}>({
  dispatch: () => {
    // no-op
  },
  disabled: false,
});
