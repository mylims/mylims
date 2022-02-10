import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { useSampleQuery } from '@/generated/graphql';
import { Alert, AlertType, Input, Spinner } from '@/components/tailwind-ui';
import { EditableTable } from '@/components/EditableTable';
import FieldDescription from '@/components/FieldDescription';

const DIAMETERS: Record<string, number | undefined> = {
  '2': 4,
  '2 inch': 4,
  '4': 16,
  '4 inch': 16,
  '6': 38,
  '6 inch': 38,
};
interface MultiCreateProps {}
export function MultiCreate({}: MultiCreateProps) {
  const [localError, setError] = useState<Error | null>(null);
  const [rows, setRows] = useState(4);

  const [searchParams] = useSearchParams();
  const id = searchParams.get('parent') ?? '';
  if (!id) setError(new Error('No parent id provided'));

  const { data, loading, error } = useSampleQuery({ variables: { id } });
  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !data || localError) {
    return (
      <Alert title="Error while fetching parent" type={AlertType.ERROR}>
        {error && `Fetch error: ${error.message}`}
        {localError && `Error: ${localError.message}`}
        {!data && `Fetch error: Empty data`}
      </Alert>
    );
  }

  const {
    sample: { sampleCode, meta },
  } = data;
  const diameter: string = meta?.size ?? '-';
  const diameterRows: number | undefined = DIAMETERS[diameter];
  return (
    <div>
      <div className="mb-2 flex flex-row gap-4">
        <FieldDescription title="Diameter">{diameter}</FieldDescription>
        {diameterRows !== undefined ? (
          <FieldDescription title="Number of rows">
            {diameterRows}
          </FieldDescription>
        ) : (
          <Input
            name="rows"
            label="Number of rows"
            value={rows}
            type="number"
            onChange={(e) => setRows(Number(e.target.value))}
          />
        )}
      </div>
      <EditableTable
        prepend={sampleCode.join('_') + '_'}
        rows={diameterRows ?? rows}
        columns={[
          { name: 'project', label: 'Project' },
          { name: 'comment', label: 'Comment' },
          { name: 'meta.heterostructure', label: 'Heterostructure' },
        ]}
        onChange={() => {}}
      />
    </div>
  );
}
MultiCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Create multiple samples">{page}</ElnLayout>
);
