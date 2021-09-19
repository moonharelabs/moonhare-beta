import typescript from '@rollup/plugin-typescript';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
    {
        input: 'src/index.ts',
        plugins: [terser(), typescript()],
        output: [
            {file: pkg.main, format: 'cjs', sourcemap: true},
            {file: pkg.module, format: 'es', sourcemap: true},
            {
                name: 'moonHare',
                file: pkg.browser,
                format: 'umd',
                sourcemap: true
            },
            {
                name: 'moonHare',
                file: 'docs/moonhare.js',
                format: 'umd',
                sourcemap: true
            }
        ]
    },
    {
        input: 'src/cli.ts',
        plugins: [terser(), typescript()],
        output: [{file: 'cli.js', format: 'cjs', sourcemap: true}]
    }
];
