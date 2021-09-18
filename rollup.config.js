import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json';

export default {
    input: 'src/index.ts',
    plugins: [
        terser(),
        typescript(), // so Rollup can convert TypeScript to JavaScript
    ],
    output: [
        { file: pkg.main, format: 'cjs', exports: 'named' },
        { file: pkg.module, format: 'es' },
        {
            file: pkg.browser,
            format: 'umd',
            name: 'moonHare',
            exports: 'named',
        },
    ],
};
