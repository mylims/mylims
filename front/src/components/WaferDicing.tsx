import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wafer, fromTextToValue, WaferProps } from 'react-wafer';

import { SampleQuery } from '@/generated/graphql';

interface WaferDicingProps {
  diameter: string;
  sampleCode: string;
  sampleChildren: SampleQuery['sample']['children'];
  size: number;
}
interface SimpleWaferDicingProps {
  diameter: string;
  sampleCode: string;
  size: number;
  pickedItems?: WaferProps['pickedItems'];
  onSelect?: WaferProps['onSelect'];
}

export function SimpleWaferDicing({
  diameter,
  size,
  sampleCode,
  pickedItems = [],
  onSelect = () => {
    // do nothing
  },
}: SimpleWaferDicingProps) {
  if (/chip/i.test(diameter)) {
    return (
      <Wafer
        size={size}
        rows={3}
        columns={3}
        diameter={{ value: 3, units: 'cm' }}
        chipHeight={{ value: 2, units: 'cm' }}
        chipWidth={{ value: 1.8, units: 'cm' }}
        textStyle={{ fontSize: '0.7em' }}
        prepend="A"
        pickedItems={pickedItems}
        onSelect={onSelect}
      />
    );
  }
  try {
    const { value, units } = fromTextToValue(diameter);
    let rows: number | undefined;
    let columns: number | undefined;
    let borderError: number | undefined;
    if (value === 2) {
      rows = 4;
      columns = 4;
      borderError = 0.1;
    }
    if (value === 4) {
      columns = 7;
    }

    let overflow: number;
    switch (value) {
      case 2: {
        overflow = 4 - pickedItems.length;
        break;
      }
      case 4: {
        overflow = 16 - pickedItems.length;
        break;
      }
      case 6: {
        overflow = 38 - pickedItems.length;
        break;
      }
      default: {
        overflow = 0;
        break;
      }
    }

    return (
      <OverflowIndex index={overflow} sampleCode={sampleCode}>
        <Wafer
          size={size}
          rows={rows}
          columns={columns}
          borderError={borderError}
          diameter={{ value, units: units || 'inch' }}
          chipHeight={{ value: 2, units: 'cm' }}
          chipWidth={{ value: 1.8, units: 'cm' }}
          textStyle={{ fontSize: '0.7em' }}
          prepend="A"
          pickedItems={pickedItems}
          onSelect={onSelect}
        />
      </OverflowIndex>
    );
  } catch (e) {
    if (!diameter) {
      return (
        <div className="rounded-md bg-danger-100 p-3 text-danger-400">
          Missing diameter
        </div>
      );
    }
    return (
      <div className="rounded-md bg-danger-100 p-3 text-danger-400">
        Unknown diameter template for{' '}
        <span className="font-bold">{diameter}</span>
      </div>
    );
  }
}
export default function WaferDicing({
  size,
  diameter,
  sampleCode,
  sampleChildren,
}: WaferDicingProps) {
  const navigate = useNavigate();
  return (
    <SimpleWaferDicing
      size={size}
      diameter={diameter}
      sampleCode={sampleCode}
      pickedItems={
        sampleChildren
          ?.filter(({ meta: { reserved } }) => !!reserved)
          .map(({ sampleCode }) => ({
            index: sampleCode[1],
          })) ?? []
      }
      onSelect={(_, label, picked) => {
        if (picked) {
          const child = sampleChildren?.find(
            ({ sampleCode }) => sampleCode[1] === label,
          );
          if (child) {
            navigate(`/sample/detail/sample/${child.id}`);
          }
        }
      }}
    />
  );
}

interface OverflowIndexProps {
  index: number;
  sampleCode: string;
  children: JSX.Element;
}
function OverflowIndex({ children, index, sampleCode }: OverflowIndexProps) {
  if (index >= 0) return children;
  return (
    <div className="relative pt-4 pl-4">
      {children}
      <Link
        className="absolute top-0 left-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-danger-600 text-white"
        title="View all samples"
        to={{
          pathname: '/sample/list/sample',
          search: new URLSearchParams({
            'sampleCode.0.index': '0',
            'sampleCode.0.value.value': sampleCode,
            'sampleCode.0.value.operator': 'equals',
          }).toString(),
        }}
      >
        +{-index}
      </Link>
    </div>
  );
}
