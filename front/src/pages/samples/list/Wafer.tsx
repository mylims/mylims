import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, InformationCircleIcon } from '@heroicons/react/outline';

import {
  Button,
  Card,
  Color,
  Roundness,
  Variant,
} from '@/components/tailwind-ui';
import { Table as TableQuery } from '@/components/TableQuery';
import ElnLayout from '@/components/ElnLayout';

import SamplesList from './Default';
import FieldDescription from '@/components/FieldDescription';
import { Sample } from '@/generated/graphql';

export default function WaferList() {
  const [state, setState] = useState<Sample | null>(null);
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList kind="wafer">
          <TableQuery.TextColumn
            title="heterostructure"
            dataPath="meta.heterostructure"
            disableSearch
          />
          <TableQuery.TextColumn
            title="substrate"
            dataPath="meta.substrate"
            disableSearch
          />
          <TableQuery.TextColumn
            title="size"
            dataPath="meta.size"
            disableSearch
          />
          <TableQuery.TextColumn
            title="ICMP"
            dataPath="meta.ICMP"
            disableSearch
          />
          <TableQuery.ActionsColumn>
            {(row) => (
              <>
                <Link title="detail" to={`/sample/detail/wafer/${row.id}`}>
                  <Button
                    color={Color.primary}
                    roundness={Roundness.circular}
                    variant={Variant.secondary}
                    className="ml-2"
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                  </Button>
                </Link>
                <Button
                  title="preview"
                  color={Color.success}
                  roundness={Roundness.circular}
                  variant={
                    row.id === state?.id ? Variant.primary : Variant.secondary
                  }
                  className="ml-2"
                  onClick={() => setState(row as Sample)}
                >
                  <EyeIcon className="w-5 h-5" />
                </Button>
              </>
            )}
          </TableQuery.ActionsColumn>
        </SamplesList>
      </div>
      <div>
        <Button
          className="mb-4"
          variant={Variant.secondary}
          color={Color.success}
        >
          + New wafer
        </Button>

        <Card>
          <Card.Header className="text-xs font-semibold tracking-wider text-left uppercase bg-neutral-50 text-neutral-500">
            Preview
          </Card.Header>
          <Card.Body>
            {!state ? (
              <p className="text-center text-neutral-500">
                Select a wafer to preview
              </p>
            ) : (
              <div>
                <div>Preview wafer derivations</div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldDescription title="Name">
                    {state.sampleCode.join('_')}
                  </FieldDescription>
                  <FieldDescription title="Project">
                    {state.project ?? '-'}
                  </FieldDescription>
                  <FieldDescription title="Title">
                    {state.title ?? '-'}
                  </FieldDescription>
                  <FieldDescription title="Description">
                    {state.title ?? '-'}
                  </FieldDescription>
                  <FieldDescription title="Derivations">
                    {state.children?.length ?? 0}
                  </FieldDescription>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

WaferList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
