import { UploadIcon } from '@heroicons/react/solid';
import bytesize from 'byte-size';
import clsx from 'clsx';
import { getType, getExtension } from 'mime';
import React, { forwardRef, ReactNode, useImperativeHandle } from 'react';
import { DropzoneProps as DropzoneLibProps, useDropzone } from 'react-dropzone';

export interface DropzoneProps extends DropzoneLibProps {
  header?: ReactNode;
  message?: ReactNode;
}

// @ts-expect-error Will be supported in TS 4.6.
const listFormatter = new Intl.ListFormat('en', {
  style: 'short',
  type: 'disjunction',
});

export const Dropzone = forwardRef<HTMLInputElement, DropzoneProps>(
  function DropzoneForwardRef(props, ref) {
    const { message, header, accept, ...otherProps } = props;
    const { mimes, extensions } = getAcceptedFiles(accept || []);

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      fileRejections,
      draggedFiles,
      isDragReject,
      isDragAccept,
    } = useDropzone({
      ...otherProps,
      accept: mimes,
    });

    const allFilesAccepted = isDragAccept;
    const someFilesRejected = !isDragAccept && isDragReject;
    const allFilesRejected =
      someFilesRejected &&
      draggedFiles.length === 1 &&
      draggedFiles[0].type !== '';

    const { ref: dropzoneRef, style, ...inputProps } = getInputProps();
    useImperativeHandle(ref, () => dropzoneRef.current);

    return (
      <div
        {...getRootProps()}
        className={clsx(
          'rounded-md border-2 border-dashed focus-within:border-transparent focus-within:ring focus-within:ring-primary-500 focus:border-transparent focus:outline-none focus:ring',
          {
            'border-success-600 focus:ring-success-600': allFilesAccepted,
            'border-primary-500 focus:ring-primary-500':
              someFilesRejected && !allFilesRejected,
            'border-danger-500 focus:ring-danger-500': allFilesRejected,
            'border-neutral-300 focus:ring-primary-500': !isDragActive,
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
                    </span>
                    {' or drag and drop'}
                  </p>
                )}
              </div>
              <div className="mt-1 text-xs">
                <div className="text-neutral-500">
                  {props.accept ? extensions : null}
                  {props.accept && props.maxSize ? ' ' : null}
                  {props.maxSize
                    ? `(up to ${String(bytesize(props.maxSize))})`
                    : null}
                </div>

                {!isDragActive && fileRejections.length > 0 && (
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

                {isDragActive && allFilesRejected && (
                  <p className="text-danger-500">This file cannot be added</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

function getAcceptedFiles(accept: string | string[]) {
  const results =
    typeof accept !== 'string'
      ? convertAccept(accept)
      : convertAccept(accept.split(','));

  return {
    extensions: listFormatter.format(
      results.map((element) => element.extension),
    ),
    mimes: results.map((element) => element.mime).join(','),
  };
}

function convertAccept(array: Array<string>) {
  const results: Array<{ extension: string; mime: string }> = [];

  let mime: string;
  let extension: string;

  for (const element of array) {
    if (element.includes('/')) {
      // It's a mime type.
      mime = element;

      let extension = getExtension(mime);
      if (extension === null) {
        if (shouldWarn(mime)) {
          // eslint-disable-next-line no-console
          console.warn(
            `An unknown mime type (${mime}) was passed to the accept prop of the Dropzone component. The type will be displayed to the user as a fallback. You can add it the mime database using "mime.define({'${element}': ['extension']})".`,
          );
        }
        extension = mime.toLowerCase();
      }

      results.push({
        extension,
        mime,
      });
    } else {
      // If it's not a mime type, then it has to be an extension.
      extension = element;

      let mime = getType(extension);
      if (mime === null) {
        if (shouldWarn(extension)) {
          // eslint-disable-next-line no-console
          console.warn(
            `An unknown extension (${extension}) was passed to the accept prop of the Dropzone component. The type "application/octet-stream" will be used as a fallback. You can add it the mime database using "mime.define({'mime/type': ['${element}']})".`,
          );
        }
        mime = 'application/octet-stream';
        extension = extension.toLowerCase();
      } else {
        // Normalize the extension that will be showed to the user.
        extension = getExtension(mime) as string;
      }

      results.push({
        extension,
        mime,
      });
    }
  }

  return results;
}

const warned = new Set<string>();
function shouldWarn(value: string) {
  value = value.toLowerCase();
  if (warned.has(value)) {
    return false;
  }
  warned.add(value);
  return true;
}
