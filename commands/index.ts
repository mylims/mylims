import { listDirectoryFiles } from '@adonisjs/core/build/standalone';

import Application from '@ioc:Adonis/Core/Application';

import * as AddonsManager from '../app/AddonsManager';

/*
|--------------------------------------------------------------------------
| Exporting an array of commands
|--------------------------------------------------------------------------
|
| Instead of manually exporting each file from this directory, we use the
| helper `listDirectoryFiles` to recursively collect and export an array
| of filenames.
|
| Couple of things to note:
|
| 1. The file path must be relative from the project root and not this directory.
| 2. We must ignore this file.
|
*/

export default [
  ...listDirectoryFiles(__dirname, Application.appRoot, ['./commands/index']),
  ...AddonsManager.getCommands()
    .map((commandsPath) =>
      listDirectoryFiles(commandsPath, Application.appRoot),
    )
    .flat(),
];
