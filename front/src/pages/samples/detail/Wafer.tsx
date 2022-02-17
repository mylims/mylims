import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import WaferDicing from '@/components/WaferDicing';
import { Sample } from '@/generated/graphql';
import SampleDetail from '@/pages/samples/detail/Default';
import { RichTextSerializer } from '@/components/RichTextSerializer';

export default function WaferDetail() {
  return (
    <SampleDetail>
      {(sample) => (
        <div className="my-2 flex flex-col md:grid md:grid-flow-col md:grid-rows-2 md:gap-4">
          <div className="col-span-2">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              }}
            >
              <FieldDescription title="Wafer name">
                {sample.sampleCode.join('_')}
              </FieldDescription>
              <FieldDescription title="Project">
                {sample.project ?? '-'}
              </FieldDescription>
              <FieldDescription title="Title">
                {sample.title ?? '-'}
              </FieldDescription>
              <FieldDescription title="Comment">
                {sample.comment ?? '-'}
              </FieldDescription>
              <FieldDescription title="Labels">
                {sample.labels.join(', ') || '-'}
              </FieldDescription>
              <FieldDescription title="Purpose">
                {sample.meta.purpose ?? '-'}
              </FieldDescription>
              <FieldDescription title="EPI structure">
                {sample.meta.epiStructure ?? '-'}
              </FieldDescription>
              <FieldDescription title="Substrate">
                {sample.meta.substrate ?? '-'}
              </FieldDescription>
              <FieldDescription title="Supplier">
                {sample.meta.supplier ?? '-'}
              </FieldDescription>
              <FieldDescription title="Supplier wafer number">
                {sample.meta.supplierNumber ?? '-'}
              </FieldDescription>
              <FieldDescription title="Location">
                {sample.meta.location ?? '-'}
              </FieldDescription>
            </div>
          </div>
          <div className="row-span-2">
            <div className="text-xl font-semibold">Samples</div>
            <div className="text-neutral-500">{sample.meta.size} diameter</div>
            <WaferDicing size={350} wafer={sample as Sample} />
            <div className="mt-2">
              <div className="text-xl font-semibold">Description</div>
              <RichTextSerializer
                className="max-w-7xl rounded-md border border-neutral-300 px-3 py-2 shadow-sm ring-1 ring-neutral-300"
                value={sample.description ?? []}
              />
            </div>
          </div>
        </div>
      )}
    </SampleDetail>
  );
}

WaferDetail.getLayout = (page: React.ReactNode) => {
  return (
    <ElnLayout pageTitle="Wafer detail" maxWidth="max-w-screen-2xl">
      {page}
    </ElnLayout>
  );
};
