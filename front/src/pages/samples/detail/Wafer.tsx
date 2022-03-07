import React from 'react';
import { Link } from 'react-router-dom';

import { API_URL } from '@/../env';
import AttachmentsTable from '@/components/AttachmentsTable';
import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { RichTextSerializer } from '@/components/RichTextSerializer';
import WaferDicing from '@/components/WaferDicing';
import { Button, Variant, Color, Size } from '@/components/tailwind-ui';
import { Sample } from '@/generated/graphql';
import SampleDetail from '@/pages/samples/detail/Default';
import { formatDate } from '@/utils/formatFields';

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
                {sample.sampleCode[0]}
              </FieldDescription>
              <FieldDescription title="Creation date">
                {formatDate(sample.createdAt)}
              </FieldDescription>
              <FieldDescription title="Project">
                {sample.project ?? '-'}
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
                {sample.meta.heterostructure ?? '-'}
              </FieldDescription>
              <FieldDescription title="Substrate">
                {sample.meta.substrate ?? '-'}
              </FieldDescription>
              <FieldDescription title="Supplier">
                {sample.meta.supplier ?? '-'}
              </FieldDescription>
              <FieldDescription title="Supplier wafer number">
                {sample.meta.supplierWaferNumber ?? '-'}
              </FieldDescription>
              <FieldDescription title="Place of growth">
                {sample.meta.placeOfGrowth ?? '-'}
              </FieldDescription>
              <FieldDescription title="Location">
                {sample.meta.location ?? '-'}
              </FieldDescription>
              {sample.meta.locationComment ? (
                <FieldDescription title="Location comment">
                  {sample.meta.locationComment}
                </FieldDescription>
              ) : null}

              {sample.meta.rs ? (
                <FieldDescription title="Rs (Ohm/sq)">
                  {sample.meta.rs}
                </FieldDescription>
              ) : null}
              {sample.meta.ns ? (
                <FieldDescription title="Ns (e13/cm^2)">
                  {sample.meta.ns.toFixed(4)}
                </FieldDescription>
              ) : null}
              {sample.meta.mobility ? (
                <FieldDescription title="Mobility (cm^2/Vs)">
                  {sample.meta.mobility}
                </FieldDescription>
              ) : null}
            </div>
          </div>
          <div className="col-span-2">
            <div className="text-xl font-semibold">Attachments</div>
            <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
              <AttachmentsTable attachments={sample.attachments} />
            </div>
          </div>
          <div className="row-span-2">
            <div className="flex flex-row gap-4">
              <div className="text-xl font-semibold">Samples</div>
              {!sample.children || sample.children.length === 0 ? (
                <Link to={`/sample/multiCreate/sample?parent=${sample.id}`}>
                  <Button
                    className="mb-4"
                    variant={Variant.secondary}
                    color={Color.success}
                    size={Size.small}
                  >
                    + Add samples
                  </Button>
                </Link>
              ) : null}
            </div>
            <div className="text-neutral-500">{sample.meta.size} diameter</div>
            <WaferDicing size={350} wafer={sample as Sample} />
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
