import React, { useCallback, useMemo } from 'react';

import {
  MeasurementTypes,
  useMeasurementsFilteredLazyQuery,
} from '@/generated/graphql';

import { useSampleLinkContext } from '../hooks/useSampleLinkContext';

import { SearchCategories } from './SearchCategories';

export default function MeasurementSearch() {
  const { addMeasurement } = useSampleLinkContext();
  const [measurementsFiltered, { loading, data }] =
    useMeasurementsFilteredLazyQuery();

  const measurements = useMemo(() => {
    return (
      data?.measurements.list.map((measurement) => ({
        id: measurement.id,
        kind: measurement.type,
        title:
          measurement.file?.filename ?? measurement.sample.sampleCode.join('_'),
      })) ?? []
    );
  }, [data]);

  const filterResults = useCallback(
    (query: string, kind: string | null) => {
      return measurementsFiltered({
        // variables: { sampleCode: query, kind, limit: 3 },
      });
    },
    [measurementsFiltered],
  );

  const onSelect = useCallback(
    (id: string) => {
      const result = measurements.find((s) => s.id === id);
      if (result) {
        addMeasurement({ id, type: result.kind as MeasurementTypes });
      }
    },
    [addMeasurement, measurements],
  );

  return (
    <SearchCategories
      loading={loading}
      onSelect={onSelect}
      results={measurements}
      options={['project', 'sample']}
      filterResults={filterResults}
    />
  );
}
