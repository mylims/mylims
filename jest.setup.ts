import Module from 'module';

import { Application } from '@adonisjs/core/build/standalone';
import 'reflect-metadata';

// @ts-expect-error: Need to teach Node about loading TypeScript files.
Module._extensions['.ts'] = Module._extensions['.js'];

const app = new Application(__dirname, 'test');
app.setup();
app.registerProviders();

beforeAll(async () => {
  await app.bootProviders();
  app.requirePreloads();
  await app.start();
});

afterAll(async () => {
  await app.shutdown();
});
