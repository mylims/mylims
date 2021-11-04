import { useQuery, useQueries } from 'react-query';

import { Maybe } from '@/generated/graphql';

function fetchFile(downloadUrl: Maybe<string>) {
  const callback = async () => {
    if (!downloadUrl) return null;
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Fetch error');
    return response.text();
  };
  return callback;
}

export function useFetchFile(
  fileId: Maybe<string>,
  downloadUrl: Maybe<string>,
) {
  const { isLoading, isError, data, error } = useQuery<string | null, Error>(
    `file-${fileId ?? 'none'}`,
    fetchFile(downloadUrl),
  );

  return {
    data: !isLoading && data ? data : null,
    error: isError ? error : null,
  };
}

export function useFetchFileDict(files: Record<string, string>) {
  const keys = Object.keys(files);
  const listQuery = keys.map((key) => ({
    queryKey: `file-${key}`,
    queryFn: fetchFile(files[key]),
  }));
  const queries = useQueries(listQuery);
  let data: Record<string, string | null> = {};
  let error: Error[] = [];
  for (let index = 0; index < keys.length; index++) {
    const {
      isLoading,
      isError,
      data: currData,
      error: currErr,
    } = queries[index];
    if (isError) error.push(currErr as Error);

    data[keys[index]] = !isLoading && currData ? currData : null;
  }
  return { data, error };
}
