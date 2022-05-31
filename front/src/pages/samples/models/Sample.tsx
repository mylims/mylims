import React from 'react';
import { boolean } from 'yup';

import {
  InputFieldRHF,
  optionalString,
  ToggleFieldRHF,
} from '@/components/tailwind-ui';
import { SampleQuery } from '@/generated/graphql';

import { BaseSample } from './BaseSample';

export class Sample implements BaseSample {
  public codeLength = 2;
  public updateSchema = {
    purpose: optionalString(),
    labelPurpose: optionalString(),
    reserved: boolean(),
    heterostructure: optionalString(),
  };
  public updateForm = (
    <>
      <InputFieldRHF name="project" label="Project" />
      <InputFieldRHF name="meta.purpose" label="Purpose" />
      <ToggleFieldRHF name="meta.reserved" label="Reserved" />
      <InputFieldRHF name="meta.labelPurpose" label="Label purpose" />
      <InputFieldRHF name="meta.heterostructure" label="EPI structure" />
    </>
  );
  public description(sample: SampleQuery['sample']) {
    return [
      {
        title: 'Reserved',
        description: sample.meta.reserved,
        hide: true,
        type: 'boolean' as const,
      },
      { title: 'Project', description: sample.project },
      { title: 'Purpose', description: sample.meta.purpose },
      {
        title: 'Label purpose',
        description: sample.meta.labelPurpose,
        hide: true,
      },
      { title: 'EPI structure', description: sample.meta.heterostructure },
    ];
  }
}
