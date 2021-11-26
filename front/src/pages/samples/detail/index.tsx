import React from 'react';
import { useParams } from 'react-router-dom';

import { useSampleQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';
import {
  Alert,
  AlertType,
  Card,
  Color,
  Feed,
  Spinner,
} from '@/components/tailwind-ui';
import ElnLayout from '@/components/ElnLayout';
import { CalculatorIcon, PaperClipIcon } from '@heroicons/react/solid';

export default function SampleDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSampleQuery({ variables: { id } });
  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title="Error while fetching measurement" type={AlertType.ERROR}>
        Unexpected error: {error?.message}
      </Alert>
    );
  }
  const { sample } = data;
  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between">
          <div>
            <div className="text-xl font-semibold">
              {sample.sampleCode.join('_')}
            </div>
            <div className="text-neutral-500">{id}</div>
            <div className="text-neutral-500">
              Created at {formatDate(sample.createdAt)}
            </div>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div>
          <div>
            <Feed className="w-1/3">
              {sample.activities.map((activity) => {
                switch (activity.type) {
                  case 'file': {
                    const file: string = (activity as any).fileId ?? '';
                    return (
                      <Feed.Item
                        icon={<PaperClipIcon />}
                        key={file}
                        title={
                          <div className="space-x-2">
                            <span>Added file</span>
                            <span className="text-sm text-neutral-600">
                              {formatDate(activity.date)}
                            </span>
                          </div>
                        }
                        iconBackgroundColor={Color.alternative}
                        description={file}
                      />
                    );
                  }
                  case 'measurement':
                  default: {
                    const id: string = (activity as any).measurementId ?? '';
                    const type: string =
                      (activity as any).measurementType ?? '';
                    return (
                      <Feed.Item
                        icon={<CalculatorIcon />}
                        key={id}
                        title={
                          <div className="space-x-2">
                            <span>Added measurement</span>
                            <span className="text-sm text-neutral-600">
                              {formatDate(activity.date)}
                            </span>
                          </div>
                        }
                        iconBackgroundColor={Color.primary}
                        description={`type: ${type}, id: ${id}`}
                      />
                    );
                  }
                }
              })}
            </Feed>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

SampleDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Sample detail">{page}</ElnLayout>;
};
