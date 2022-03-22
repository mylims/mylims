import React from 'react';
import { Link } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import WaferDicing from '@/components/WaferDicing';
import { Button, Variant, Color, Size } from '@/components/tailwind-ui';
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
            {!sample.children || sample.children.length === 0 ? (
              <Link to={`/sample/multiCreate/sample?parent=${sample.id}`}>
                <Button
                  className="mb-4"
                  variant={Variant.secondary}
                  color={Color.success}
                  size={Size.small}
                >
                  + Add multiple samples
                </Button>
              </Link>
            ) : null}
            <Link to={`/sample/singleCreate/sample/${sample.id}`}>
              <Button
                className="mb-4"
                variant={Variant.secondary}
                color={Color.success}
                size={Size.small}
              >
                + Add sample
              </Button>
            </Link>
          </div>
          {sample.meta.size ? (
            <div className="text-neutral-500">{sample.meta.size} diameter</div>
          ) : null}
          <WaferDicing
            size={350}
            diameter={sample.meta.size}
            sampleChildren={sample.children}
          />
        </>
      )}
    />
  );
}

WaferDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout maxWidth="max-w-screen-2xl">{page}</ElnLayout>;
};
