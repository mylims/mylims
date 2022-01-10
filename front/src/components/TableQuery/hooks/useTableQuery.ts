import { useSearchParams } from 'react-router-dom';

import type { QueryType, TableQueryHook } from '../types';

export function useTableQuery(defaultQuery: QueryType): TableQueryHook {
  const [searchParams, setSearchParams] = useSearchParams();

  let query: QueryType = defaultQuery;
  for (const [key, value] of searchParams) {
    query[key] = value;
  }

  return {
    query,
    setQuery(newQuery) {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(newQuery)) {
        if (value !== null && value !== '') search.set(key, value);
      }
      setSearchParams(search, { replace: true });
    },
  };
}
