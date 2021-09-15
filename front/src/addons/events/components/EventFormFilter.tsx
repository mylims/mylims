import React from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import AutoSubmitForm from '@/components/AutoSubmitForm';
import { getTagColor } from '@/components/EventStatusLabel';
import {
  Button,
  Color,
  Form,
  InputField,
  MultiSearchSelectField,
  SelectField,
  useMultiSearchSelect,
  Variant,
} from '@/components/tailwind-ui';
import {
  EventSortField,
  EventStatus,
  SortDirection,
} from '@/generated/graphql';
import { selectOrder, selectField } from '@/hooks/useEventQuery';

interface EventFormFilterProps {
  initialValues: any;
  onSubmit: (values: any) => void;
  children: React.ReactNode[];
}
interface TagsMultiSearch {
  value: EventStatus;
  label: string;
}

const schema = yup.object().shape({
  topic: yup.string().nullable(),
  processorId: yup.string().nullable(),
  status: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.string().required(),
        label: yup.string().required(),
      }),
    )
    .nullable()
    .min(1),
});
const selectOrderOptions = [
  { value: SortDirection.ASC, label: selectOrder[SortDirection.ASC] },
  { value: SortDirection.DESC, label: selectOrder[SortDirection.DESC] },
];
const selectFieldOptions = [
  {
    value: EventSortField.CREATEDAT,
    label: selectField[EventSortField.CREATEDAT],
  },
  { value: EventSortField.DATE, label: selectField[EventSortField.DATE] },
  {
    value: EventSortField.PROCESSORID,
    label: selectField[EventSortField.PROCESSORID],
  },
  { value: EventSortField.STATUS, label: selectField[EventSortField.STATUS] },
  { value: EventSortField.TOPIC, label: selectField[EventSortField.TOPIC] },
];

export default function EventFormFilter({
  initialValues,
  onSubmit,
  children,
}: EventFormFilterProps) {
  const selectTags = useMultiSearchSelect({
    options: [
      { value: EventStatus.PENDING, label: EventStatus.PENDING },
      { value: EventStatus.PROCESSING, label: EventStatus.PROCESSING },
      { value: EventStatus.ERROR, label: EventStatus.ERROR },
      { value: EventStatus.SUCCESS, label: EventStatus.SUCCESS },
    ],
  });
  return (
    <Form
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      <div>
        <Link to="/event/list">
          <Button variant={Variant.secondary} color={Color.danger}>
            Remove filters
          </Button>
        </Link>

        <div className="grid grid-cols-4 gap-4 my-4">
          <InputField name="topic" label="Topic" />
          <InputField name="processorId" label="Processor Id" />
          <div className="col-span-2">
            <MultiSearchSelectField
              {...selectTags}
              name="status"
              label="Status"
              clearable
              getBadgeColor={({ value }: TagsMultiSearch) => getTagColor(value)}
            />
          </div>
          <SelectField
            options={selectFieldOptions}
            name="sortField"
            label="Sort field"
          />
          <SelectField
            options={selectOrderOptions}
            name="sortDirection"
            label="Sort direction"
          />
          <AutoSubmitForm />
        </div>
        {children}
      </div>
    </Form>
  );
}
