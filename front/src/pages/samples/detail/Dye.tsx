import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import BaseDetail from '@/pages/samples/detail/Default';

export default function DyeDetail() {
  return (
    <BaseDetail
      kind="dye"
      metaGrid={(sample) => (
        <FieldDescription title="Comment">
          {sample.comment ?? '-'}
        </FieldDescription>
      )}
    />
  );
}

DyeDetail.getLayout = (page: React.ReactNode) => {
  return (
    <ElnLayout pageTitle="Dye detail" maxWidth="max-w-screen-2xl">
      {page}
    </ElnLayout>
  );
};
