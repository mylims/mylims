import { fromJcamp } from 'base-analysis';
import React, { useMemo } from 'react';
import { PlotObject } from 'react-plot';

import type { PlotQuery } from './types';
import { getPlotJcamp } from './utils';

interface PlotJcampMultipleProps {
  query: PlotQuery;
  content: Array<string>;
  size: Record<'width' | 'height', number>;
}

export function PlotJcampMultiple({
  size,
  query,
  content,
}: PlotJcampMultipleProps) {
  const analyses = useMemo(
    () => content.map((jcamp) => fromJcamp(jcamp)),
    [content],
  );
  const plotContent = useMemo(
    () => getPlotJcamp(query, analyses, size),
    [analyses, query, size],
  );

  return <PlotObject plot={plotContent} />;
}
