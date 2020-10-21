import { getAddons } from 'App/AddonsManager';

test('getAddons returns an array of addons', () => {
  const addons = getAddons();
  expect(Array.isArray(addons)).toBe(true);
});
