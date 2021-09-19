import {variantOrder} from './order';
import type {Config} from './interfaces';
import defaultPlugin from './plugins';
import {hsl2hex} from './tools';

const colors: {[key: string]: string} = {};
[
    'red',
    'dark-orange',
    'orange',
    'yellow',
    'lime',
    'bright-green',
    'light-green',
    'green',
    'emerald',
    'teal',
    'light-blue',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'hotpink',
    'pink'
].forEach((name, index) => (colors[name] = hsl2hex(index * 20, 100, 50)));
export const baseConfig: Config = {
    // purge: [],
    prefixer: true,
    attributify: false,
    darkMode: 'class', // or 'media'
    theme: {
        screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1536px'
        },
        colors,
        inset: {}
    },
    variantOrder: variantOrder,
    plugins: [defaultPlugin]
};

export default baseConfig;
