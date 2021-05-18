import { FieldArray, FormikConfig } from 'formik';
import { useRouter } from 'next/router';

import {
  Button,
  Card,
  Color,
  Form,
  FormError,
  InputField,
  RadioField,
  Size,
  SubmitButton,
  SvgOutlineTrash,
  ToggleField,
} from '../../components/tailwind-ui';
import {
  EditFileSyncOptionInput,
  NewFileSyncOptionInput,
} from '../../generated/graphql';
import { omitDeep } from '../../utils/omit-deep';

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
                {initialValues && <InputField name="id" label="id" />}
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
                          values.patterns.map((pattern, index) => (
                            // eslint-disable-next-line react/jsx-key
                            <div className="m-2 min-w-1/3">
                              <Card>
                                <Card.Header>
                                  <Button
                                    size={Size.xSmall}
                                    color={Color.danger}
                                    onClick={() => remove(index)}
                                  >
                                    <SvgOutlineTrash />
                                  </Button>
                                </Card.Header>
                                <div className="p-2">
                                  <RadioField
                                    value="include"
                                    name={`patterns.${index}.type`}
                                    label="Include"
                                  />
                                  <RadioField
                                    value="exclude"
                                    name={`patterns.${index}.type`}
                                    label="Exclude"
                                  />
                                  <InputField
                                    name={`patterns.${index}.pattern`}
                                    label="Pattern"
                                    hiddenLabel
                                  />
                                </div>
                              </Card>
                            </div>
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
