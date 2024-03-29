import { ChipIcon } from '@heroicons/react/outline';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Spinner,
  Variant,
  Color,
  useDebounce,
} from '@/components/tailwind-ui';
import { useSampleByCodeLazyQuery } from '@/generated/graphql';

import { useSampleLinkContext } from '../hooks/useSampleLinkContext';
import { SAMPLE_EXACT_REGEX } from '../utils/regex';

export enum SampleStatus {
  waiting = 'waiting',
  success = 'success',
  error = 'error',
}

export type SampleLinkStatus =
  | { status: SampleStatus.waiting }
  | { status: SampleStatus.success; type: string; id: string }
  | { status: SampleStatus.error; error: string };

function getIcon(state: SampleStatus) {
  switch (state) {
    case SampleStatus.waiting:
      return <Spinner className="h-5 w-5" />;
    case SampleStatus.error:
    case SampleStatus.success:
    default:
      return <ChipIcon className="h-5 w-5" />;
  }
}
function getColor(state: SampleStatus) {
  switch (state) {
    case SampleStatus.success:
      return Color.success;
    case SampleStatus.error:
      return Color.warning;
    case SampleStatus.waiting:
    default:
      return Color.neutral;
  }
}

interface SampleLinkProps {
  keyNode: string;
  sampleCode: string;
  setSampleCode(sampleCode: string): void;
  queryStatus: SampleLinkStatus;
  setQueryStatus(queryStatus: SampleLinkStatus): void;
  setFocusOff(): void;
}
export function SampleLink({
  keyNode,
  sampleCode,
  setSampleCode,
  queryStatus,
  setQueryStatus,
  setFocusOff,
}: SampleLinkProps) {
  const id = `sample-link-${keyNode}`;
  const code = useDebounce(sampleCode, 1000);
  const [sampleByCode] = useSampleByCodeLazyQuery();
  const navigate = useNavigate();
  const { addSample } = useSampleLinkContext();

  useEffect(() => {
    sampleByCode({ variables: { sampleCode: code.split('_') } })
      .then(({ data }) => {
        if (data) {
          setQueryStatus({
            status: SampleStatus.success,
            type: data.sampleByCode.kind.id,
            id: data.sampleByCode.id,
          });
          addSample(data.sampleByCode.id);
        } else {
          setQueryStatus({
            status: SampleStatus.error,
            error: 'Unknown error',
          });
        }
      })
      .catch((e) => {
        setQueryStatus({
          status: SampleStatus.error,
          error: e.message,
        });
      });
  }, [code, addSample, sampleByCode, setQueryStatus]);

  return (
    <span className="mx-0.5 inline-flex shadow-sm">
      <Button
        className="inline-flex items-center rounded-l-md rounded-r-none border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 sm:text-sm"
        disabled={queryStatus.status !== SampleStatus.success}
        variant={Variant.secondary}
        color={getColor(queryStatus.status)}
        style={{ padding: '0.25rem 0.5rem' }}
        onClick={() => {
          if (queryStatus.status === SampleStatus.success) {
            navigate(`/sample/detail/${queryStatus.type}/${queryStatus.id}`);
          }
        }}
        title={
          queryStatus.status === SampleStatus.success
            ? `${queryStatus.type}: ${code}`
            : 'Element not found'
        }
      >
        {getIcon(queryStatus.status)}
      </Button>
      <div className="relative flex flex-1 flex-row items-center rounded-r-md border border-neutral-300 bg-white py-1 px-2 text-base placeholder-neutral-400 shadow-sm focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500 sm:text-sm">
        <label htmlFor={id} className="hidden">
          Sample link node
        </label>
        <input
          type="text"
          id={id}
          className="flex-1 border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
          value={sampleCode}
          onKeyDown={(e) => {
            const events = ['Enter', 'Tab', ',', ' '];
            if (events.includes(e.key)) {
              e.preventDefault();
              setFocusOff();
            }
          }}
          onChange={(e) => {
            const value = e.target.value;
            if (SAMPLE_EXACT_REGEX.exec(value) !== null) {
              setSampleCode(value);
              setQueryStatus({ status: SampleStatus.waiting });
            }
          }}
          size={sampleCode.length}
          autoFocus
        />
      </div>
    </span>
  );
}
