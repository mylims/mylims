import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useMeasurementsByNotebookLazyQuery } from '@/generated/graphql';

import { useSampleLinkContext } from '../hooks/useSampleLinkContext';

import { SearchCategories } from './SearchCategories';

export default function MeasurementSearch() {
  const { addMeasurement } = useSampleLinkContext();
  const { id = '' } = useParams<{ id: string }>();
  const [measurementByNotebook, { loading, data }] =
    useMeasurementsByNotebookLazyQuery();

  const measurements = useMemo(() => {
    return (
      data?.measurementsByNotebook.list.map((measurement) => ({
        id: measurement.id,
        kind: measurement.type,
        title:
          measurement.file?.filename ?? measurement.sample.sampleCode.join('_'),
      })) ?? []
    );
  }, [data]);

  const filterResults = useCallback(
    (query: string, kind: string | null) => {
      const key: 'fileName' | 'project' =
        kind === 'project' ? 'project' : 'fileName';
      return measurementByNotebook({
        variables: { notebookId: id, limit: 5, [key]: query },
      });
    },
    [measurementByNotebook, id],
  );

  const onSelect = useCallback(
    (id: string) => {
      const result = measurements.find((s) => s.id === id);
      if (result) {
        addMeasurement({ id, type: result.kind });
      }
    },
    [addMeasurement, measurements],
  );

  return (
    <SearchCategories
      loading={loading}
      onSelect={onSelect}
      results={measurements}
      options={['file', 'project']}
      filterResults={filterResults}
    />
  );
}
