import React from 'react';

import { SamplesTable } from '@/components/LexicalEditor/components/SamplesTable';

interface SampleLinkModalProps {
  appendSample: (id: string) => void;
}
export function SampleLinkModal({ appendSample }: SampleLinkModalProps) {
  return (
    <div className="min-w-1/4 m-2 min-h-[200px]">
      <SamplesTable appendSample={appendSample} />
    </div>
  );
}
