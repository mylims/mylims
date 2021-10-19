import { Field, FieldArray, FormikConfig } from 'formik';
import React from 'react';
import { useHistory } from 'react-router-dom';

import PatternEdit from './PatternEdit';
import ReadyCheckEdit from './ReadyCheckEdit';
import SelectFolderSlideOver from './SelectFolderSlideOver';
import TopicsEdit from './TopicsEdit';

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
  Variant,
} from '@/components/tailwind-ui';
import {
  EditFileSyncOptionInput,
  NewFileSyncOptionInput,
  useReadyChecksQuery,
} from '@/generated/graphql';
import { omitDeep } from '@/utils/omit-deep';

const defaultInitialValues: NewFileSyncOptionInput = {
  enabled: true,
  root: '',
  maxDepth: 0,
  topics: [],
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
  children?: React.ReactNode;
}

export default function FileSyncConfigForm({
  title,
  loading,
  onSubmit,
  submitLabel,
  initialValues,
  children,
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
                {children}
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
                          variant={Variant.secondary}
                          className="ml-2"
                          onClick={() => push({ type: 'include', pattern: '' })}
                        >
                          + add
                        </Button>
                      </h3>
                      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {values.patterns.map((_, index) => (
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
                            variant={Variant.secondary}
                            className="ml-2"
                            onClick={() => push({ name: '' })}
                          >
                            + add
                          </Button>
                        </h3>
                        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2">
                          {values.readyChecks.map((readyCheck, index) => (
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
                <FieldArray name="topics">
                  {({ push, remove }) => (
                    <>
                      <h3 className="font-medium leading-6 text-md text-cool-gray-900">
                        Topics
                        <Button
                          size={Size.xSmall}
                          variant={Variant.secondary}
                          className="ml-2"
                          onClick={() => push('')}
                        >
                          + add
                        </Button>
                      </h3>
                      <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                        {values.topics.map((_, index) => (
                          <TopicsEdit
                            key={`topic-${index}`}
                            remove={remove}
                            index={index}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </FieldArray>
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
