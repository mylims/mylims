import { readFileSync } from 'fs';
import { join } from 'path';

import { test, expect } from '@playwright/experimental-ct-react';

import { PlotJcampSingle } from '@/components/PlotJcamp/PlotJcampSingle';

const initialQuery = { xLabel: 'Vg', yLabel: 'Id_dens' };

const jcampContent = readFileSync(
  join(__dirname, '../testFiles/b1505.jdx'),
  'utf8',
);

test('If content is null, returns null', async ({ mount }) => {
  const component = await mount(
    <div>
      <PlotJcampSingle content={null} initialQuery={initialQuery} />
    </div>,
  );

  await expect(component).toBeEmpty();
});

test('Basic functionality case', async ({ mount, page }) => {
  await mount(
    <PlotJcampSingle content={jcampContent} initialQuery={initialQuery} />,
  );

  const xLabel = page.locator(`g > text:has-text("${initialQuery.xLabel}")`);
  const yLabel = page.locator(`g > text:has-text("${initialQuery.yLabel}")`);
  await expect(xLabel).toBeVisible();
  await expect(yLabel).toBeVisible();
});

test('Display a log scale', async ({ mount, page }) => {
  await mount(
    <PlotJcampSingle
      content={jcampContent}
      initialQuery={{ ...initialQuery, scale: 'log', logFilter: 'remove' }}
    />,
  );

  const xLabel = page.locator(`g > text:has-text("${initialQuery.xLabel}")`);
  const yLabel = page.locator(`g > text:has-text("${initialQuery.yLabel}")`);
  await expect(xLabel).toBeVisible();
  await expect(yLabel).toBeVisible();
});

test('Display units', async ({ mount, page }) => {
  const units = { xUnits: 'V', yUnits: 'A/mm' };
  await mount(
    <PlotJcampSingle
      content={jcampContent}
      initialQuery={{ ...initialQuery, ...units }}
    />,
  );

  const xLabel = page.locator(
    `g > text:has-text("${initialQuery.xLabel} [${units.xUnits}]")`,
  );
  const yLabel = page.locator(
    `g > text:has-text("${initialQuery.yLabel} [${units.yUnits}]")`,
  );
  await expect(xLabel).toBeVisible();
  await expect(yLabel).toBeVisible();
});
