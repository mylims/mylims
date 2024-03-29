import { Tab } from '@headlessui/react';
import {
  EyeIcon,
  FolderOpenIcon,
  InformationCircleIcon,
  PencilIcon,
} from '@heroicons/react/outline';
import { clsx } from 'clsx';
import React, { useMemo, useState } from 'react';
import { ResponsiveChart } from 'react-d3-utils';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import LexicalEditor from '@/components/LexicalEditor';
import { LinkButton } from '@/components/LinkButton';
import { PlotJcampMultiple } from '@/components/PlotJcamp/PlotJcampMultiple';
import { TableQuery } from '@/components/TableQuery';
import WaferDicing from '@/components/WaferDicing';
import {
  Alert,
  AlertType,
  Button,
  Card,
  Color,
  Roundness,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import { MeasurementTypes, Sample } from '@/generated/graphql';
import { useFetchFileDict } from '@/hooks/useFetchFile';
import { sampleLevelsList } from '@/models/sample';
import { XRayModel } from '@/pages/measurements/models/XRay';

import SamplesList from './Default';

const size = { width: 300, height: 250 };
const tabStyle = ({ selected }: { selected: boolean }) =>
  clsx(
    'mr-2 rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider',
    selected ? 'bg-neutral-400 text-white' : 'bg-neutral-50',
  );
export default function WaferList() {
  const [state, setState] = useState<Sample | null>(null);
  const { plotQuery } = XRayModel;
  const filesDict = useMemo(() => {
    let filesDict: Record<string, string> = {};
    if (!state) return filesDict;
    for (const { type, file } of state.measurements) {
      if (type === MeasurementTypes.XRAY && file) {
        filesDict[file.filename] = file.downloadUrl;
      }
    }
    return filesDict;
  }, [state]);
  const { data, error } = useFetchFileDict(filesDict);
  const measurements = useMemo(
    () => Object.values(data).filter((val): val is string => val !== null),
    [data],
  );

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList
          kind="wafer"
          levels={sampleLevelsList.slice(0, 1)}
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
            dataPath="availability"
            disableSearch
            disableSort={false}
          >
            {(row) => {
              const { children } = row as Sample;
              if (!children) return '0 / ?';
              const size = children.reduce(
                (acc, { meta }) => acc + (meta.reserved ? 1 : 0),
                0,
              );
              return `${size} / ${children.length}`;
            }}
          </TableQuery.TextColumn>
          <TableQuery.TextMetaColumn
            title="EPI structure"
            dataPath="heterostructure"
            disableSort
          />
          <TableQuery.TextColumn
            title="substrate"
            dataPath="meta.substrate"
            disableSort
          />
          <TableQuery.TextColumn
            title="size"
            dataPath="meta.size"
            disableSort
          />
          <TableQuery.TextColumn
            title="location"
            dataPath="meta.location"
            disableSort
          />
        </SamplesList>
      </div>
      <div>
        <LinkButton
          to="/sample/create/wafer"
          className="mb-4"
          color={Color.success}
        >
          + New wafer
        </LinkButton>
        <Tab.Group>
          <Card>
            <Card.Header className="flex flex-row justify-between bg-neutral-50 text-neutral-500">
              <Tab.List>
                <Tab className={tabStyle}>Details</Tab>
                <Tab className={tabStyle}>Samples</Tab>
                <Tab className={tabStyle}>X-ray</Tab>
              </Tab.List>
              {state ? (
                <LinkButton
                  title="detail"
                  to={`/sample/detail/wafer/${state.id}`}
                  className="flex space-x-2"
                >
                  <InformationCircleIcon className="h-5 w-5" />
                  <span>Detail</span>
                </LinkButton>
              ) : null}
            </Card.Header>
            <Card.Body>
              {!state ? (
                <p className="text-center text-neutral-500">
                  Select a wafer to preview
                </p>
              ) : (
                <div>
                  <Tab.Panels>
                    {/* Details */}
                    <Tab.Panel>
                      <div className="grid grid-cols-2 gap-4">
                        <LinkButton
                          title="update"
                          to={`/sample/update/wafer/${state.id}`}
                          className="flex space-x-2"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span>Update</span>
                        </LinkButton>
                        <FieldDescription title="Wafer name">
                          {state.sampleCode.join('_')}
                        </FieldDescription>
                        <FieldDescription title="Project">
                          {state.project ?? '-'}
                        </FieldDescription>
                        <FieldDescription title="Purpose">
                          {state.meta.purpose ?? '-'}
                        </FieldDescription>
                        <FieldDescription title="EPI structure">
                          {state.meta.heterostructure ?? '-'}
                        </FieldDescription>
                        <FieldDescription title="Substrate">
                          {state.meta.substrate ?? '-'}
                        </FieldDescription>
                        <FieldDescription title="Size">
                          {state.meta.size ?? '-'}
                        </FieldDescription>
                        <FieldDescription title="Location">
                          {state.meta.location ?? '-'}
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
                      <FieldDescription title="Comment">
                        {state.comment ?? '-'}
                      </FieldDescription>
                      {state.description ? (
                        <div className="mt-2">
                          <div className="text-xl font-semibold">
                            Description
                          </div>
                          <LexicalEditor
                            readOnly
                            value={state.description}
                            onChange={() => {
                              // empty
                            }}
                            samples={[]}
                            onSamplesChange={() => {
                              // empty
                            }}
                            measurements={[]}
                            onMeasurementsChange={() => {
                              // empty
                            }}
                          />
                        </div>
                      ) : (
                        <span className="text-center text-neutral-500">
                          No description added
                        </span>
                      )}
                    </Tab.Panel>

                    {/* Samples */}
                    <Tab.Panel>
                      <div className="mb-2 w-full">
                        <ResponsiveChart minHeight={30}>
                          {({ width }) => (
                            <WaferDicing
                              size={width}
                              diameter={state.meta.size}
                              sampleChildren={state.children}
                              sampleCode={state.sampleCode[0]}
                            />
                          )}
                        </ResponsiveChart>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FieldDescription title="Wafer name">
                          {state.sampleCode.join('_')}
                        </FieldDescription>
                        <LinkButton
                          title="update"
                          to={`/sample/update/wafer/${state.id}`}
                          className="flex space-x-2"
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span>Update</span>
                        </LinkButton>

                        {state.children && (
                          <LinkButton
                            title="detail"
                            to={{
                              pathname: '/sample/list/sample',
                              search: new URLSearchParams({
                                'sampleCode.0.index': '0',
                                'sampleCode.0.value.value': state.sampleCode[0],
                                'sampleCode.0.value.operator': 'equals',
                              }).toString(),
                            }}
                            className="flex space-x-2"
                          >
                            <FolderOpenIcon className="h-5 w-5" />
                            <span>Samples</span>
                          </LinkButton>
                        )}
                        <LinkButton
                          to={`/sample/create/sample/${state.id}`}
                          className="mb-4"
                          color={Color.success}
                        >
                          + Add sample
                        </LinkButton>
                      </div>
                    </Tab.Panel>

                    {/* X-ray */}
                    <Tab.Panel>
                      <div className="mb-2 w-full">
                        {error.length > 0 ? (
                          <Alert title={'Error'} type={AlertType.ERROR}>
                            <p>Unexpected errors:</p>
                            {error.map((err) => (
                              <p key={err.name}>{err.message}</p>
                            ))}
                          </Alert>
                        ) : state.measurements.length > 0 ? (
                          <PlotJcampMultiple
                            content={measurements}
                            query={plotQuery}
                            size={size}
                          />
                        ) : (
                          <p className="text-center text-neutral-500">
                            No measurements added
                          </p>
                        )}
                      </div>
                    </Tab.Panel>
                  </Tab.Panels>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab.Group>
      </div>
    </div>
  );
}

WaferList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
