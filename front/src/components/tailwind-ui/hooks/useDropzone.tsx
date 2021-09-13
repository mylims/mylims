import { FieldHookConfig, useField } from 'formik';
import { useCallback, useState } from 'react';
import { DropzoneProps } from 'react-dropzone';
import { useController, useFormContext, useWatch } from 'react-hook-form';

export interface DropzoneHookOptions extends Omit<DropzoneProps, 'onDrop'> {
  replace?: boolean;
}

export function useDropzoneFieldRHF(
  dropzoneOptions: DropzoneHookOptions,
  name: string,
) {
  const { replace, ...dropzoneProps } = dropzoneOptions;
  const { setValue } = useFormContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({ name });
  const files: File[] = useWatch({ name });
  const onDrop = useCallback(
    (newFiles: File[]) => {
      if (replace) {
        setValue(name, newFiles);
      } else {
        const doesNotAlreadyExist = (newFile: File) => {
          return (
            files.filter((file: File) => newFile.name === file.name).length ===
            0
          );
        };
        setValue(name, files.concat(newFiles.filter(doesNotAlreadyExist)), {
          shouldTouch: true,
          shouldValidate: isSubmitted,
        });
      }
    },
    [files, setValue, name, replace, isSubmitted],
  );

  const removeFile = useCallback(
    (fileToRemove: File) => {
      setValue(
        name,
        files.filter((file) => file.name !== fileToRemove.name),
        {
          shouldTouch: true,
          shouldValidate: isSubmitted,
        },
      );
    },
    [setValue, files, name, isSubmitted],
  );

  const clearFiles = useCallback(() => {
    setValue(name, [], {
      shouldTouch: true,
      shouldValidate: isSubmitted,
    });
  }, [name, setValue, isSubmitted]);

  return {
    removeFile,
    clearFiles,
    dropzoneProps: {
      ...dropzoneProps,
      ...field,
      onDrop,
    },
    dropzoneListProps: {
      files,
      onRemove: removeFile,
    },
    field,
    error,
  };
}

export function useDropzoneField(
  dropzoneOptions: DropzoneHookOptions,
  fieldConfig: FieldHookConfig<File[]>,
) {
  const { replace, ...dropzoneProps } = dropzoneOptions;
  fieldConfig.type = 'file';
  const [field, meta, helper] = useField<File[]>(fieldConfig);

  const files = field.value;
  const onDrop = (newFiles: File[]) => {
    if (replace) {
      helper.setValue(newFiles);
    } else {
      const doesNotAlreadyExist = (newFile: File) => {
        return (
          field.value.filter((file: File) => newFile.name === file.name)
            .length === 0
        );
      };
      helper.setValue(files.concat(newFiles.filter(doesNotAlreadyExist)));
    }
  };

  const removeFile = (fileToRemove: File) => {
    helper.setValue(files.filter((file) => file.name !== fileToRemove.name));
  };

  const clearFiles = () => {
    helper.setValue([]);
  };

  return {
    removeFile,
    clearFiles,
    dropzoneProps: {
      ...dropzoneProps,
      ...field,
      onDrop,
    },
    dropzoneListProps: {
      files,
      onRemove: removeFile,
    },
    field,
    meta,
  };
}

export function useDropzone(options: DropzoneHookOptions) {
  const { replace, ...dropzoneProps } = options;
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (newFiles: File[]) => {
    if (replace) {
      setFiles(newFiles);
    } else {
      const doesNotAlreadyExist = (newFile: File) => {
        return files.filter((file) => newFile.name === file.name).length === 0;
      };
      setFiles(files.concat(newFiles.filter(doesNotAlreadyExist)));
    }
  };

  const removeFile = (fileToRemove: File) => {
    setFiles((files) =>
      files.filter((file) => file.name !== fileToRemove.name),
    );
  };

  const clearFiles = () => {
    setFiles([]);
  };

  return {
    dropzoneProps: {
      ...dropzoneProps,
      onDrop,
    },
    dropzoneListProps: {
      files,
      onRemove: removeFile,
    },
    files,
    removeFile,
    clearFiles,
  };
}

export type SingleFileDropzoneHookConfig = Omit<
  DropzoneHookOptions,
  'replace' | 'maxFiles' | 'multiple'
>;

export function useSingleFileDropzone(config: SingleFileDropzoneHookConfig) {
  const droppedFiles = useDropzone({
    replace: true,
    maxFiles: 1,
    multiple: false,
    ...config,
  });
  return {
    ...droppedFiles,
    file: droppedFiles.dropzoneListProps.files[0] as File | undefined,
  };
}
