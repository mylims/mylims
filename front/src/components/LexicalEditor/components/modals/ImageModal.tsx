import React, { useEffect } from 'react';

import {
  Dropzone,
  Input,
  useSingleFileDropzone,
} from '@/components/tailwind-ui';

import { useInsertModalContext } from '../InsertOptionsMenu';

interface ImageState {
  src: string;
  altText: string;
}
export function ImageModal() {
  const { state, setState } = useInsertModalContext();
  const { src, altText } = (state as ImageState | null) ?? {};
  const { dropzoneProps, dropzoneListProps } = useSingleFileDropzone({
    maxSize: 1e7,
    accept: { 'image/png': [], 'image/jpeg': ['.jpg'] },
  });

  useEffect(() => {
    if (dropzoneListProps.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(dropzoneListProps.files[0]);
      reader.addEventListener(
        'load',
        () => {
          setState({ src: reader.result as string, altText });
        },
        false,
      );
    }
  }, [dropzoneListProps.files, altText, setState]);

  return (
    <div className="min-w-1/4 m-2 min-h-[200px]">
      <Dropzone {...dropzoneProps} />
      {src && (
        <img
          src={src}
          alt={altText ?? ''}
          className="max-w-xl border-2 border-solid border-primary-500"
        />
      )}
      <Input
        className="mt-2"
        label="Description"
        name="Description"
        value={altText ?? ''}
        onChange={(event) => setState({ src, altText: event.target.value })}
      />
    </div>
  );
}
