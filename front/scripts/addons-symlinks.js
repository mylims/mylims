/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const { join, resolve, relative } = require('path');

const addonsRoot = 'addons';

const addonFolders = fs.readdirSync(addonsRoot);

const symlinkRoot = join('pages', 'eln', 'addons');

console.log('clear previous symlinks...');
fs.rmSync(symlinkRoot, { recursive: true, force: true });
fs.mkdirSync(symlinkRoot);

console.log(`found ${addonFolders.length} addons...`);
const createdSymlinks = addonFolders.filter((addonFolder) => {
  const relativeTarget = relative(
    symlinkRoot,
    join(addonsRoot, addonFolder, 'pages'),
  );

  const symlinkPath = join(process.cwd(), symlinkRoot, addonFolder);

  try {
    fs.accessSync(resolve(symlinkRoot, relativeTarget));
    fs.symlinkSync(relativeTarget, symlinkPath);
    console.log(`${symlinkPath} --> ${relativeTarget}`);
    return true;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error(err);
    }
    return false;
  }
});
console.log(`created ${createdSymlinks.length} symlinks`);
