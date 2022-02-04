import {
  ChipIcon,
  EyeIcon,
  InformationCircleIcon,
} from '@heroicons/react/outline';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { Table as TableQuery } from '@/components/TableQuery';
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

export default function DyeList() {
  const [state, setState] = useState<Sample | null>(null);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList
          kind="dye"
          levels={['wafer', 'sample', 'dye']}
          action={
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
                  <EyeIcon className="h-5 w-5" />
                </Button>
              )}
            </TableQuery.ActionsColumn>
          }
        >
          <TableQuery.TextColumn
            title="heterostructure"
            dataPath="meta.heterostructure"
            disableSearch
          />
        </SamplesList>
      </div>
      <div>
        <Link to="/sample/form/dye">
          <Button
            className="mb-4"
            variant={Variant.secondary}
            color={Color.success}
            size={Size.small}
          >
            + New dye
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
              <div className="grid grid-cols-2 gap-4">
                <Link title="detail" to={`../../detail/dye/${state.id}`}>
                  <Button
                    className="flex space-x-2"
                    color={Color.primary}
                    variant={Variant.secondary}
                  >
                    <InformationCircleIcon className="h-5 w-5" />
                    <span>Detail</span>
                  </Button>
                </Link>
                {state.parent && (
                  <Link
                    title="detail"
                    to={`../../detail/wafer/${state.parent.id}`}
                  >
                    <Button
                      className="flex space-x-2"
                      color={Color.primary}
                      variant={Variant.secondary}
                    >
                      <ChipIcon className="h-5 w-5" />
                      <span>Wafer</span>
                    </Button>
                  </Link>
                )}

                <FieldDescription title="Wafer name">
                  {state.sampleCode[0]}
                </FieldDescription>
                <FieldDescription title="Sample name">
                  {state.sampleCode[1]}
                </FieldDescription>
                <FieldDescription title="Dye name">
                  {state.sampleCode[2]}
                </FieldDescription>
                <FieldDescription title="Description">
                  {state.description ?? '-'}
                </FieldDescription>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

DyeList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
