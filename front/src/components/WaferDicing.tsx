import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wafer, fromTextToValue, WaferProps } from 'react-wafer';

import { Sample } from '@/generated/graphql';

interface WaferDicingProps {
  wafer: Sample;
  size: number;
}
interface SimpleWaferDicingProps {
  diameter: string;
  size: number;
  pickedItems?: WaferProps['pickedItems'];
  onSelect?: WaferProps['onSelect'];
}

export function SimpleWaferDicing({
  diameter,
  size,
  pickedItems = [],
  onSelect = () => {
    // do nothing
  },
}: SimpleWaferDicingProps) {
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
    return (
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
    );
  } catch (e) {
    return (
      <div className="rounded-md bg-danger-100 p-3 text-danger-400">
        Unknown diameter template for{' '}
        <span className="font-bold">{diameter}</span>
      </div>
    );
  }
}
export default function WaferDicing({ wafer, size }: WaferDicingProps) {
  const navigate = useNavigate();
  return (
    <SimpleWaferDicing
      size={size}
      diameter={wafer.meta.size ?? '2 inch'}
      pickedItems={
        wafer.children
          ?.filter(({ meta: { reserved } }) => !!reserved)
          .map(({ sampleCode }) => ({
            index: sampleCode[1],
          })) ?? []
      }
      onSelect={(_, label, picked) => {
        if (picked) {
          const child = wafer.children?.find(
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
