import React from 'react';
import { Wafer } from 'react-wafer';
import { useHistory } from 'react-router-dom';

import { Sample } from '@/generated/graphql';

interface WaferDicingProps {
  wafer: Sample;
  size: number;
}

const getNumber = (str?: string) => str?.replace(/\D/g, '') ?? '';
export default function WaferDicing({ wafer, size }: WaferDicingProps) {
  const history = useHistory();
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
            history.push(`/sample/detail/sample/${child.id}`);
          }
        }
      }}
    />
  );
}
