import type { ReducerActions, TableState } from './types';

export function reducer(state: TableState, action: ReducerActions) {
  switch (action.type) {
    case 'ADD_COLUMN': {
      state.push(action.payload);
      break;
    }
    case 'REMOVE_COLUMN': {
      state.filter(({ index }) => index !== action.payload.index);
      break;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown reducer type ${(action as any).type}`);
    }
  }
}
