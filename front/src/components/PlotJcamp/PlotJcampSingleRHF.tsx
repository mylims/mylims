import React, { useEffect, useState } from 'react';
import { useController } from 'react-hook-form';

import {
  PlotJcampProps,
  PlotJcampSingle,
} from '@/components/PlotJcamp/PlotJcampSingle';

export type PlotJcampRHFProps = Omit<PlotJcampProps, 'content'> & {
  name: string;
};
export function PlotJcampSingleRHF({
  name,
  initialQuery,
  children,
}: PlotJcampRHFProps) {
  const { field } = useController({ name });
  const [content, setContent] = useState<string | null>(null);

  useEffect(() => {
    if (field.value[0]) {
      (field.value[0] as File)
        .text()
        .then((value) => setContent(value))
        .catch(() => setContent(null));
    }
  }, [field.value]);

  return (
    <PlotJcampSingle content={content} initialQuery={initialQuery}>
      {children}
    </PlotJcampSingle>
  );
}
