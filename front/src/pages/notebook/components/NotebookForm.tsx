import { PaperClipIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { KbsProvider } from 'react-kbs';

import FieldDescription from '@/components/FieldDescription';
import MultiSelect from '@/components/FormSchema/MultiSelect';
import { LexicalEditorRHF } from '@/components/LexicalEditor/LexicalEditorRHF';
import {
  FormRHF,
  Card,
  InputFieldRHF,
  SubmitButtonRHF,
  Toggle,
  Modal,
  Button,
  Color,
} from '@/components/tailwind-ui';
import {
  sampleLinkContext,
  SampleLinkState,
} from '@/pages/notebook/hooks/useSampleLinkContext';
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
  const SampleLinkContext = sampleLinkContext;
  const [activated, setActivated] = useState(false);
  const [modal, setModal] = useState(false);
  const [state, dispatch] = useState<SampleLinkState>({
    type: 'idle',
    payload: null,
  });

  return (
    <FormRHF<StateNotebook> defaultValues={initialValue} onSubmit={onSubmit}>
      <Toggle
        label="show modal"
        activated={activated}
        onToggle={(activated) => setActivated(activated)}
      />
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
            <KbsProvider>
              <SampleLinkContext.Provider
                value={{
                  state,
                  dispatch,
                  openModal: activated ? () => setModal(true) : undefined,
                }}
              >
                <div className={activated ? 'hidden' : 'lg:w-1/3'}>
                  <SamplesTableRHF name="samples" />
                </div>
                <Modal isOpen={modal} onRequestClose={() => setModal(false)}>
                  <Modal.Body>
                    <SamplesTableRHF name="samples" />
                  </Modal.Body>
                  <Modal.Footer align="left">
                    <Button
                      color={Color.danger}
                      onClick={() => setModal(false)}
                    >
                      Cancel
                    </Button>
                  </Modal.Footer>
                </Modal>
                <div className={activated ? 'w-full' : 'lg:w-2/3'}>
                  <LexicalEditorRHF name="content" label="Content" />
                </div>
              </SampleLinkContext.Provider>
            </KbsProvider>
          </div>
        </Card.Body>
      </Card>
    </FormRHF>
  );
}
