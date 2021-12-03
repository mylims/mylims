import { useHistory, useLocation } from 'react-router-dom';

import type { QueryType, TableQueryHook } from '../types';

export function useTableQuery(defaultQuery: QueryType): TableQueryHook {
  const router = useHistory();

  let query: QueryType = defaultQuery;
  for (const [key, value] of new URLSearchParams(useLocation().search)) {
    query[key] = value;
  }
  return {
    query,
    setQuery: (newQuery) => {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(newQuery)) {
        if (value !== null && value !== '') search.set(key, value);
      }
      router.replace(`?${search.toString()}`);
    },
  };
}
