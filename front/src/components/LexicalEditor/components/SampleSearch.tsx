import React, { useCallback } from 'react';

import { SearchCategories } from '@/components/LexicalEditor/components/SearchCategories';
import { useSamplesByCodeLazyQuery } from '@/generated/graphql';
import { sampleLevelsList } from '@/models/sample';

import { useSampleLinkContext } from '../hooks/useSampleLinkContext';

export default function SampleSearch() {
  const { addSample } = useSampleLinkContext();
  const [samplesByCode, { loading, data }] = useSamplesByCodeLazyQuery();

  const samples =
    data?.samplesByCode.map((sample) => ({
      id: sample.id,
      kind: sample.kind.id,
      title: sample.sampleCode.join('_'),
    })) ?? [];

  const filterResults = useCallback(
    (query: string, kind: string | null) => {
      return samplesByCode({
        variables: { sampleCode: query, kind, limit: 3 },
      });
    },
    [samplesByCode],
  );

  return (
    <SearchCategories
      loading={loading}
      onSelect={addSample}
      results={samples}
      options={sampleLevelsList}
      defaultOption="all"
      filterResults={filterResults}
    />
  );
}
