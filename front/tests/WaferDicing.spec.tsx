import { test, expect } from '@playwright/experimental-ct-react';
import { BrowserRouter as Router } from 'react-router-dom';

import { SimpleWaferDicing } from '@/components/WaferDicing';

test.describe('SimpleWaferDicing', () => {
  test('Known diameter', async ({ mount }) => {
    const component = await mount(
      <SimpleWaferDicing diameter="2" sampleCode="#001" size={300} />,
    );
    await expect(component).toContainText('A4');
    await expect(component).not.toContainText('A5');
  });

  test('Chip diameter', async ({ mount }) => {
    const component = await mount(
      <SimpleWaferDicing diameter="Chip" sampleCode="#001" size={300} />,
    );
    await expect(component).toContainText('A1');
    await expect(component).not.toContainText('A2');
  });

  test('Unknown diameter', async ({ mount }) => {
    const component = await mount(
      <SimpleWaferDicing diameter="8" sampleCode="#001" size={300} />,
    );
    await expect(component).toContainText('A70');
    await expect(component).not.toContainText('A71');
  });

  test('Overflow of selection', async ({ mount }) => {
    let pickedItems = [];
    for (let index = 1; index <= 10; index++) {
      const val = `A${index}`;
      pickedItems.push({ index: val, label: val });
    }

    const component = await mount(
      <Router>
        <SimpleWaferDicing
          diameter="2"
          sampleCode="#001"
          size={300}
          pickedItems={pickedItems}
        />
      </Router>,
    );
    await expect(component).toContainText('A4');
    await expect(component).not.toContainText('A5');

    await expect(component).toContainText('+6');
  });
});
