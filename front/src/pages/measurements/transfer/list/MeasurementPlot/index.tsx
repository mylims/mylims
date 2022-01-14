import React, { createContext, useEffect, useState } from 'react';

import type { QueryType } from '@/components/TableQuery/types';
import { Card } from '@/components/tailwind-ui';
import { MeasurementTypes } from '@/generated/graphql';
import { useFetchFileDict } from '@/hooks/useFetchFile';

import MeasurementTypeRender from './MeasurementTypeRender';

interface MeasurementPlotProps {
  type: MeasurementTypes;
  query: QueryType;
  children: JSX.Element;
}
type MeasurementState = Record<string, string>;
interface MeasurementContextState<T> {
  state: T;
  setState: React.Dispatch<React.SetStateAction<T>>;
}

export const MeasurementPlotContext = createContext<
  MeasurementContextState<MeasurementState>
>({
  state: {},
  setState: () => {
    // empty function
  },
});

export function MeasurementPlot({
  type,
  query,
  children,
}: MeasurementPlotProps) {
  const [state, setState] = useState<MeasurementState>({});
  const { data, error } = useFetchFileDict(state);
  useEffect(() => {
    setState({});
  }, [query]);

  return (
    <MeasurementPlotContext.Provider value={{ state, setState }}>
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
