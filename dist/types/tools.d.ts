import { UtilityGenerator } from './interfaces';
export declare function propertyStatic(property: string, map: {
    [key: string]: unknown;
}): UtilityGenerator;
export declare function propertyValues(values: string[], property?: string): UtilityGenerator;
export declare function propertyBody(map: {
    [key: string]: unknown;
}, property?: string): UtilityGenerator;
/** @reference https://git.io/JuD04 **/
export declare const escape: typeof CSS.escape;
export declare const css: (strings: TemplateStringsArray, ...args: unknown[]) => string;
export declare function deepExtend(out: any, ...args: any[]): any;
export declare function rgb2hex(r: number, g: number, b: number): string;
export declare function hex2rgb(h: string): {
    r: number;
    g: number;
    b: number;
};
export declare function hsl2rgb(h: number, s: number, l: number): {
    r: number;
    g: number;
    b: number;
};
export declare function rgb2hsl(r: number, g: number, b: number): {
    h: number;
    s: number;
    l: number;
};
export declare function hsl2hex(h: number, s: number, l: number): string;
export declare function hex2hsl(hex: string): {
    h: number;
    s: number;
    l: number;
};
