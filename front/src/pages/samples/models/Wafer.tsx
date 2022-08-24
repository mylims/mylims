import React from 'react';

import { LinkButton } from '@/components/LinkButton';
import MultiSelect from '@/components/MultiSelect';
import WaferDicing from '@/components/WaferDicing';
import {
  Color,
  InputFieldRHF,
  optionalNumber,
  optionalString,
} from '@/components/tailwind-ui';
import { SampleQuery } from '@/generated/graphql';

import { BaseSample } from './BaseSample';

export const baseForm = (
  <>
    <InputFieldRHF name="project" label="Project" />
    <InputFieldRHF name="comment" label="Comment" />
    <MultiSelect name="labels" label="Labels" />
    <InputFieldRHF name="meta.purpose" label="Purpose" />
    <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
    <InputFieldRHF name="meta.substrate" label="Substrate" />
    <InputFieldRHF name="meta.supplier" label="Supplier" />
    <InputFieldRHF
      name="meta.supplierWaferNumber"
      label="Supplier wafer number"
    />
    <InputFieldRHF name="meta.placeOfGrowth" label="Place of growth" />
    <InputFieldRHF name="meta.location" label="Location" />
    <InputFieldRHF name="meta.locationComment" label="Location comment" />
    <InputFieldRHF name="meta.rs" label="Rs (Ohm/sq)" type="number" />
    <InputFieldRHF name="meta.ns" label="Ns (e13/cm^2)" type="number" />
    <InputFieldRHF
      name="meta.mobility"
      label="Mobility (cm^2/Vs)"
      type="number"
    />
  </>
);
export const baseSchema = {
  purpose: optionalString(),
  heterostructure: optionalString(),
  substrate: optionalString(),
  supplier: optionalString(),
  supplierWaferNumber: optionalString(),
  placeOfGrowth: optionalString(),
  location: optionalString(),
  locationComment: optionalString(),
  rs: optionalNumber(),
  ns: optionalNumber(),
  mobility: optionalNumber(),
};

export class Wafer implements BaseSample {
  public codeLength = 1;
  public updateSchema = {
    size: optionalString(),
    ...baseSchema,
  };
  public updateForm = (
    <>
      <InputFieldRHF name="sampleCode.0" label="Wafer name" disabled />
      <InputFieldRHF name="meta.size" label="Diameter" disabled />
      {baseForm}
    </>
  );
  public description(sample: SampleQuery['sample']) {
    return [
      { title: 'Project', description: sample.project },
      { title: 'Comment', description: sample.comment },
      { title: 'Labels', description: sample.labels.join(', ') },
      { title: 'Purpose', description: sample.meta.purpose },
      { title: 'EPI structure', description: sample.meta.heterostructure },
      { title: 'Substrate', description: sample.meta.substrate },
      { title: 'Supplier', description: sample.meta.supplier },
      {
        title: 'Supplier wafer number',
        description: sample.meta.supplierWaferNumber,
      },
      { title: 'Place of growth', description: sample.meta.placeOfGrowth },
      { title: 'Location', description: sample.meta.location },
      {
        title: 'Location comment',
        description: sample.meta.locationComment,
        hide: true,
      },
      { title: 'Rs (Ohm/sq)', description: sample.meta.rs, hide: true },
      {
        title: 'Ns (e13/cm^2)',
        description: sample.meta.ns?.toFixed(4),
        hide: true,
      },
      {
        title: 'Mobility (cm^2/Vs)',
        description: sample.meta.mobility,
        hide: true,
      },
    ];
  }
  public actions(sample: SampleQuery['sample']) {
    return (
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
    );
  }
}
