import { UploadIcon } from '@heroicons/react/solid';
import bytesize from 'byte-size';
import clsx from 'clsx';
import React, { ReactNode } from 'react';
import { DropzoneProps as DropzoneLibProps, useDropzone } from 'react-dropzone';

export interface DropzoneProps extends DropzoneLibProps {
  header?: ReactNode;
  message?: ReactNode;
}

export function Dropzone(props: DropzoneProps): JSX.Element {
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

  return (
    <div
      {...getRootProps()}
      className={clsx(
        'border-2 border-dashed rounded-md focus:outline-none focus:ring focus:border-transparent',
        {
          'border-primary-500 focus:ring-primary-500': isDragAccept,
          'border-neutral-300 focus:ring-primary-500': !isDragActive,
          'border-danger-500 focus:ring-danger-500': isDragReject,
        },
      )}
    >
      <input {...getInputProps()} />
      <div className="mt-2 sm:mt-0 sm:col-span-2">
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
              <UploadIcon className="w-12 h-12 mx-auto text-neutral-300" />
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
                {props.maxSize && <>up to {String(bytesize(props.maxSize))}</>}
              </div>

              {fileRejections.length > 0 && (
                <p
                  title={fileRejections.map(({ file }) => file.name).join(', ')}
                  className="text-danger-500"
                >
                  {fileRejections.length} file
                  {fileRejections.length > 1 ? 's were' : ' was'} not accepted.
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
}
