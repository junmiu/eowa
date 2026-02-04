import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  input: join(__dirname, 'src/register.mjs'),
  output: [
    {
      file: join(__dirname, 'dist/web-components.js'),
      format: 'esm',
      sourcemap: true
    },
    {
      file: join(__dirname, 'dist/web-components.min.js'),
      format: 'esm',
      sourcemap: true,
      plugins: [terser()]
    },
    {
      file: join(__dirname, 'dist/web-components.umd.js'),
      format: 'umd',
      name: 'WebComponents',
      sourcemap: true
    },
    {
      file: join(__dirname, 'dist/web-components.umd.min.js'),
      format: 'umd',
      name: 'WebComponents',
      sourcemap: true,
      plugins: [terser()]
    }
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true
    }),
    resolve({
      browser: true,
      exportConditions: ['browser', 'import', 'default']
    })
  ]
};
