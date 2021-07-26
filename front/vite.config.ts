import { resolve } from 'path';

import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fileSync: resolve(__dirname, 'src/addons/fileSync/pages/index.html'),
      },
    },
  },
});
