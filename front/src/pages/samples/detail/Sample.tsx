import React from 'react';

import AttachmentsTable from '@/components/AttachmentsTable';
import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { Badge, Color, BadgeVariant } from '@/components/tailwind-ui';
import BaseDetail from '@/pages/samples/detail/Default';
import { formatDate } from '@/utils/formatFields';

export default function SampleDetail() {
  return (
    <BaseDetail>
      {(sample) => (
        <div>
          <div className="grid grid-cols-3 gap-4">
            <FieldDescription title="Sample name">
              {sample.sampleCode.join('_')}
            </FieldDescription>
            <FieldDescription title="Creation date">
              {formatDate(sample.createdAt)}
            </FieldDescription>
            {sample.meta.reserved ? (
              <Badge
                label="Reserved"
                color={Color.success}
                variant={BadgeVariant.COLORED_BACKGROUND}
                dot
              />
            ) : (
              <Badge
                label="Not reserved"
                color={Color.danger}
                variant={BadgeVariant.COLORED_BACKGROUND}
                dot
              />
            )}
            <FieldDescription title="Project">
              {sample.project ?? '-'}
            </FieldDescription>
            <FieldDescription title="Purpose">
              {sample.meta.purpose ?? '-'}
            </FieldDescription>
            {sample.meta.labelPurpose ? (
              <FieldDescription title="Label purpose">
                {sample.meta.labelPurpose}
              </FieldDescription>
            ) : null}
            <FieldDescription title="Description">
              {sample.description ?? '-'}
            </FieldDescription>
            <FieldDescription title="EPI structure">
              {sample.meta.heterostructure ?? '-'}
            </FieldDescription>
            <FieldDescription title="Status">
              {sample.meta.sampleStatus ?? 'Unprocessed'}
            </FieldDescription>
          </div>
          <div>
            <div className="text-xl font-semibold">Attachments</div>
            <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <AttachmentsTable attachments={sample.attachments} />
            </div>
          </div>
        </div>
      )}
    </BaseDetail>
  );
}

SampleDetail.getLayout = (page: React.ReactNode) => {
  return (
    <ElnLayout pageTitle="Sample detail" maxWidth="max-w-screen-2xl">
      {page}
    </ElnLayout>
  );
};
