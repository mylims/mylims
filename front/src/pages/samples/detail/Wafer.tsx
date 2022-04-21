import React from 'react';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { LinkButton } from '@/components/LinkButton';
import WaferDicing from '@/components/WaferDicing';
import { Color } from '@/components/tailwind-ui';
import SampleDetail from '@/pages/samples/detail/Default';

export default function WaferDetail() {
  return (
    <SampleDetail
      kind="wafer"
      metaGrid={(sample) => (
        <>
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
        </>
      )}
      formEditor={(sample) => (
        <>
          <div className="flex flex-row gap-4">
            <div className="text-xl font-semibold">Samples</div>
            <LinkButton
              to={{
                pathname: '/sample/list/sample',
                search: new URLSearchParams({
                  'sampleCode.0.index': '0',
                  'sampleCode.0.value.value': sample.sampleCode[0],
                  'sampleCode.0.value.operator': 'equals',
                }).toString(),
              }}
              className="mb-4"
            >
              List of samples
            </LinkButton>
            {!sample.children || sample.children.length === 0 ? (
              <LinkButton
                to={`/sample/multiCreate/sample?parent=${sample.id}`}
                className="mb-4"
                color={Color.success}
              >
                + Add multiple samples
              </LinkButton>
            ) : null}
            <LinkButton
              to={`/sample/create/sample/${sample.id}`}
              className="mb-4"
              color={Color.success}
            >
              + Add sample
            </LinkButton>
          </div>
          {sample.meta.size ? (
            <div className="text-neutral-500">{sample.meta.size} diameter</div>
          ) : null}
          <WaferDicing
            size={350}
            diameter={sample.meta.size}
            sampleChildren={sample.children}
            sampleCode={sample.sampleCode[0]}
          />
        </>
      )}
    />
  );
}

WaferDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout maxWidth="max-w-screen-2xl">{page}</ElnLayout>;
};
