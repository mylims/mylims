const fs = require('fs/promises')
const path = require('path')
const cp = require('child_process')

function spawn(addon) {
  return new Promise((resolve, reject) => {
    const process = cp.spawn('npm.cmd', ['install'], { cwd: path.join('addons', addon) })
    process.on('error', reject)
    process.on('exit', resolve)
  })
}

;(async () => {
  const addons = await fs.readdir('addons')
  await Promise.all(addons.map(addon => spawn(addon)))
  console.log('Done')
})()