import {
  ChipIcon,
  EyeIcon,
  InformationCircleIcon,
  PencilIcon,
} from '@heroicons/react/outline';
import React, { useState } from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { LinkButton } from '@/components/LinkButton';
import { TableQuery } from '@/components/TableQuery';
import {
  Button,
  Card,
  Color,
  Roundness,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import { Sample } from '@/generated/graphql';
import { sampleLevelsList } from '@/models/sample';

import SamplesList from './Default';

export default function DyeList() {
  const [state, setState] = useState<Sample | null>(null);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList
          kind="dye"
          levels={sampleLevelsList.slice(0, 3)}
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
            title="EPI structure"
            dataPath="meta.heterostructure"
            disableSearch
          />
        </SamplesList>
      </div>

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
              <LinkButton
                title="detail"
                to={`/sample/detail/dye/${state.id}`}
                className="flex space-x-2"
              >
                <InformationCircleIcon className="h-5 w-5" />
                <span>Detail</span>
              </LinkButton>
              <LinkButton
                title="update"
                to={`/sample/update/dye/${state.id}`}
                className="flex space-x-2"
              >
                <PencilIcon className="h-5 w-5" />
                <span>Update</span>
              </LinkButton>
              {state.parent && (
                <LinkButton
                  title="detail"
                  to={`../../detail/wafer/${state.parent.id}`}
                  className="flex space-x-2"
                >
                  <ChipIcon className="h-5 w-5" />
                  <span>Wafer</span>
                </LinkButton>
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
  );
}

DyeList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
