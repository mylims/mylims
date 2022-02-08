import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wafer, fromTextToValue } from 'react-wafer';

import { Sample } from '@/generated/graphql';

interface WaferDicingProps {
  wafer: Sample;
  size: number;
}

export default function WaferDicing({ wafer, size }: WaferDicingProps) {
  const navigate = useNavigate();
  const { value, units } = fromTextToValue(wafer.meta.size ?? '2 inch');
  let rows: number | undefined = undefined;
  let columns: number | undefined = undefined;
  let borderError: number | undefined = undefined;
  if (value === 2) {
    rows = 4;
    columns = 4;
    borderError = 0.1;
  }
  if (value === 4) {
    rows = 7;
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
      pickedItems={
        wafer.children?.map(({ sampleCode }) => ({
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
