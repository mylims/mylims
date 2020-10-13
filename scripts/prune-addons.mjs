import { readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';

const rcFilePath = join(resolve('.'), '.adonisrc.json');
const rcFile = JSON.parse(
  await readFile(rcFilePath, {
    encoding: 'utf-8',
  }),
);
rcFile.providers = rcFile.providers.filter(
  (provider) => provider.includes('addons') === false,
);
await writeFile(rcFilePath, JSON.stringify(rcFile, null, 2));
console.log('Addons pruned.');
