import { PencilIcon } from '@heroicons/react/outline';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import AttachmentsTable from '@/components/AttachmentsTable';
import ElnLayout from '@/components/ElnLayout';
import FieldDescription from '@/components/FieldDescription';
import { FormLayout } from '@/components/FormLayout';
import LexicalEditor from '@/components/LexicalEditor';
import { LinkButton } from '@/components/LinkButton';
import MeasuresTable from '@/components/MeasuresTable';
import {
  Alert,
  AlertType,
  Badge,
  BadgeVariant,
  Card,
  Color,
  Spinner,
} from '@/components/tailwind-ui';
import { SampleQuery, useSampleQuery } from '@/generated/graphql';
import { SampleParams, SamplesMap } from '@/pages/samples/models/BaseSample';
import { formatDate } from '@/utils/formatFields';

export default function SampleDetail() {
  const { id = '', kind = 'wafer' } = useParams<SampleParams>();
  const { data, loading, error } = useSampleQuery({ variables: { id } });
  const Sample = useMemo(() => SamplesMap[kind], [kind]);
  const metaGrid = useMemo(
    () => (sample: SampleQuery['sample']) =>
      Sample?.description(sample).map(
        ({ title, description, hide, type = 'string' }) => {
          const value = hide ? description : description ?? '-';
          if (value === null || value === undefined) return null;
          switch (type) {
            case 'boolean':
              return (
                <Badge
                  label={value ? title : `Not ${title}`}
                  color={value ? Color.success : Color.danger}
                  variant={BadgeVariant.COLORED_BACKGROUND}
                  dot
                />
              );

            case 'string':
            default:
              return (
                <FieldDescription title={title} key={title}>
                  {value}
                </FieldDescription>
              );
          }
        },
      ),
    [Sample],
  );

  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !data || !Sample) {
    return (
      <Alert title="Error while fetching sample" type={AlertType.ERROR}>
        {error ? `Unexpected error: ${error.message}` : null}
        {!Sample ? `Unknown sample kind: ${kind}` : null}
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
              {sample.description ? (
                <div className="mt-2">
                  <div className="text-xl font-semibold">Description</div>
                  <LexicalEditor
                    readOnly
                    value={sample.description}
                    onChange={() => {
                      // empty
                    }}
                    samples={[]}
                    onSamplesChange={() => {
                      // empty
                    }}
                    measurements={[]}
                    onMeasurementsChange={() => {
                      // empty
                    }}
                  />
                </div>
              ) : null}
            </>
          }
          formEditor={
            <>
              {Sample.actions?.(sample) ?? null}
              <div className="text-xl font-semibold">Attachments</div>
              <div className="text-gray-900 mt-1 text-sm sm:col-span-2 sm:mt-0">
                <AttachmentsTable attachments={sample.attachments} />
              </div>
              <div className="mt-2 flex flex-row gap-4">
                <div className="text-xl font-semibold">Measurements</div>
                <LinkButton
                  to={`/measurement/create/${sample.id}`}
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
        />
      </Card.Body>
    </Card>
  );
}

SampleDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout maxWidth="max-w-screen-2xl">{page}</ElnLayout>;
};
