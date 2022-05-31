import React from 'react'

import { optionalString, InputFieldRHF } from '@/components/tailwind-ui';
import { SampleQuery } from '@/generated/graphql';

import { BaseSample } from './BaseSample';

export class Dye implements BaseSample {
  public codeLength = 3;
  public updateSchema = { comment: optionalString() };
  public updateForm = (<InputFieldRHF name="meta.comment" label="Comment" />);
  public description(sample: SampleQuery['sample']) {
    return [{ title: 'Comment', description: sample.comment }];
  }
}
