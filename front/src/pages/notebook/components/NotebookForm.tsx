import { PaperClipIcon } from '@heroicons/react/outline';
import React from 'react';

import FieldDescription from '@/components/FieldDescription';
import { LexicalEditorRHF } from '@/components/LexicalEditor/LexicalEditorRHF';
import MultiSelect from '@/components/MultiSelect';
import {
  FormRHF,
  Card,
  InputFieldRHF,
  SubmitButtonRHF,
} from '@/components/tailwind-ui';
import { formatDate } from '@/utils/formatFields';

import { UpdateNotebook, StateNotebook } from '../models';

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
  return (
    <FormRHF<StateNotebook> defaultValues={initialValue} onSubmit={onSubmit}>
      <Card>
        <Card.Header>
          <div className="flex flex-row justify-between">
            <div className="flex flex-row gap-4">
              <InputFieldRHF
                name="title"
                label="Notebook title"
                className="uppercase"
              />
              <InputFieldRHF name="project" label="Project" />
              <MultiSelect name="labels" label="Labels" />
              <InputFieldRHF name="description" label="Description" />
            </div>
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
          <div className="flex flex-col lg:w-full lg:flex-row lg:gap-4">
            <div className="w-full">
              <LexicalEditorRHF name="content" label="Content" extended />
            </div>
          </div>
        </Card.Body>
      </Card>
    </FormRHF>
  );
}
