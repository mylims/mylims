import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import BaseDetail from '@/pages/samples/detail/Default';

export default function DeviceDetail() {
  return (
    <BaseDetail>
      {(sample) => (
        <div className="grid grid-cols-3 gap-4">
          <FieldDescription title="Name">
            {sample.sampleCode.join('_')}
          </FieldDescription>
          <FieldDescription title="Description">
            {sample.description ?? '-'}
          </FieldDescription>
        </div>
      )}
    </BaseDetail>
  );
}

DeviceDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Device detail">{page}</ElnLayout>;
};
