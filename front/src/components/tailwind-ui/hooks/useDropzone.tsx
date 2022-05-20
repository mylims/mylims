import { useCallback, useState } from 'react';
import { Accept, DropzoneProps } from 'react-dropzone';
import { useController, useWatch } from 'react-hook-form';

import { RHFValidationProps } from '..';

import { useCheckedFormRHFContext } from './useCheckedFormRHF';

export interface DropzoneHookOptions
  extends Omit<DropzoneProps, 'onDrop' | 'accept'> {
  replace?: boolean;
  accept?: Accept | string[] | string;
}

export function useDropzoneFieldRHF(
  dropzoneOptions: DropzoneHookOptions & RHFValidationProps,
  name: string,
) {
  const { replace, deps, ...dropzoneProps } = dropzoneOptions;
  const { setValue, trigger } = useCheckedFormRHFContext();
  const {
    field,
    fieldState: { error },
    formState: { isSubmitted },
  } = useController({ name });
  const files: File[] = useWatch({ name });
  const onDrop = useCallback(
    (newFiles: File[]) => {
      if (replace) {
        setValue(name, newFiles, {
          shouldTouch: true,
          shouldValidate: isSubmitted,
        });
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
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [files, setValue, name, replace, isSubmitted, trigger, deps],
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
      if (deps && isSubmitted) {
        void trigger(deps);
      }
    },
    [setValue, files, name, isSubmitted, deps, trigger],
  );

  const clearFiles = useCallback(() => {
    setValue(name, [], {
      shouldTouch: true,
      shouldValidate: isSubmitted,
    });
    if (deps && isSubmitted) {
      void trigger(deps);
    }
  }, [name, setValue, isSubmitted, trigger, deps]);

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
