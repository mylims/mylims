import { UploadIcon } from '@heroicons/react/solid';
import bytesize from 'byte-size';
import clsx from 'clsx';
import { getType } from 'mime';
import React, { forwardRef, ReactNode, useImperativeHandle } from 'react';
import {
  Accept,
  DropzoneProps as DropzoneLibProps,
  useDropzone,
} from 'react-dropzone';

export interface DropzoneProps extends Omit<DropzoneLibProps, 'accept'> {
  header?: ReactNode;
  message?: ReactNode;
  accept?: Accept | string[] | string;
}

const listFormatter = new Intl.ListFormat('en', {
  style: 'short',
  type: 'disjunction',
});

export const Dropzone = forwardRef<HTMLInputElement, DropzoneProps>(
  function DropzoneForwardRef(props, ref) {
    const { message, header, accept, ...otherProps } = props;
    const { finalAccept, list } = getAcceptedFiles(accept || {});

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      ...otherProps,
      accept: finalAccept,
    });

    const { ref: dropzoneRef, style, ...inputProps } = getInputProps();
    useImperativeHandle(ref, () => dropzoneRef.current);

    return (
      <div
        {...getRootProps()}
        className={clsx(
          'rounded-md border-2 border-dashed focus-within:border-transparent focus-within:ring focus-within:ring-primary-500 focus:border-transparent focus:outline-none focus:ring focus:ring-primary-500',
          {
            'border-primary-500': isDragActive,
            'border-neutral-300': !isDragActive,
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
                  {props.accept ? list : null}
                  {props.accept && props.maxSize ? ' ' : null}
                  {props.maxSize
                    ? `(up to ${String(bytesize(props.maxSize))})`
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

function getAcceptedFiles(accept: Accept | string | string[]): {
  finalAccept: Accept;
  list: string;
} {
  const finalAccept =
    typeof accept === 'string'
      ? convertAccept(accept.split(','))
      : Array.isArray(accept)
      ? convertAccept(accept)
      : accept;

  const listArray: string[] = [];
  for (const key of Object.keys(finalAccept)) {
    if (finalAccept[key].length === 0) {
      listArray.push(key);
    } else {
      listArray.push(...finalAccept[key]);
    }
  }

  return {
    finalAccept,
    list: listFormatter.format(listArray),
  };
}

function convertAccept(array: Array<string>): Accept {
  array = array.map((value) => value.trim());
  const result: Accept = {};

  for (const element of array) {
    if (!element.startsWith('.')) {
      throw new Error(
        `Invalid extension passed to the \`accept\` prop (${element}). It must start with a dot.`,
      );
    }

    if (element.includes('/')) {
      throw new Error(
        'It is no longer supported to pass an array of mime types to the `accept` prop of the `Dropzone` component. Please use the object form or an array of extensions instead.',
      );
    } else {
      // If it's not a mime type, then it has to be an extension.
      const extension = element.toLowerCase();

      let mime = getType(extension);
      if (mime === null) {
        if (shouldWarn(extension)) {
          // eslint-disable-next-line no-console
          console.warn(
            `An unknown extension (${extension}) was passed to the accept prop of the Dropzone component. The type "application/octet-stream" will be used as a fallback. You can add it the mime database using "mime.define({'mime/type': ['${element}']})".`,
          );
        }
        mime = 'application/octet-stream';
      }

      if (result[mime]) {
        result[mime].push(extension);
      } else {
        result[mime] = [extension];
      }
    }
  }

  return result;
}

const warned = new Set<string>();
function shouldWarn(value: string) {
  if (warned.has(value)) {
    return false;
  }
  warned.add(value);
  return true;
}
