export interface PlotQuery {
  xLabel: string;
  yLabel: string;
  xUnits?: string;
  yUnits?: string;
  scale?: 'log' | 'linear';
  logFilter?: 'remove' | 'abs';
}
