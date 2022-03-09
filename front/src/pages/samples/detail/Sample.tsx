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
        <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
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
            <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
              <AttachmentsTable attachments={sample.attachments} />
            </div>
          </div>
          <div className="row-span-2">
            {sample.description ? (
              <div className="mt-2">
                <div className="text-xl font-semibold">Description</div>
                <RichTextSerializer
                  className="max-h-full max-w-full overflow-auto rounded-md border border-neutral-300 px-3 py-2 shadow-sm ring-1 ring-neutral-300 md:max-w-xl"
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
