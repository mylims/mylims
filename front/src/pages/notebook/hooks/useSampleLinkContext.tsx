import { createContext, useContext } from 'react';

export type SampleLinkState =
  | { type: 'toShow'; payload: { code: string } }
  | { type: 'idle'; payload: null }
  | { type: 'toSave'; payload: { id: string } };
interface SampleLinkActions {
  state: SampleLinkState;
  dispatch: (action: SampleLinkState) => void;
}
export const sampleLinkContext = createContext<SampleLinkActions>({
  state: { type: 'idle', payload: null },
  dispatch: () => {
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
