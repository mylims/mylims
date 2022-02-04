import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { EventStatusLabel } from '@/components/EventStatusLabel';
import {
  Alert,
  AlertType,
  Card,
  SimpleListContainer,
  Spinner,
} from '@/components/tailwind-ui';
import { useEventQuery } from '@/generated/graphql';
import { formatDate } from '@/utils/formatFields';

export default function EventDetail() {
  const { id = '' } = useParams<{ id: string }>();
  const { data, loading, error } = useEventQuery({ variables: { id } });
  const processors = useMemo(() => {
    const processors = data?.event?.processors ?? [];
    return processors.map(({ processorId, history }) => (
      <Card key={processorId}>
        <Card.Header>
          <div className="font-medium">Processor Id</div>
          <div className="text-neutral-400">{processorId}</div>
        </Card.Header>
        <Card.Body>
          <SimpleListContainer>
            {history.map(({ processId, status, date, message }, i) => (
              <SimpleListContainer.Item key={processId + i}>
                <div>Process</div>
                <div className="text-neutral-400">{processId}</div>
                <EventStatusLabel status={status} />
                <span className="ml-2">{formatDate(date)}</span>
                {message && (
                  <div className="truncate text-danger-400">{message}</div>
                )}
              </SimpleListContainer.Item>
            ))}
          </SimpleListContainer>
        </Card.Body>
      </Card>
    ));
  }, [data?.event?.processors]);
  if (loading) return <Spinner className="h-10 w-10 text-danger-500" />;
  if (error || !data) {
    return (
      <Alert title={'Error while fetching user'} type={AlertType.ERROR}>
        Unexpected error {error}
      </Alert>
    );
  }

  const { event } = data;
  return (
    <Card>
      <Card.Header>
        <div className="text-xl font-semibold">Event</div>
        <div className="text-neutral-500">{id}</div>
      </Card.Header>
      <Card.Body>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <EventField title="Topic" description={event.topic} />
          <EventField
            title="Creation date"
            description={formatDate(event.createdAt)}
          />
          <EventField
            title="Relative path"
            description={event.data.file.name}
          />
        </div>
        <div className="grid grid-cols-3 gap-4">{processors}</div>
      </Card.Body>
    </Card>
  );
}

function EventField({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="font-medium">{title}</div>
      <div className="text-neutral-400">{description}</div>
    </div>
  );
}

EventDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Event detail">{page}</ElnLayout>;
};
