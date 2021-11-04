import { fromJcamp, getReactPlotJSON } from 'common-spectrum';
import React, { useMemo } from 'react';
import { PlotObject } from 'react-plot';

interface PlotJcampMultipleProps {
  content: Array<string>;
  query: PlotQuery;
}

export interface PlotQuery {
  xLabel: string;
  yLabel: string;
  xUnits: string;
  yUnits: string;
  scale: 'log' | 'linear';
  logFilter?: 'remove' | 'abs';
}

export function PlotJcampMultiple({ content, query }: PlotJcampMultipleProps) {
  const analysis = useMemo(
    () => content.map((jcamp) => fromJcamp(jcamp)),
    [content],
  );
  const plotContent = useMemo(() => {
    if (!analysis) return null;
    const { scale, logFilter, ...restQuery } = query;

    let data = getReactPlotJSON(analysis, restQuery, {
      xAxis: { labelSpace: 30, label: `${query.xLabel} [${query.xUnits}]` },
      yAxis: {
        labelSpace: 60,
        label: `${query.yLabel} [${query.yUnits}]`,
        scale,
      },
      seriesViewportStyle: { stroke: 'black', strokeWidth: '2px' },
      enforceGrowing: true,
      content: { displayMarker: false },
      dimensions: {
        width: 350,
        height: 300,
        margin: { bottom: 50, left: 90, top: 5, right: 5 },
      },
    });

    if (scale === 'log') {
      switch (logFilter) {
        case 'remove': {
          data.content = data.content.map((element) => {
            if (element.type === 'annotation') return element;
            const { data: list, ...other } = element;
            return { ...other, data: list.filter((point) => point.y > 0) };
          });
          break;
        }
        case 'abs':
        default: {
          data.content = data.content.map((element) => {
            if (element.type === 'annotation') return element;
            const { data: list, ...other } = element;
            return {
              ...other,
              data: list.map((point) => ({ ...point, y: Math.abs(point.y) })),
            };
          });
          break;
        }
      }
    }

    return data;
  }, [analysis, query]);
  if (!plotContent || !analysis) return null;
  return <PlotObject plot={plotContent} />;
}
