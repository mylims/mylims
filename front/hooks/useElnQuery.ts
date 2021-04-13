import { useMutation, useQuery } from 'react-query';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_URL');
}

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export function useElnQuery(path: string) {
  return useQuery(path, () =>
    fetch(`${baseUrl}${path}`, {
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
    fetch(`${baseUrl}${path}`, {
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
