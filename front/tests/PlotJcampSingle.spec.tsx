import { test, expect } from '@playwright/experimental-ct-react';

import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';

const initialQuery = {
  xLabel: 'x',
  yLabel: 'y',
};

test('If content is null, returns null', async ({ mount }) => {
  const component = await mount(
    <div>
      <PlotJcampSingle content={null} initialQuery={initialQuery} />
    </div>,
  );

  await expect(component).toBeEmpty();
});
