import { fromRollup } from '@web/dev-server-rollup';
import replace from '@rollup/plugin-replace';

const replacePlugin = fromRollup(replace);

export default {
  open: true,
  watch: true,
  rootDir: 'src',
  appIndex: 'index.html',
  port: 8080,
  
  // Node.js module resolution for npm packages
  nodeResolve: {
    exportConditions: ['development'],
  },
  
  // Preserve symlinks for monorepo setups
  preserveSymlinks: true,
  
  // Development server features
  http2: false,
  
  // File watching
  clearTerminalOnReload: false,
  
  plugins: [
    replacePlugin({
      'process.env.NODE_ENV': '"development"',
      preventAssignment: true,
    }),
  ],
  
  // MIME types
  mimeTypes: {
    '**/*.js': 'js',
  },
};
