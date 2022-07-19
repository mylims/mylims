import { createContext, useContext } from 'react';

import { MeasurementNotebook } from '@/pages/notebook/models';

interface SampleLinkActions {
  samples: string[];
  addSample: (id: string) => void;
  measurements: MeasurementNotebook[];
  addMeasurement: (id: MeasurementNotebook) => void;
}
export const sampleLinkContext = createContext<SampleLinkActions>({
  samples: [],
  addSample() {
    throw new Error('Function not implemented');
  },
  measurements: [],
  addMeasurement() {
    throw new Error('Function not implemented');
  },
});

export function useSampleLinkContext() {
  const context = useContext(sampleLinkContext);
  if (!context) {
    throw new Error(
      'useSampleLinkContext called outside of SampleLink context',
    );
  }
  return context;
}
