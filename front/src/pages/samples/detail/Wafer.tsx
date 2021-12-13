import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import WaferDicing from '@/components/WaferDicing';
import { Sample } from '@/generated/graphql';
import SampleDetail from '@/pages/samples/detail/Default';

export default function WaferDetail() {
  return (
    <SampleDetail>
      {(sample) => (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: '350px 1fr' }}
        >
          <div>
            <WaferDicing size={350} wafer={sample as Sample} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <FieldDescription title="Name">
              {sample.sampleCode.join('_')}
            </FieldDescription>
            <FieldDescription title="Project">
              {sample.project ?? '-'}
            </FieldDescription>
            <FieldDescription title="Purpose">
              {sample.meta.purpose ?? '-'}
            </FieldDescription>
            <FieldDescription title="Description">
              {sample.description ?? '-'}
            </FieldDescription>
            <FieldDescription title="Heterostructure">
              {sample.meta.heterostructure ?? '-'}
            </FieldDescription>
            <FieldDescription title="Substrate">
              {sample.meta.substrate ?? '-'}
            </FieldDescription>
          </div>
        </div>
      )}
    </SampleDetail>
  );
}

WaferDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Wafer detail">{page}</ElnLayout>;
};
