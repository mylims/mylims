import { Field, FieldArray, FormikConfig } from 'formik';
import { useRouter } from 'next/router';

import {
  Button,
  Card,
  Color,
  Form,
  FormError,
  InputField,
  Size,
  SubmitButton,
  ToggleField,
} from '../../components/tailwind-ui';
import {
  EditFileSyncOptionInput,
  NewFileSyncOptionInput,
} from '../../generated/graphql';
import { omitDeep } from '../../utils/omit-deep';

import PatternEdit from './PatternEdit';

const defaultInitialValues: NewFileSyncOptionInput = {
  enabled: false,
  root: '',
  maxDepth: 0,
  patterns: [],
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
  const router = useRouter();

  return (
    <div className="m-4 min-w-1/4">
      <Card>
        <Form
          initialValues={
            initialValues
              ? omitDeep(initialValues, '__typename')
              : defaultInitialValues
          }
          onSubmit={onSubmit}
        >
          {({ values }) => (
            <>
              <Card.Header>
                <h3 className="text-lg leading-6 font-medium text-cool-gray-900">
                  {title}
                </h3>
              </Card.Header>
              <div className="p-4 space-y-4">
                <FormError />
                {initialValues && <Field name="id" label="id" type="hidden" />}
                <ToggleField name="enabled" label="Enabled" />
                <InputField name="root" label="Root path" />
                <InputField type="number" name="maxDepth" label="Max depth" />

                <FieldArray name="patterns">
                  {({ push, remove }) => (
                    <>
                      <h3 className="text-md leading-6 font-medium text-cool-gray-900">
                        Patterns
                        <Button
                          size={Size.xSmall}
                          className="ml-2"
                          onClick={() => push({ type: 'include', pattern: '' })}
                        >
                          Add
                        </Button>
                      </h3>
                      <div className="flex flex-wrap">
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
                      onClick={() => router.back()}
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
