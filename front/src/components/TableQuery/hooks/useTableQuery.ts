import type { TableQueryHook } from '../types';

export function useTableQuery<T>(defaultQuery: T): TableQueryHook<T> {
  return {
    pagination: { page: 1, skip: 0, limit: 10 },
    query: defaultQuery,
    setQuery: (query: T) => query,
  };
}
