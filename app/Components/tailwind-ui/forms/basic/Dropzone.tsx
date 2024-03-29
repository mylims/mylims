import { UploadIcon } from '@heroicons/react/solid';
import bytesize from 'byte-size';
import clsx from 'clsx';
import React, { forwardRef, ReactNode, useImperativeHandle } from 'react';
import { DropzoneProps as DropzoneLibProps, useDropzone } from 'react-dropzone';

export interface DropzoneProps extends DropzoneLibProps {
  header?: ReactNode;
  message?: ReactNode;
}

export const Dropzone = forwardRef<HTMLInputElement, DropzoneProps>(
  function DropzoneForwardRef(props, ref) {
    const { message, header, ...otherProps } = props;

    const accepted =
      typeof props.accept === 'string'
        ? props.accept
            .split(',')
            .map((element) => {
              element = element.toLowerCase();
              if (element.startsWith('.')) {
                // An extension was passed.
                return element.slice(1);
              } else if (element.includes('/')) {
                // A mime type was passed.
                return element.split('/')[1];
              }
              return element;
            })
            .join(', ')
        : '';

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      fileRejections,
      isDragReject,
      isDragAccept,
    } = useDropzone(otherProps);

    const { ref: dropzoneRef, style, ...inputProps } = getInputProps();
    useImperativeHandle(ref, () => dropzoneRef.current);
    return (
      <div
        {...getRootProps()}
        className={clsx(
          'rounded-md border-2 border-dashed focus-within:border-transparent focus-within:ring focus-within:ring-primary-500 focus:border-transparent focus:outline-none focus:ring',
          {
            'border-primary-500 focus:ring-primary-500': isDragAccept,
            'border-neutral-300 focus:ring-primary-500': !isDragActive,
            'border-danger-500 focus:ring-danger-500': isDragReject,
          },
        )}
      >
        <input {...inputProps} className="sr-only" ref={dropzoneRef} />
        <div className="mt-2 sm:col-span-2 sm:mt-0">
          <div
            className={clsx(
              'flex justify-center px-6 pt-5 pb-6',
              props.disabled ? 'cursor-default' : 'cursor-pointer',
            )}
          >
            <div className="text-center">
              {header !== undefined ? (
                header
              ) : (
                <UploadIcon className="mx-auto h-12 w-12 text-neutral-300" />
              )}
              <div className="mt-1 text-sm text-neutral-600">
                {message ? (
                  message
                ) : (
                  <p>
                    <span className="font-semibold text-primary-600 hover:text-primary-500">
                      Upload a file
                    </span>{' '}
                    or drag and drop
                  </p>
                )}
              </div>
              <div className="mt-1 text-xs">
                <div className="text-neutral-500">
                  {props.accept && <>{accepted}</>}{' '}
                  {props.maxSize && (
                    <>up to {String(bytesize(props.maxSize))}</>
                  )}
                </div>

                {fileRejections.length > 0 && (
                  <p
                    title={fileRejections
                      .map(({ file }) => file.name)
                      .join(', ')}
                    className="text-danger-500"
                  >
                    {fileRejections.length} file
                    {fileRejections.length > 1 ? 's were' : ' was'} not
                    accepted.
                  </p>
                )}

                {isDragReject && (
                  <p className="text-danger-500">File not accepted</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
