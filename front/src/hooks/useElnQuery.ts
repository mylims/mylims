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

export function useElnMultipartMutation(path: string) {
  return useMutation(path, async (data: Record<string, string | Blob>) => {
    let body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body,
    });
    const [ok, result] = [res.ok, await res.json()];
    if (ok) return result;
    else throw new Error(result.errors[0].message);
  });
}
