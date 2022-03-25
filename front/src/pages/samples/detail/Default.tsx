import { PencilIcon } from '@heroicons/react/outline';
import React, { ReactNode } from 'react';
import { useParams } from 'react-router-dom';

import { API_URL } from '@/../env';
import AttachmentsTable from '@/components/AttachmentsTable';
import FieldDescription from '@/components/FieldDescription';
import { FormLayout } from '@/components/FormLayout';
import { LinkButton } from '@/components/LinkButton';
import MeasuresTable from '@/components/MeasuresTable';
import { RichTextSerializer } from '@/components/RichTextSerializer';
import {
  Alert,
  AlertType,
  Card,
  Color,
  Spinner,
} from '@/components/tailwind-ui';
import { SampleQuery, useSampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

type DisplaySample = (sample: SampleQuery['sample']) => ReactNode;
interface SampleDetailProps {
  kind: string;
  metaGrid: DisplaySample;
  formEditor?: DisplaySample;
}
export default function SampleDetail({
  kind,
  metaGrid,
  formEditor,
}: SampleDetailProps) {
  const { id = '' } = useParams<{ id: string }>();
  const { data, loading, error } = useSampleQuery({ variables: { id } });
  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title="Error while fetching sample" type={AlertType.ERROR}>
        Unexpected error: {error?.message}
      </Alert>
    );
  }
  const { sample } = data;
  return (
    <Card>
      <Card.Header>
        <div className="flex flex-row justify-between">
          <FieldDescription
            title={`${kind} name`}
            titleStyle={{ textTransform: 'capitalize' }}
          >
            {sample.sampleCode.join('_')}
          </FieldDescription>
          <div className="flex flex-row gap-4">
            <FieldDescription title="Created at">
              {formatDate(sample.createdAt)}
            </FieldDescription>
            <LinkButton
              title="update"
              to={`/sample/update/${kind}/${id}`}
              className="flex space-x-2"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Update</span>
            </LinkButton>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <FormLayout
          formGrid={metaGrid(sample)}
          formAttachments={
            <>
              <div className="text-xl font-semibold">Attachments</div>
              <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
                <AttachmentsTable attachments={sample.attachments} />
              </div>
              <div className="mt-2 flex flex-row gap-4">
                <div className="text-xl font-semibold">Measurements</div>
                <LinkButton
                  to={`/measurement/singleCreate/${sample.id}`}
                  color={Color.success}
                >
                  + Add measurement
                </LinkButton>
              </div>
              <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
                <MeasuresTable measurements={sample.measurements} />
              </div>
            </>
          }
          formEditor={
            <>
              {formEditor?.(sample) ?? null}
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
            </>
          }
        />
      </Card.Body>
    </Card>
  );
}
