import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import BaseDetail from '@/pages/samples/detail/Default';

export default function DyeDetail() {
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

DyeDetail.getLayout = (page: React.ReactNode) => {
  return (
    <ElnLayout pageTitle="Dye detail" maxWidth="max-w-screen-2xl">
      {page}
    </ElnLayout>
  );
};
