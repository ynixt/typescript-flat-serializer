import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import del from 'rollup-plugin-delete';
import typescript from 'rollup-plugin-typescript2';

const pkg = require('./package.json');

export default [
  {
    input: 'src/index.ts',
    external: Object.keys({ ...pkg.devDependencies, ...pkg.dependencies }),
    plugins: [
      del({ targets: 'dist/*' }),
      nodeResolve(),
      typescript({
        clean: true,
        tsconfig: './tsconfig.build.json',
      }),
      commonjs({
        exclude: 'node_modules',
        ignoreGlobal: true,
      }),
      terser(),
    ],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        exports: 'named',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
        exports: 'named',
      },
    ],
  },
];
