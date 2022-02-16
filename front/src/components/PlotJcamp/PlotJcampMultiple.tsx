import { fromJcamp } from 'base-analysis';
import React, { useMemo } from 'react';
import { PlotObject } from 'react-plot';

import type { PlotQuery } from './types';
import { getPlotJcamp } from './utils';

interface PlotJcampMultipleProps {
  content: Array<string>;
  query: PlotQuery;
  size: { width: number; height: number };
}

export function PlotJcampMultiple({
  content,
  query,
  size,
}: PlotJcampMultipleProps) {
  const analyses = useMemo(
    () => content.map((jcamp) => fromJcamp(jcamp)),
    [content],
  );
  const plotContent = useMemo(() => {
    return getPlotJcamp(query, analyses, {
      ...size,
      margin: { bottom: 50, left: 90, top: 5, right: 5 },
    });
  }, [analyses, query, size]);

  return <PlotObject plot={plotContent} />;
}
