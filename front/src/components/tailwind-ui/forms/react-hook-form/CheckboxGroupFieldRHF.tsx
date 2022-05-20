import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useController, useWatch } from 'react-hook-form';

import { useCheckedFormRHFContext } from '../../hooks/useCheckedFormRHF';
import { CheckboxProps, Checkbox } from '../basic/Checkbox';
import { Help, Label } from '../basic/common';
import {
  defaultErrorSerializer,
  FieldProps,
  RHFValidationProps,
} from '../util';

interface CheckboxGroupProps {
  children: ReactNode;
  label: string;
  hiddenLabel?: boolean;
  required?: boolean;
}
export type CheckboxGroupFieldRHFProps = FieldProps &
  CheckboxGroupProps &
  RHFValidationProps;

const checkboxGroupFieldContext = createContext<{
  name: string;
  handleToggle: (option: string, checked: boolean) => void;
  value: string[];
} | null>(null);

export function CheckboxGroupFieldRHF(props: CheckboxGroupFieldRHFProps) {
  const {
    name,
    children,
    serializeError = defaultErrorSerializer,
    label,
    hiddenLabel = false,
    required,
    deps,
  } = props;
  const { setValue, trigger } = useCheckedFormRHFContext();

  const {
    field,
    fieldState,
    formState: { isSubmitted },
  } = useController({ name });

  const error = Array.isArray(fieldState.error)
    ? fieldState.error.filter((err) => err)[0]
    : fieldState.error;
  const value = field.value as string[];

  const handleToggle = useCallback(
    (option: string, checked: boolean) => {
      let newValue: string[] = value;
      if (checked) {
        newValue = [...value, option];
      } else {
        const idx = value.findIndex((opt) => opt === option);
        if (idx !== -1) {
          newValue = value.slice();
          newValue.splice(idx, 1);
        }
      }
      setValue(name, newValue, {
        shouldTouch: true,
        shouldValidate: isSubmitted,
      });
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, name, isSubmitted, trigger, deps, value],
  );
  const contextValue = useMemo(() => {
    return {
      name,
      handleToggle,
      value,
    };
  }, [name, handleToggle, value]);

  return (
    <checkboxGroupFieldContext.Provider value={contextValue}>
      <div>
        <Label text={label} hidden={hiddenLabel} required={required} />
        <div className="mt-1">
          {children}
          <Help error={serializeError(error)} />
        </div>
      </div>
    </checkboxGroupFieldContext.Provider>
  );
}

function useCheckboxGroupContext() {
  const context = useContext(checkboxGroupFieldContext);
  if (context === null) {
    throw new Error(
      'CheckboxGroupFieldRHF.Checkbox must be rendered inside of a CheckboxGroupFieldRHF',
    );
  }
  return context;
}

export type CheckboxGroupFieldRHFCheckboxProps = Omit<
  CheckboxProps,
  'name' | 'value' | 'checked'
> & {
  value: string;
};
CheckboxGroupFieldRHF.Checkbox = function GroupCheckbox(
  props: CheckboxGroupFieldRHFCheckboxProps,
) {
  const { name, handleToggle, value } = useCheckboxGroupContext();

  const isChecked = value.includes(props.value);

  const { register, unregister } = useContext(checkboxGroupContext);

  useEffect(() => {
    register(props.value);
    return () => {
      unregister(props.value);
    };
  }, [register, unregister, props.value]);

  return (
    <Checkbox
      name={name}
      {...props}
      checked={isChecked}
      onChange={(event) => {
        handleToggle(props.value, event.target.checked);
        props.onChange?.(event);
      }}
    />
  );
};

const checkboxGroupContext = createContext<{
  values: Set<string>;
  register: (value: string) => void;
  unregister: (value: string) => void;
}>({
  values: new Set<string>(),
  register: () => {
    // noop
  },
  unregister: () => {
    // noop
  },
});

type CheckboxGroupRenderProps = Required<
  Pick<CheckboxProps, 'checked' | 'onChange'>
> & {
  indeterminate: boolean;
};

export interface CheckboxGroupFieldRHFCheckboxGroupProps {
  children: (checkboxProps: CheckboxGroupRenderProps) => ReactNode;
}

CheckboxGroupFieldRHF.Group = function GroupCheckboxGroup(
  props: CheckboxGroupFieldRHFCheckboxGroupProps,
) {
  const { setValue } = useCheckedFormRHFContext();
  const checkboxGroup = useCheckboxGroup();
  const { name } = useCheckboxGroupContext();
  const formValues = useWatch({ name }) as string[];

  const count = Array.from(checkboxGroup.values).reduce((count, value) => {
    if (formValues.includes(value)) {
      return count + 1;
    }
    return count;
  }, 0);
  const checkboxProps: CheckboxGroupRenderProps = {
    checked: count === checkboxGroup.values.size,
    indeterminate: count !== 0 && count !== checkboxGroup.values.size,
    onChange: (event) => {
      if (event.target.checked) {
        const newValues = new Set([...formValues, ...checkboxGroup.values]);
        setValue(name, Array.from(newValues));
      } else {
        const newValues = new Set(formValues);
        for (let value of checkboxGroup.values) {
          newValues.delete(value);
        }
        setValue(name, Array.from(newValues));
      }
    },
  };

  return (
    <checkboxGroupContext.Provider value={checkboxGroup}>
      {props.children(checkboxProps)}
    </checkboxGroupContext.Provider>
  );
};

function useCheckboxGroup() {
  const [values, setValues] = useState<Set<string>>(new Set());
  const { register: parentRegister, unregister: parentUnregister } =
    useContext(checkboxGroupContext);

  const register = useCallback(
    (value: string) => {
      parentRegister(value);
      setValues((values) => new Set([...values, value]));
    },
    [setValues, parentRegister],
  );

  const unregister = useCallback(
    (value: string) => {
      parentUnregister(value);
      setValues((values) => {
        values.delete(value);
        return new Set([...values]);
      });
    },
    [setValues, parentUnregister],
  );

  return useMemo(
    () => ({ values, register, unregister }),
    [values, register, unregister],
  );
}
