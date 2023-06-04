import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');
const name = pkg.main.replace(/\.js$/, '');

export default [
  {
    input: 'src/index.ts',
    external: Object.keys({ ...pkg.devDependencies, ...pkg.dependencies }),
    plugins: [
      nodeResolve(),
      typescript(),
      commonjs({
        exclude: 'node_modules',
        ignoreGlobal: true,
      }),
    ],
    output: [
      {
        file: `${name}.js`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `${name}.mjs`,
        format: 'es',
        sourcemap: true,
      },
    ],
  },
];
