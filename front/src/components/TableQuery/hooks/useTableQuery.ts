import { useHistory, useLocation } from 'react-router-dom';

import type { TableQueryHook } from '../types';

const PAGE_SIZE = 10;
export function useTableQuery(
  defaultQuery: Record<string, string>,
): TableQueryHook {
  const router = useHistory();

  let query: Record<string, string> = defaultQuery;
  let page = 1;
  for (const [key, value] of new URLSearchParams(useLocation().search)) {
    if (key === 'page') {
      page = parseInt(value, 10);
    } else {
      query[key] = value;
    }
  }
  return {
    pagination: { page, skip: (page - 1) * PAGE_SIZE, limit: PAGE_SIZE },
    query,
    setQuery: (newQuery) => {
      const search = new URLSearchParams();
      for (const [key, value] of Object.entries(newQuery)) {
        search.set(key, value as string);
      }
      router.replace(`?${search.toString()}`);
    },
  };
}
