/*
|--------------------------------------------------------------------------
| AdonisJs Server
|--------------------------------------------------------------------------
|
| The contents in this file is meant to bootstrap the AdonisJs application
| and start the HTTP server to accept incoming connections. You must avoid
| making this file dirty and instead make use of `lifecycle hooks` provided
| by AdonisJs service providers for custom code.
|
*/

import 'reflect-metadata';
import childProcess from 'child_process';

import { Ignitor } from '@adonisjs/core/build/standalone';
import sourceMapSupport from 'source-map-support';

sourceMapSupport.install({ handleUncaughtExceptions: false });

function parent() {
  return new Promise((resolve) => {
    const child = childProcess.fork(`${__filename}`, [], {
      env: {
        ...process.env,
        CHILD: 'true',
      },
    });

    child.on('message', (message: string) => {
      if (message === 'restart') {
        child.kill();
        resolve();
      }
    });
  });
}

function child() {
  const httpServer = new Ignitor(__dirname).httpServer();
  httpServer.start();
}

function starter() {
  if (process.env.CHILD) {
    child();
  } else {
    parent().then(starter);
  }
}
starter();
