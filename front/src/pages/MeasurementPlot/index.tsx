import React, { createContext, useState } from 'react';

import { MeasurementTypes } from '@/generated/graphql';
import { useFetchFileDict } from '@/hooks/useFetchFile';
import MeasurementTypeRender from '@/pages/MeasurementPlot/MeasurementTypeRender';

interface MeasurementPlotProps {
  type: MeasurementTypes;
  children: JSX.Element;
}
type MeasurementState = Record<string, string>;
interface MeasurementContextState<T> {
  enabled: boolean;
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
}

export const MeasurementPlotContext = createContext<
  MeasurementContextState<MeasurementState>
>({
  enabled: false,
  state: {},
  setState: () => {
    // empty function
  },
});

export function MeasurementPlot({ type, children }: MeasurementPlotProps) {
  const [state, setState] = useState<MeasurementState>({});
  const { data, error } = useFetchFileDict(state);

  if (type === MeasurementTypes.GENERAL) {
    return (
      <MeasurementPlotContext.Provider
        value={{ enabled: false, state, setState }}
      >
        {children}
      </MeasurementPlotContext.Provider>
    );
  }

  return (
    <MeasurementPlotContext.Provider value={{ enabled: true, state, setState }}>
      <div className="flex flex-col md:justify-between md:flex-row-reverse">
        <div>
          <MeasurementTypeRender type={type} data={data} error={error} />
        </div>
        {children}
      </div>
    </MeasurementPlotContext.Provider>
  );
}
