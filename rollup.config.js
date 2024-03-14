import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import replace from 'rollup-plugin-replace';
import ts from '@wessberg/rollup-plugin-ts';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    external: ['react'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' },
    ],
    plugins: [
      ts(),
      resolve(),
      babel({
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
      }),
      commonjs(),
    ],
  },
  {
    input: 'src/web3/index.ts',
    external: ['react', 'prop-types'],
    output: [
      { file: 'web3/index.js', format: 'cjs' },
      { file: 'web3/index.esm.js', format: 'es' },
    ],
    plugins: [
      ts(),
      resolve(),
      babel({
        extensions: ['.ts', '.tsx'],
      }),
      commonjs(),
    ],
  },
  // UMD build with inline PropTypes
  {
    input: 'src/index.ts',
    external: ['react'],
    output: [
      {
        name: 'PlaidLink',
        file: pkg.browser,
        format: 'umd',
        globals: {
          react: 'React',
        },
      },
    ],
    plugins: [
      ts(),
      resolve(),
      babel({
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
      }),
      commonjs(),
    ],
  },
  // Minified UMD Build without PropTypes
  {
    input: 'src/index.ts',
    external: ['react'],
    output: [
      {
        name: 'PlaidLink',
        file: pkg['browser:min'],
        format: 'umd',
        globals: {
          react: 'React',
        },
      },
    ],
    plugins: [
      ts(),
      resolve(),
      babel({
        extensions: ['.ts', '.js', '.tsx', '.jsx'],
      }),
      replace({ 'process.env.NODE_ENV': JSON.stringify('production') }),
      commonjs(),
      terser(),
    ],
  },
];
