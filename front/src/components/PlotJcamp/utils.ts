import { Analysis, getReactPlotJSON } from 'base-analysis';
import { PlotProps } from 'react-plot';

import type { PlotQuery } from './types';

export function getPlotJcamp(
  query: PlotQuery,
  analyses: Analysis[],
  dimensions: Pick<PlotProps, 'width' | 'height' | 'margin'>,
) {
  const { scale, logFilter, xLabel, xUnits, yLabel, yUnits } = query;

  let data = getReactPlotJSON(
    analyses,
    {
      x: { label: xLabel, units: xUnits },
      y: { label: yLabel, units: yUnits },
    },
    {
      xAxis: { label: formatLabels(xLabel, xUnits) },
      yAxis: { label: formatLabels(yLabel, yUnits), scale },
      seriesViewportStyle: { stroke: 'black', strokeWidth: '2px' },
      enforceGrowing: true,
      content: { displayMarkers: false },
      dimensions,
    },
  );

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
}

function formatLabels(label: string, units?: string) {
  if (units) return `${label} [${units}]`;
  return label;
}
