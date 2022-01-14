import { createContext, useContext } from 'react';

import { SortDirection } from '@/generated/graphql';

import { TableQueryContextType } from '../types';


export const TableQueryContext = createContext<TableQueryContextType>({
  columns: [],
  query: {
    page: '1',
    'sortBy.direction': SortDirection.DESC,
    'sortBy.field': 'id',
  },
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
