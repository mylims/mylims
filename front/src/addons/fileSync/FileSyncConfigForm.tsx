import React from 'react';
import { Field, FieldArray, FormikConfig } from 'formik';
import { useHistory } from 'react-router-dom';

import {
  Alert,
  AlertType,
  Button,
  Card,
  Color,
  Form,
  FormError,
  InputField,
  Size,
  SubmitButton,
  ToggleField,
} from '@components/tailwind-ui';
import { omitDeep } from '../../utils/omit-deep';

import PatternEdit from './PatternEdit';
import ReadyCheckEdit from './ReadyCheckEdit';
import SelectFolderSlideOver from './SelectFolderSlideOver';
import {
  EditFileSyncOptionInput,
  NewFileSyncOptionInput,
  useReadyChecksQuery,
} from './generated/graphql';

const defaultInitialValues: NewFileSyncOptionInput = {
  enabled: true,
  root: '',
  maxDepth: 0,
  patterns: [],
  readyChecks: [],
};

interface FileSyncConfigFormProps {
  title: string;
  loading: boolean;
  onSubmit: FormikConfig<
    NewFileSyncOptionInput | EditFileSyncOptionInput
  >['onSubmit'];
  submitLabel: string;
  initialValues?: EditFileSyncOptionInput;
}

export default function FileSyncConfigForm({
  title,
  loading,
  onSubmit,
  submitLabel,
  initialValues,
}: FileSyncConfigFormProps) {
  const router = useHistory();

  const { data, error, loading: readyCheckLoading } = useReadyChecksQuery();

  return (
    <div className="m-4 min-w-1/4">
      {error && (
        <Alert
          title={'Error while loading available ready checks'}
          type={AlertType.ERROR}
        >
          Unexpected error: {error}
        </Alert>
      )}
      <Card>
        <Form
          initialValues={
            initialValues
              ? omitDeep(initialValues, '__typename')
              : defaultInitialValues
          }
          onSubmit={onSubmit}
        >
          {({ values, setFieldValue }) => (
            <>
              <Card.Header>
                <h3 className="text-lg font-medium leading-6 text-cool-gray-900">
                  {title}
                </h3>
              </Card.Header>
              <div className="p-4 space-y-4">
                <FormError />
                {initialValues && <Field name="id" label="id" type="hidden" />}
                <ToggleField name="enabled" label="Enabled" />
                <>
                  <InputField name="root" label="Root path" disabled />
                  <SelectFolderSlideOver
                    returnPath={(path: string) => setFieldValue('root', path)}
                  />
                </>
                <InputField type="number" name="maxDepth" label="Max depth" />

                <FieldArray name="patterns">
                  {({ push, remove }) => (
                    <>
                      <h3 className="font-medium leading-6 text-md text-cool-gray-900">
                        Patterns
                        <Button
                          size={Size.xSmall}
                          className="ml-2"
                          onClick={() => push({ type: 'include', pattern: '' })}
                        >
                          Add
                        </Button>
                      </h3>
                      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                        {values.patterns.length > 0 &&
                          values.patterns.map((_, index) => (
                            <PatternEdit
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
                              remove={remove}
                              index={index}
                            />
                          ))}
                      </div>
                    </>
                  )}
                </FieldArray>
                {!readyCheckLoading && (
                  <FieldArray name="readyChecks">
                    {({ push, remove }) => (
                      <>
                        <h3 className="font-medium leading-6 text-md text-cool-gray-900">
                          Ready checks
                          <Button
                            size={Size.xSmall}
                            className="ml-2"
                            onClick={() => push({ name: '' })}
                          >
                            Add
                          </Button>
                        </h3>
                        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2">
                          {values.readyChecks.length > 0 &&
                            values.readyChecks.map((readyCheck, index) => (
                              <ReadyCheckEdit
                                key={readyCheck.name + readyCheck.value}
                                remove={remove}
                                index={index}
                                readyCheck={readyCheck}
                                checks={data?.readyChecks ?? []}
                              />
                            ))}
                        </div>
                      </>
                    )}
                  </FieldArray>
                )}
              </div>
              <Card.Footer>
                <div className="flex flex-wrap justify-between">
                  <div>
                    <SubmitButton disabled={loading}>
                      {submitLabel}
                    </SubmitButton>
                  </div>
                  <div>
                    <Button
                      className="flex"
                      color={Color.danger}
                      onClick={() => router.goBack()}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </Card.Footer>
            </>
          )}
        </Form>
      </Card>
    </div>
  );
}
