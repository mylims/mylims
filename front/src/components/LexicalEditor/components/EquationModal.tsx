import React from 'react';

import { Input } from '@/components/tailwind-ui';

import { useInsertModalContext } from './InsertOptionsMenu';
import KatexRenderer from './KatexRenderer';

export function EquationModal() {
  const { state, setState } = useInsertModalContext();
  return (
    <div className="m-2 min-w-1/4">
      <Input
        label="Equation"
        name="Equation"
        value={(state as string | null) ?? ''}
        onChange={(event) => setState(event.target.value)}
      />
      <div>Visualization </div>
      <div className="min-h-[3rem]">
        <KatexRenderer
          equation={(state as string | null) ?? ''}
          inline={false}
          onClick={() => null}
        />
      </div>
    </div>
  );
}
