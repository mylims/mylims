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
  return (
    <Wafer
      size={size}
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
