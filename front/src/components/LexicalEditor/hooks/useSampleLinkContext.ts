import { createContext, useContext } from 'react';

interface SampleLinkActions {
  samples: string[];
  addSample: (id: string) => void;
}
export const sampleLinkContext = createContext<SampleLinkActions>({
  samples: [],
  addSample() {
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
