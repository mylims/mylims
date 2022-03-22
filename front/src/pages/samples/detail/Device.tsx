import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import BaseDetail from '@/pages/samples/detail/Default';

export default function DeviceDetail() {
  return (
    <BaseDetail
      kind="device"
      metaGrid={(sample) => (
        <FieldDescription title="Comment">
          {sample.comment ?? '-'}
        </FieldDescription>
      )}
    />
  );
}

DeviceDetail.getLayout = (page: React.ReactNode) => {
  return (
    <ElnLayout pageTitle="Device detail" maxWidth="max-w-screen-2xl">
      {page}
    </ElnLayout>
  );
};
