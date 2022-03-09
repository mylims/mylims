import { PencilIcon } from '@heroicons/react/outline';
import React, { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import FieldDescription from '@/components/FieldDescription';
import {
  Alert,
  AlertType,
  Button,
  Card,
  Color,
  Spinner,
  Variant,
} from '@/components/tailwind-ui';
import { SampleQuery, useSampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

interface SampleDetailProps {
  kind: string;
  children(sample: SampleQuery['sample']): ReactNode;
}
export default function SampleDetail({ kind, children }: SampleDetailProps) {
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
            <Link title="update" to={`/sample/update/${kind}/${id}`}>
              <Button
                className="flex space-x-2"
                color={Color.primary}
                variant={Variant.secondary}
              >
                <PencilIcon className="h-5 w-5" />
                <span>Update</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card.Header>
      <Card.Body>{children(sample)}</Card.Body>
    </Card>
  );
}
