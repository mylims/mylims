import { ReducerActions, TableState } from './types';

export function reducer(state: TableState, action: ReducerActions) {
  switch (action.type) {
    case 'ADD_COLUMN': {
      if (findColumn(state, action.payload.value.dataPath) === -1) {
        state.push(action.payload);
      }
      break;
    }
    case 'REMOVE_COLUMN': {
      const index = findColumn(state, action.payload.dataPath);
      if (index !== -1) state.splice(index, 1);
      break;
    }
    default: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      throw new Error(`Unknown reducer type ${(action as any).type}`);
    }
  }
}
function findColumn(state: TableState, dataPath: string): number {
  return state.findIndex(({ value }) => value.dataPath === dataPath);
}
