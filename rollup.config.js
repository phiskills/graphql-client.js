import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

const tsConfig = {
  declaration: true,
  declarationDir: 'dist/',
  rootDir: 'src/',
  emitDeclarationOnly: true
}

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: './dist',
      name: 'index'
    },
    plugins: [
      resolve(),   // so Rollup can find `ms`
      commonjs(),  // so Rollup can convert `ms` to an ES module
      typescript(tsConfig) // so Rollup can convert TypeScript to JavaScript
    ]
  },
  // browser-friendly UMD build
  {
    input: 'src/index.ts',
    output: {
      name: 'index',
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(),   // so Rollup can find `ms`
      commonjs(),  // so Rollup can convert `ms` to an ES module
      typescript() // so Rollup can convert TypeScript to JavaScript
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/index.ts',
    external: [],
    plugins: [
      typescript() // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ]
  }
];
