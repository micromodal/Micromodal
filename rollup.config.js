import eslint from '@rollup/plugin-eslint'
import { babel } from '@rollup/plugin-babel'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'
import filesize from 'rollup-plugin-filesize'

const pkg = require('./package.json')

// dev build if watching, prod build if not
const isProduction = !process.env.ROLLUP_WATCH

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'MicroModal'
    },
    {
      file: pkg.cdn,
      format: 'umd',
      name: 'MicroModal'
    },
    {
      file: pkg.module,
      format: 'es'
    }
  ],
  plugins: [
    eslint({ exclude: 'package.json' }),
    json(),
    babel({ exclude: 'node_modules/**', babelHelpers: 'bundled' }),
    isProduction && terser(),
    isProduction && filesize()
  ]
}
