import { useMutation, useQuery } from 'react-query';

import { API_URL } from '../../env';

async function processResponse(response: Promise<Response>) {
  const res = await response;
  const [ok, result] = [res.ok, await res.json()];
  if (ok) return result;
  else throw new Error(result.errors[0].message);
}

export function useElnQuery(path: string) {
  return useQuery(path, () =>
    processResponse(fetch(`${API_URL}${path}`, { credentials: 'include' })),
  );
}

export function useElnMutation(path: string) {
  return useMutation(path, (body: unknown) =>
    processResponse(
      fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        credentials: 'include',
      }),
    ),
  );
}

export function useElnMultipartMutation(path: string) {
  return useMutation(path, (data: Record<string, string | Blob>) => {
    let body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }

    return processResponse(
      fetch(`${API_URL}${path}`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      }),
    );
  });
}
