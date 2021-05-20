/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const { join, resolve } = require('path');

const addonsRoot = 'addons';

const addonFolders = fs.readdirSync(addonsRoot);

const symlinkRoot = join('pages', 'eln', 'addons');

console.log('clear previous symlinks...');
fs.rmSync(symlinkRoot, { recursive: true, force: true });
fs.mkdirSync(symlinkRoot);

console.log(`found ${addonFolders.length} addons...`);
const createdSymlinks = addonFolders.filter((addonFolder) => {
  const absoluteTarget = resolve(
    process.cwd(),
    addonsRoot,
    addonFolder,
    'pages',
  );

  const symlinkPath = resolve(process.cwd(), join(symlinkRoot, addonFolder));

  try {
    fs.accessSync(absoluteTarget);
    fs.symlinkSync(absoluteTarget, symlinkPath);
    console.log(`${symlinkPath} --> ${absoluteTarget}`);
    return true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(err);
    }
    return false;
  }
});
console.log(`created ${createdSymlinks.length} symlinks`);
