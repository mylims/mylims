import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wafer } from 'react-wafer';

import { Sample } from '@/generated/graphql';

interface WaferDicingProps {
  wafer: Sample;
  size: number;
}

const getNumber = (str?: string) => str?.replace(/\D/g, '') ?? '';
export default function WaferDicing({ wafer, size }: WaferDicingProps) {
  const navigate = useNavigate();
  return (
    <Wafer
      size={size}
      diameter={{ value: 300 }}
      chipHeight={{ value: 50 }}
      chipWidth={{ value: 30 }}
      pickedItems={
        wafer.children?.map(({ sampleCode }) => ({
          index: getNumber(sampleCode[1]),
        })) ?? []
      }
      onSelect={(_, label, picked) => {
        if (picked) {
          const child = wafer.children?.find(
            ({ sampleCode }) => getNumber(sampleCode[1]) === label,
          );
          if (child) {
            navigate(`/sample/detail/sample/${child.id}`);
          }
        }
      }}
    />
  );
}
