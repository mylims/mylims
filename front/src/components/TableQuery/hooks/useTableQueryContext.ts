import { createContext, useContext } from 'react';

import { TableQueryContextType } from '../types';

export const TableQueryContext = createContext<TableQueryContextType>({
  query: {},
  dispatch: () => {},
});

export function useTableQueryContext() {
  const context = useContext(TableQueryContext);
  if (!context) {
    throw new Error('Table compound component outside Table context');
  }
  return context;
}
