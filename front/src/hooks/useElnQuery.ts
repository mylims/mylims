import { useMutation, useQuery } from 'react-query';

import { API_URL } from '../../env';

export function useElnQuery(path: string) {
  return useQuery(path, () =>
    fetch(`${API_URL}${path}`, {
      credentials: 'include',
    })
      .then(async (res) => [res.ok, await res.json()])
      .then(([ok, result]) => {
        if (ok) return result;
        else throw new Error(result.errors[0].message);
      }),
  );
}

export function useElnMutation(path: string) {
  return useMutation(path, (body: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    })
      .then(async (res) => [res.ok, await res.json()])
      .then(([ok, result]) => {
        if (ok) return result;
        else throw new Error(result.errors[0].message);
      }),
  );
}
