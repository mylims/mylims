import { unflatten } from 'flat';
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { EditableTable } from '@/components/EditableTable';
import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import {
  Alert,
  AlertType,
  Button,
  Input,
  Size,
  Spinner,
} from '@/components/tailwind-ui';
import {
  SampleInput,
  useCreateMultipleSamplesMutation,
  useSampleQuery,
} from '@/generated/graphql';
import useAuth from '@/hooks/useAuth';

type Value = Record<string, string | undefined>;
const DIAMETERS: Record<string, number | undefined> = {
  '2': 4,
  '2 inch': 4,
  '4': 16,
  '4 inch': 16,
  '6': 38,
  '6 inch': 38,
};
export function MultiCreate() {
  const [localError, setError] = useState<Error | null>(null);
  const [rows, setRows] = useState(1);
  const [table, setTable] = useState<Value[]>([]);
  const { id: userId } = useAuth();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const id = searchParams.get('parent') ?? '';
  if (!id) setError(new Error('No parent id provided'));

  const {
    data,
    loading: queryLoading,
    error: queryError,
  } = useSampleQuery({ variables: { id } });
  const [createSamples, { loading: creationLoading, error: creationError }] =
    useCreateMultipleSamplesMutation();

  if (queryLoading || creationLoading) {
    return <Spinner className="h-10 w-10 text-danger-500" />;
  }
  if (queryError || !data || localError || creationError || !userId) {
    return (
      <Alert title="Error while fetching parent" type={AlertType.ERROR}>
        {queryError && `Fetch error: ${queryError.message}`}
        {creationError && `Creation error: ${creationError.message}`}
        {localError && `Error: ${localError.message}`}
        {!data && `Fetch error: Empty data`}
        {!userId && `Error: No user id`}
      </Alert>
    );
  }

  const {
    sample: { sampleCode, meta, project },
  } = data;
  const diameter: string = meta?.size ?? '-';
  const diameterRows: number | undefined = /chip/i.test(diameter)
    ? 1
    : DIAMETERS[diameter];
  return (
    <div>
      <div className="mb-2 flex flex-row justify-between">
        <div className="flex flex-row gap-4">
          <h2 className="text-xl font-bold leading-tight text-neutral-900">
            Create samples from wafer {sampleCode.join('_')}
          </h2>
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
        <Button
          size={Size.small}
          onClick={() => {
            const samples: SampleInput[] = table.map(
              ({ code, ...item }, index) => ({
                ...unflatten<Value, SampleInput>(item),
                sampleCode: [...sampleCode, code ?? `${index + 1}`],
                attachments: [],
                labels: [],
                kind: 'sample',
                parent: id,
                userId,
              }),
            );
            createSamples({ variables: { samples } })
              .then(({ errors, data: res }) => {
                if (errors) {
                  setError(new Error(errors[0].message));
                } else if (!res) {
                  setError(new Error('Error during sample creation'));
                } else {
                  navigate({
                    pathname: `/sample/list/sample`,
                    search: new URLSearchParams({
                      'sampleCode.0.index': '0',
                      'sampleCode.0.value.value': sampleCode[0],
                      'sampleCode.0.value.operator': 'equals',
                    }).toString(),
                  });
                }
              })
              .catch(setError);
          }}
        >
          Send
        </Button>
      </div>
      <EditableTable
        prepend={`${sampleCode.join('_')}_`}
        rows={diameterRows ?? rows}
        columns={[
          { name: 'project', label: 'Project' },
          { name: 'comment', label: 'Comment' },
          { name: 'meta.purpose', label: 'Purpose' },
          { name: 'meta.heterostructure', label: 'EPI structure' },
        ]}
        onChange={(data) => setTable(data)}
        initialValue={{
          'meta.heterostructure': meta.heterostructure,
          project: project ?? '',
        }}
      />
    </div>
  );
}
MultiCreate.getLayout = (page: React.ReactNode) => (
  <ElnLayout>{page}</ElnLayout>
);
