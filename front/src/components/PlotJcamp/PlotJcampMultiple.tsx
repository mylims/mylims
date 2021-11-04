import { fromJcamp } from 'common-spectrum';
import React, { useMemo } from 'react';
import { PlotObject } from 'react-plot';

import { getPlotJcamp } from './utils';
import type { PlotQuery } from './types';

interface PlotJcampMultipleProps {
  content: Array<string>;
  query: PlotQuery;
}

export function PlotJcampMultiple({ content, query }: PlotJcampMultipleProps) {
  const analyses = useMemo(
    () => content.map((jcamp) => fromJcamp(jcamp)),
    [content],
  );
  const plotContent = useMemo(() => {
    if (!analyses) return null;
    return getPlotJcamp(query, analyses, {
      width: 350,
      height: 300,
      margin: { bottom: 50, left: 90, top: 5, right: 5 },
    });
  }, [analyses, query]);

  if (!plotContent || !analyses) return null;

  return <PlotObject plot={plotContent} />;
}
