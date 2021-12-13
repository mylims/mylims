import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import BaseDetail from '@/pages/samples/detail/Default';

export default function SampleDetail() {
  return (
    <BaseDetail>
      {(sample) => (
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
        </div>
      )}
    </BaseDetail>
  );
}

SampleDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Sample detail">{page}</ElnLayout>;
};
