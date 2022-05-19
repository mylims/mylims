import { PaperClipIcon } from '@heroicons/react/outline';
import React, { useRef } from 'react';

import FieldDescription from '@/components/FieldDescription';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import LexicalEditor from '@/components/LexicalEditor';
import { SampleLinkRef } from '@/components/LexicalEditor/plugins/SampleLinkPlugin';
import MeasuresTable from '@/components/MeasuresTable';
import { RichTextImageFieldRHF } from '@/components/RichTextEditor/RichTextImageFieldRHF';
import {
  FormRHF,
  Card,
  InputFieldRHF,
  SubmitButtonRHF,
} from '@/components/tailwind-ui';
import { formatDate } from '@/utils/formatFields';

import { UpdateNotebook, StateNotebook } from '../models';

import SamplesTableRHF from './SamplesTableRHF';

interface NotebookFormProps {
  loading: boolean;
  initialValue: StateNotebook;
  onSubmit(data: StateNotebook): Promise<void>;
}
export function NotebookForm({
  loading,
  initialValue,
  onSubmit,
}: NotebookFormProps) {
  const sampleLinkRef = useRef<SampleLinkRef>(null);

  return (
    <FormRHF<StateNotebook> defaultValues={initialValue} onSubmit={onSubmit}>
      <Card>
        <Card.Header>
          <div className="flex flex-row justify-between">
            <InputFieldRHF
              name="title"
              label="Notebook title"
              className="uppercase"
            />
            <div className="flex flex-row gap-4">
              {(initialValue as UpdateNotebook).createdAt ? (
                <FieldDescription title="Created at">
                  {formatDate((initialValue as UpdateNotebook).createdAt)}
                </FieldDescription>
              ) : null}
              <SubmitButtonRHF disabled={loading} className="flex">
                <PaperClipIcon className="h-5 w-5" />
                <span>Save</span>
              </SubmitButtonRHF>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="my-4 flex flex-col lg:w-full lg:flex-row lg:gap-4">
            <div className="lg:w-1/3">
              <div className="grid-cols-auto mb-4 grid items-end gap-4">
                <InputFieldRHF name="project" label="Project" />
                <MultiSelect name="labels" label="Labels" />
              </div>
              <InputFieldRHF name="description" label="Description" />
              <SamplesTableRHF
                name="samples"
                appendToNotebook={(val) =>
                  sampleLinkRef.current?.appendSampleLink(val)
                }
              />
              {/* {initialValue.measurements ? (
                <>
                  <div className="mt-2 flex flex-row gap-4">
                    <div className="text-xl font-semibold">Measurements</div>
                  </div>
                  <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
                    <MeasuresTable measurements={initialValue.measurements} />
                  </div>
                </>
              ) : null} */}
            </div>
            <div className="lg:w-2/3">
              <LexicalEditor sampleLinkRef={sampleLinkRef} />
              {/* <RichTextImageFieldRHF name="content" label="Content" /> */}
            </div>
          </div>
        </Card.Body>
      </Card>
    </FormRHF>
  );
}
