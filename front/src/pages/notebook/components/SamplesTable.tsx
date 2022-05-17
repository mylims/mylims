import { InformationCircleIcon } from '@heroicons/react/outline';
import React from 'react';

import { LinkIcon } from '@/components/LinkButton';
import {
  Badge,
  BadgeVariant,
  Button,
  Color,
  Input,
  Select,
  Size,
  Variant,
} from '@/components/tailwind-ui';
import { useSampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

interface SamplesTableProps {
  samples: string[];
  addSample(sample: string): void;
}
export function SamplesTable({ samples, addSample }: SamplesTableProps) {
  const options: string[] = ['wafer', 'sample', 'dye', 'device'];
  return (
    <div>
      <div className="my-2 flex flex-row flex-wrap gap-4">
        <div className="text-xl font-semibold">Inventory</div>
        <div className="inline-flex">
          <Select
            options={options}
            label="Kind"
            hiddenLabel
            selected="wafer"
            className="w-28"
          />
          <Input
            name="test"
            label="test"
            hiddenLabel
            trailingAddon={
              <Button
                color={Color.neutral}
                variant={Variant.secondary}
                size={Size.xSmall}
                onClick={() => console.log('test')}
              >
                + Add
              </Button>
            }
          />
        </div>
      </div>
      <div className="divide-y divide-neutral-300 rounded-md border border-neutral-300">
        {samples.length > 0 ? (
          samples.map((sample) => <SampleItem sample={sample} key={sample} />)
        ) : (
          <div className="flex items-center p-4 text-sm text-neutral-400">
            No elements
          </div>
        )}
      </div>
    </div>
  );
}

interface SampleItemProps {
  sample: string;
}
function SampleItem({ sample }: SampleItemProps) {
  const { data, error, loading } = useSampleQuery({
    variables: { id: sample },
  });
  if (error)
    {return <div className="bg-danger-50 text-danger-700">{error.message}</div>;}
  if (loading) return <div>Loading...</div>;
  if (!data) return <div className="bg-danger-50 text-danger-700">No data</div>;

  const {
    sample: {
      sampleCode,
      createdAt,
      kind: { id: kind },
    },
  } = data;
  return (
    <div className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
      <div className="flex flex-row gap-4">
        <div className="text-sm">{sampleCode.join('_')}</div>
        <Badge
          variant={BadgeVariant.COLORED_BACKGROUND}
          label={kind}
          color={Color.primary}
        />
        <div className="text-xs text-neutral-400">{formatDate(createdAt)}</div>
      </div>
      <LinkIcon
        to={`/sample/detail/${kind}/${sample}`}
        title={`Detail of ${sampleCode.join('_')}`}
      >
        <InformationCircleIcon className="h-5 w-5" />
      </LinkIcon>
    </div>
  );
}
