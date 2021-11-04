import { Analysis, fromJcamp } from 'common-spectrum';
import React, { ReactNode, useMemo, useState } from 'react';
import { PlotObject } from 'react-plot';

import { getPlotJcamp } from './utils';
import type { PlotQuery } from './types';

interface PlotJcampProps {
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
  const analysis = useMemo(
    () => (content !== null ? fromJcamp(content) : null),
    [content],
  );

  const plotContent = useMemo(() => {
    if (!analysis) return null;
    return getPlotJcamp(query, [analysis], {
      width: 600,
      height: 500,
      margin: { bottom: 50, left: 90, top: 5, right: 5 },
    });
  }, [analysis, query]);

  if (!plotContent || !analysis) return null;

  return (
    <PlotObject plot={plotContent}>{children?.(analysis, query)}</PlotObject>
  );
}
