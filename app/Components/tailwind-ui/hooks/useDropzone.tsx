import { useState } from 'react';
import { DropzoneProps } from 'react-dropzone';

export interface DropzoneHookOptions extends Omit<DropzoneProps, 'onDrop'> {
  replace?: boolean;
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
    setFiles(files.filter((file) => file.name !== fileToRemove.name));
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
