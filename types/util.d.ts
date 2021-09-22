import type { Output } from './interfaces';
import { Block, Declaration, Style } from './style';
export declare class Utility {
    colors: {
        [key: string]: string;
    };
    original: string;
    raw: string;
    important: boolean;
    isNegative: boolean;
    id: string;
    rest: string;
    match: RegExpMatchArray;
    value?: string;
    variants: {
        id: string;
        match: RegExpMatchArray;
    }[];
    constructor(raw: string, colors?: {});
    matchPlugin(expression: string): true | undefined;
    matchVariant(expression: string): true | undefined;
    get className(): string;
    static<T>(map?: {
        [key: string]: T;
    }, callback?: (value: T | string) => string): this;
    body<T>(map?: {
        [key: string]: T;
    }, callback?: (value: T | string) => string): this;
    string(callback?: (value: string) => string | undefined): this;
    int(callback?: (value: number) => string): this;
    number(callback?: (value: number) => string): this;
    dimension(callback?: (value: string) => string): this;
    percentage(callback?: (value: number) => string): this;
    ratio(callback?: (a: number, b: number) => string): this;
    color(map?: {
        [key: string]: string;
    }, callback?: ({ r, g, b }: {
        r: number;
        g: number;
        b: number;
    }) => string): this;
    nxl(callback?: (value: number) => string): this;
    sqb(callback?: (value: string) => string): this;
    spacing(): this;
    variable(callback?: (value: string) => string): this;
    callback(func: (value: string) => Output): Output;
    property(property: string | string[], callback?: (value: string) => string): Style | undefined;
    style(callback: (value: string) => Declaration | Declaration[]): Style | undefined;
    css(styles: Block): Style[] | undefined;
}
