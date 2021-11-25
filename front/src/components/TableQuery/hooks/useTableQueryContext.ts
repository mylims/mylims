import { createContext, useContext } from 'react';

import { TableQueryContextType } from '../types';

import { SortDirection } from '@/generated/graphql';

export const TableQueryContext = createContext<TableQueryContextType>({
  query: { page: '1', sortDirection: SortDirection.DESC, sortField: 'id' },
  dispatch: () => {
    // empty
  },
  submitQuery: () => {
    // empty
  },
  setQuery: () => {
    // empty
  },
});

export function useTableQueryContext() {
  const context = useContext(TableQueryContext);
  if (!context) {
    throw new Error('Table compound component outside Table context');
  }
  return context;
}
