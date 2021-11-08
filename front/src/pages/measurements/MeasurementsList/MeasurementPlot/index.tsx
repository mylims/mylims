import React, { createContext, useState } from 'react';

import MeasurementTypeRender from './MeasurementTypeRender';

import { Card } from '@/components/tailwind-ui';
import { MeasurementTypes } from '@/generated/graphql';
import { useFetchFileDict } from '@/hooks/useFetchFile';

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
        <div className="md:ml-3">
          <Card>
            <Card.Header className="px-6 py-3 text-xs font-semibold tracking-wider text-left uppercase text-neutral-500 bg-neutral-50">
              Preview
            </Card.Header>
            <Card.Body className="w-3xl">
              <MeasurementTypeRender type={type} data={data} error={error} />
            </Card.Body>
          </Card>
        </div>
        <div className="w-3xl">{children}</div>
      </div>
    </MeasurementPlotContext.Provider>
  );
}