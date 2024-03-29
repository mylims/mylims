import { Analysis, fromJcamp } from 'base-analysis';
import React, { ReactNode, useMemo, useState } from 'react';
import { PlotController, PlotObject } from 'react-plot';

import { ZoomAnnotation } from '@/components/PlotJcamp/ZoomAnnotation';

import type { PlotQuery } from './types';
import { getPlotJcamp } from './utils';

export interface PlotJcampProps {
  content: string | null;
  initialQuery: PlotQuery;
  children?: (analysis: Analysis, query: PlotQuery) => ReactNode;
}

export function PlotJcampSingle({
  content,
  initialQuery,
  children,
}: PlotJcampProps) {
  const [query] = useState<PlotQuery>(initialQuery);
  const analysis = useMemo(() => {
    if (!content) return null;
    try {
      return fromJcamp(content ?? '');
    } catch (e) {
      return null;
    }
  }, [content]);

  const plotContent = useMemo(() => {
    if (!analysis || analysis.measurements.length === 0) return null;
    return getPlotJcamp(query, [analysis], { width: 600, height: 500 });
  }, [analysis, query]);

  if (!plotContent || !analysis) return null;

  return (
    <PlotController>
      <PlotObject plot={plotContent}>
        {children?.(analysis, query)}
        <ZoomAnnotation />
      </PlotObject>
    </PlotController>
  );
}
