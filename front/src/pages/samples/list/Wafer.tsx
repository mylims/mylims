import {
  EyeIcon,
  FolderOpenIcon,
  InformationCircleIcon,
  PencilIcon,
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
        <SamplesList
          kind="wafer"
          levels={['wafer']}
          action={
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
                  <EyeIcon className="h-5 w-5" />
                </Button>
              )}
            </TableQuery.ActionsColumn>
          }
        >
          <TableQuery.TextColumn
            title="Taken samples"
            dataPath="children"
            disableSearch
          >
            {(row) => {
              const { children } = row as Sample;
              if (!children) return '0 / ?';
              const size = children.reduce(
                (acc, { meta }) => (acc + meta.reserved ? 1 : 0),
                0,
              );
              return `${size} / ${children.length}`;
            }}
          </TableQuery.TextColumn>
          <TableQuery.TextColumn
            title="EPI structure"
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
            title="location"
            dataPath="meta.location"
            disableSearch
          />
        </SamplesList>
      </div>
      <div>
        <Link to="/sample/singleCreate/wafer">
          <Button
            className="mb-4"
            variant={Variant.secondary}
            color={Color.success}
            size={Size.small}
          >
            + New wafer
          </Button>
        </Link>

        <Card>
          <Card.Header className="flex flex-row justify-between bg-neutral-50 text-neutral-500">
            <span className="text-left text-xs font-semibold uppercase tracking-wider">
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
                <div className="mb-2 w-full">
                  <ResponsiveChart minHeight={30}>
                    {({ width }) => (
                      <WaferDicing
                        size={width}
                        diameter={state.meta.size}
                        sampleChildren={state.children}
                      />
                    )}
                  </ResponsiveChart>
                </div>
                <div className="grid grid-cols-2 gap-4 ">
                  <Link title="detail" to={`/sample/detail/wafer/${state.id}`}>
                    <Button
                      className="flex space-x-2"
                      color={Color.primary}
                      variant={Variant.secondary}
                    >
                      <InformationCircleIcon className="h-5 w-5" />
                      <span>Detail</span>
                    </Button>
                  </Link>
                  <Link title="update" to={`/sample/update/wafer/${state.id}`}>
                    <Button
                      className="flex space-x-2"
                      color={Color.primary}
                      variant={Variant.secondary}
                    >
                      <PencilIcon className="h-5 w-5" />
                      <span>Update</span>
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
                        <FolderOpenIcon className="h-5 w-5" />
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
                  <FieldDescription title="Comment">
                    {state.comment ?? '-'}
                  </FieldDescription>
                  <FieldDescription title="EPI structure">
                    {state.meta.heterostructure ?? '-'}
                  </FieldDescription>
                  <FieldDescription title="Substrate">
                    {state.meta.substrate ?? '-'}
                  </FieldDescription>
                  {state.meta.rs ? (
                    <FieldDescription title="Rs (Ohm/sq)">
                      {state.meta.rs}
                    </FieldDescription>
                  ) : null}
                  {state.meta.ns ? (
                    <FieldDescription title="Ns (e13/cm^2)">
                      {state.meta.ns.toFixed(4)}
                    </FieldDescription>
                  ) : null}
                  {state.meta.mobility ? (
                    <FieldDescription title="Mobility (cm^2/Vs)">
                      {state.meta.mobility}
                    </FieldDescription>
                  ) : null}
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
