import React from 'react';

import { API_URL } from '@/../env';
import AttachmentsTable from '@/components/AttachmentsTable';
import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { RichTextSerializer } from '@/components/RichTextSerializer';
import { Badge, Color, BadgeVariant } from '@/components/tailwind-ui';
import BaseDetail from '@/pages/samples/detail/Default';

export default function SampleDetail() {
  return (
    <BaseDetail kind="sample">
      {(sample) => (
        <div className="flex flex-col my-2 md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
          <div className="col-span-2">
            <div className="grid grid-cols-3 gap-4">
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
              <FieldDescription title="EPI structure">
                {sample.meta.heterostructure ?? '-'}
              </FieldDescription>
              <FieldDescription title="Status">
                {sample.meta.sampleStatus ?? 'Unprocessed'}
              </FieldDescription>
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xl font-semibold">Attachments</div>
            <div className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
              <AttachmentsTable attachments={sample.attachments} />
            </div>
          </div>
          <div className="row-span-2">
            {sample.description ? (
              <div className="mt-2">
                <div className="text-xl font-semibold">Description</div>
                <RichTextSerializer
                  className="max-w-full max-h-full px-3 py-2 overflow-auto border rounded-md shadow-sm border-neutral-300 ring-1 ring-neutral-300 md:max-w-xl"
                  value={sample.description}
                  fetchImage={(uuid) => `${API_URL}/files/fetchImage/${uuid}`}
                />
              </div>
            ) : null}
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
