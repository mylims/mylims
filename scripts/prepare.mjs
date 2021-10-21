import cp from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const addonsPath = 'build/addons';

function spawn(addon) {
  return new Promise((resolve, reject) => {
    const cwd = path.join(addonsPath, addon);
    const process = cp.spawn(npmCommand, ['ci'], { cwd });
    process.on('error', reject);
    process.on('exit', resolve);
  });
}

(async () => {
  const addons = await fs.readdir(addonsPath);
  console.log(`Preparing ${addons.length} addons...`);
  await Promise.all(addons.map((addon) => spawn(addon)));
  console.log('Done');
})();
