import cp from 'child_process';
import fs from 'fs/promises';
import path from 'path';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function spawn(addon) {
  return new Promise((resolve, reject) => {
    const process = cp.spawn(npmCommand, ['install'], {
      cwd: path.join('addons', addon),
    });
    process.on('error', reject);
    process.on('exit', resolve);
  });
}

(async () => {
  const addons = await fs.readdir('addons');
  await Promise.all(addons.map((addon) => spawn(addon)));
  console.log('Done');
})();
