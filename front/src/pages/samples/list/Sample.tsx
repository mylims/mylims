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
  Badge,
  BadgeVariant,
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

export default function SampleList() {
  const [state, setState] = useState<Sample | null>(null);

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList
          kind="sample"
          levels={sampleLevelsList.slice(0, 2)}
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
            disableSort
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
                to={`/sample/detail/sample/${state.id}`}
                className="flex space-x-2"
              >
                <InformationCircleIcon className="h-5 w-5" />
                <span>Detail</span>
              </LinkButton>
              <LinkButton
                title="update"
                to={`/sample/update/sample/${state.id}`}
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
              {state.meta.reserved ? (
                <Badge
                  label="Reserved"
                  color={Color.success}
                  variant={BadgeVariant.COLORED_BACKGROUND}
                  dot
                />
              ) : (
                <Badge
                  label="Not reserved"
                  color={Color.danger}
                  variant={BadgeVariant.COLORED_BACKGROUND}
                  dot
                />
              )}
              <FieldDescription title="Wafer name">
                {state.sampleCode[0]}
              </FieldDescription>
              <FieldDescription title="Sample name">
                {state.sampleCode[1]}
              </FieldDescription>
              <FieldDescription title="Project">
                {state.project ?? '-'}
              </FieldDescription>
              <FieldDescription title="Purpose">
                {state.meta.purpose ?? '-'}
              </FieldDescription>
              {state.meta.labelPurpose ? (
                <FieldDescription title="Label purpose">
                  {state.meta.labelPurpose}
                </FieldDescription>
              ) : null}
              <FieldDescription title="Description">
                {state.description ?? '-'}
              </FieldDescription>
              <FieldDescription title="EPI structure">
                {state.meta.heterostructure ?? '-'}
              </FieldDescription>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}

SampleList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
