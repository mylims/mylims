import React from 'react';
import { Link } from 'react-router-dom';
import * as yup from 'yup';

import AutoSubmitForm from '@/components/AutoSubmitForm';
import {
  Button,
  Color,
  Form,
  InputField,
  SelectField,
  Variant,
} from '@/components/tailwind-ui';
import {
  MeasurementSortField,
  MeasurementTypes,
  SortDirection,
} from '@/generated/graphql';
import {
  selectOrder,
  selectField,
  MeasurementQueryType,
} from '@/hooks/useMeasurementQuery';

interface MeasurementFormFilterProps {
  initialValues: MeasurementQueryType;
  onSubmit: (values: MeasurementQueryType) => void;
  children: React.ReactNode[];
}

const schema = yup.object().shape({
  type: yup
    .object()
    .shape({
      value: yup.string().required(),
      label: yup.string().required(),
    })
    .required(),
  username: yup.string().nullable(),
  sampleCode: yup.string().nullable(),
});
const selectTypeOptions = [
  { value: MeasurementTypes.GENERAL, label: MeasurementTypes.GENERAL },
  { value: MeasurementTypes.TRANSFER, label: MeasurementTypes.TRANSFER },
];
const selectOrderOptions = [
  { value: SortDirection.ASC, label: selectOrder[SortDirection.ASC] },
  { value: SortDirection.DESC, label: selectOrder[SortDirection.DESC] },
];
const selectFieldOptions = [
  {
    value: MeasurementSortField.USERNAME,
    label: selectField[MeasurementSortField.USERNAME],
  },
  {
    value: MeasurementSortField.CREATEDAT,
    label: selectField[MeasurementSortField.CREATEDAT],
  },
  {
    value: MeasurementSortField.CREATEDBY,
    label: selectField[MeasurementSortField.CREATEDBY],
  },
];

export default function MeasurementFormFilter({
  initialValues,
  onSubmit,
  children,
}: MeasurementFormFilterProps) {
  return (
    <Form
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={onSubmit}
    >
      <div>
        <Link to="/measurement/list">
          <Button variant={Variant.secondary} color={Color.danger}>
            Remove filters
          </Button>
        </Link>

        <div className="grid grid-cols-3 gap-4 my-4">
          <SelectField
            options={selectTypeOptions}
            name="type"
            label="Measurement type"
          />
          <InputField name="username" label="Username" />
          <InputField name="sampleCode" label="Sample code" />
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
