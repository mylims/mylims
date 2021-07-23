import { useLocation } from 'react-router-dom';

export function useQuery() {
  let query: Record<string, string | undefined> = {};
  for (const [key, value] of new URLSearchParams(useLocation().search)) {
    query[key] = value;
  }
  return query;
}
