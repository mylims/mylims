import {
  EyeIcon,
  FolderOpenIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import React, { useState } from 'react';
import { ResponsiveChart } from 'react-d3-utils';
import { Link } from 'react-router-dom';


import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { Table as TableQuery } from '@/components/TableQuery';
import WaferDicing from '@/components/WaferDicing';
import {
  Button,
  Card,
  Color,
  Roundness,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import { Sample } from '@/generated/graphql';

import SamplesList from './Default';

export default function WaferList() {
  const [state, setState] = useState<Sample | null>(null);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList kind="wafer" levels={['wafer']}>
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
              <Button
                title="preview"
                color={Color.success}
                roundness={Roundness.circular}
                size={Size.small}
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
          + New wafer
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
              <div>
                <div className="w-full mb-2">
                  <ResponsiveChart minHeight={30}>
                    {({ width }) => <WaferDicing size={width} wafer={state} />}
                  </ResponsiveChart>
                </div>
                <div className="grid grid-cols-2 gap-4 ">
                  <Link title="detail" to={`/sample/detail/wafer/${state.id}`}>
                    <Button
                      className="flex space-x-2"
                      color={Color.primary}
                      variant={Variant.secondary}
                    >
                      <InformationCircleIcon className="w-5 h-5" />
                      <span>Detail</span>
                    </Button>
                  </Link>
                  {state.children && (
                    <Link
                      title="detail"
                      to={{
                        pathname: '/sample/list/sample',
                        search: new URLSearchParams({
                          'sampleCode.0.index': '0',
                          'sampleCode.0.value.value': state.sampleCode[0],
                          'sampleCode.0.value.operator': 'equals',
                        }).toString(),
                      }}
                    >
                      <Button
                        className="flex space-x-2"
                        color={Color.primary}
                        variant={Variant.secondary}
                      >
                        <FolderOpenIcon className="w-5 h-5" />
                        <span>Samples</span>
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
                  <FieldDescription title="Substrate">
                    {state.meta.substrate ?? '-'}
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
