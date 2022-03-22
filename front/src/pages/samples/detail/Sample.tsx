import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { Badge, Color, BadgeVariant } from '@/components/tailwind-ui';
import BaseDetail from '@/pages/samples/detail/Default';

export default function SampleDetail() {
  return (
    <BaseDetail
      kind="sample"
      metaGrid={(sample) => (
        <>
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
        </>
      )}
    />
  );
}

SampleDetail.getLayout = (page: React.ReactNode) => {
  return (
    <ElnLayout pageTitle="Sample detail" maxWidth="max-w-screen-2xl">
      {page}
    </ElnLayout>
  );
};
