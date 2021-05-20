/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const { join, resolve } = require('path');

const addonsRoot = 'addons';

const addonFolders = fs.readdirSync(addonsRoot);

const symlinkRoot = join('pages', 'eln', 'addons');

console.log('clear previous symlinks...');
try {
  fs.rmSync(symlinkRoot, { recursive: true });
} catch (err) {
  console.log('no previous symlink found...');
}
fs.mkdirSync(symlinkRoot);

console.log(`found ${addonFolders.length} addons...`);
const createdSymlinks = addonFolders.filter((addonFolder) => {
  const relativeTarget = join(addonsRoot, addonFolder, 'pages');

  const symlinkPath = resolve(process.cwd(), join(symlinkRoot, addonFolder));

  try {
    fs.accessSync(relativeTarget);
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
