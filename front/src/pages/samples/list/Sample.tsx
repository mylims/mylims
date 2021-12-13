import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChipIcon,
  EyeIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';

import {
  Button,
  Card,
  Color,
  Roundness,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import { Table as TableQuery } from '@/components/TableQuery';
import ElnLayout from '@/components/ElnLayout';

import SamplesList from './Default';
import FieldDescription from '@/components/FieldDescription';
import { Sample } from '@/generated/graphql';

export default function SampleList() {
  const [state, setState] = useState<Sample | null>(null);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList kind="sample">
          <TableQuery.TextColumn
            title="heterostructure"
            dataPath="meta.heterostructure"
            disableSearch
          />
          <TableQuery.ActionsColumn>
            {(row) => (
              <Button
                title="preview"
                color={Color.success}
                roundness={Roundness.circular}
                size={Size.xSmall}
                variant={
                  row.id === state?.id ? Variant.primary : Variant.secondary
                }
                className="ml-2"
                onClick={() => setState(row as Sample)}
              >
                <EyeIcon className="w-5 h-5" />
              </Button>
            )}
          </TableQuery.ActionsColumn>
        </SamplesList>
      </div>
      <div>
        <Button
          className="mb-4"
          variant={Variant.secondary}
          color={Color.success}
          size={Size.small}
        >
          + New sample
        </Button>

        <Card>
          <Card.Header className="flex flex-row justify-between bg-neutral-50 text-neutral-500">
            <span className="text-xs font-semibold tracking-wider text-left uppercase">
              Preview
            </span>
          </Card.Header>
          <Card.Body>
            {!state ? (
              <p className="text-center text-neutral-500">
                Select a wafer to preview
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <Link title="detail" to={`/sample/detail/sample/${state.id}`}>
                  <Button
                    className="flex space-x-2"
                    color={Color.primary}
                    variant={Variant.secondary}
                  >
                    <InformationCircleIcon className="w-5 h-5" />
                    <span>Detail</span>
                  </Button>
                </Link>
                {state.parent && (
                  <Link
                    title="detail"
                    to={`/sample/detail/wafer/${state.parent.id}`}
                  >
                    <Button
                      className="flex space-x-2"
                      color={Color.primary}
                      variant={Variant.secondary}
                    >
                      <ChipIcon className="w-5 h-5" />
                      <span>Wafer</span>
                    </Button>
                  </Link>
                )}

                <FieldDescription title="Name">
                  {state.sampleCode.join('_')}
                </FieldDescription>
                <FieldDescription title="Project">
                  {state.project ?? '-'}
                </FieldDescription>
                <FieldDescription title="Purpose">
                  {state.meta.purpose ?? '-'}
                </FieldDescription>
                <FieldDescription title="Description">
                  {state.description ?? '-'}
                </FieldDescription>
                <FieldDescription title="Heterostructure">
                  {state.meta.heterostructure ?? '-'}
                </FieldDescription>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

SampleList.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Samples">{page}</ElnLayout>
);
