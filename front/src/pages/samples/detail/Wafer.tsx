import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import SampleDetail from '@/pages/samples/detail/Default';
import React from 'react';
import { Wafer } from 'react-wafer';

export default function WaferDetail() {
  return (
    <SampleDetail>
      {(sample) => (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: '300px 1fr' }}
        >
          <div>
            <Wafer
              size={300}
              diameter={{ value: 300 }}
              chipHeight={{ value: 50 }}
              chipWidth={{ value: 30 }}
              pickedItems={
                sample.children?.map((_, i) => ({
                  index: String(i + 1),
                })) ?? []
              }
            />
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
