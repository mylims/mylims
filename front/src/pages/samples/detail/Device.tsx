import React from 'react';

import AttachmentsTable from '@/components/AttachmentsTable';
import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import BaseDetail from '@/pages/samples/detail/Default';
import { formatDate } from '@/utils/formatFields';

export default function DeviceDetail() {
  return (
    <BaseDetail>
      {(sample) => (
        <div>
          <div className="grid grid-cols-3 gap-4">
            <FieldDescription title="Device name">
              {sample.sampleCode.join('_')}
            </FieldDescription>
            <FieldDescription title="Creation date">
              {formatDate(sample.createdAt)}
            </FieldDescription>
            <FieldDescription title="Comment">
              {sample.comment ?? '-'}
            </FieldDescription>
          </div>
          <div>
            <div className="text-xl font-semibold">Attachments</div>
            <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
              <AttachmentsTable attachments={sample.attachments} />
            </div>
          </div>
        </div>
      )}
    </BaseDetail>
  );
}

DeviceDetail.getLayout = (page: React.ReactNode) => {
  return (
    <ElnLayout pageTitle="Device detail" maxWidth="max-w-screen-2xl">
      {page}
    </ElnLayout>
  );
};
