import type {Output} from './interfaces';
import {Block, Declaration, parseCSS, Style} from './style';
import {escape, hex2hsl, hex2rgb, hsl2rgb} from './tools';

export class Utility {
    colors: {[key: string]: string};
    original: string;
    raw: string;
    important = false;
    isNegative = false;
    id = '';
    rest = '';
    match: RegExpMatchArray = [];
    value?: string = '';
    variants: {id: string; match: RegExpMatchArray}[] = [];
    constructor(raw: string, colors = {}) {
        this.colors = colors;
        this.original = raw; // -!placeholder-real-gray-300
        this.raw = raw.replace(/^(!-?|-!?)/, match => {
            this.important = match !== '-';
            this.isNegative = match !== '!';
            return '';
        }); // placeholder-real-gray-300
    }
    matchPlugin(expression: string) {
        const match = this.raw.match(`^${expression}`);
        if (match) {
            this.id = match[0];
            this.rest =
                (this.isNegative ? '-' : '') +
                this.raw.slice(match[0].length + 1);
            this.match = match;
            return true;
        }
    }
    matchVariant(expression: string) {
        const match = this.raw.match(`^${expression}:`);
        if (match) {
            this.variants.push({id: expression, match});
            this.raw = this.raw.slice(match[0].length);
            return true;
        }
    }
    get className() {
        return '.' + escape(this.original); // .-placeholder-real-gray-300
    }
    static<T>(
        map: {[key: string]: T} = {},
        callback = (value: T | string) => value + ''
    ) {
        if (!this.value)
            if ((this.raw || 'DEFAULT') in map)
                this.value = callback(map[this.raw || 'DEFAULT']);
        return this;
    }
    body<T>(
        map: {[key: string]: T} = {},
        callback = (value: T | string) => value + ''
    ) {
        if (!this.value)
            if ((this.rest || 'DEFAULT') in map) {
                this.value = callback(map[this.rest || 'DEFAULT']);
            }
        return this;
    }
    string(
        callback: (value: string) => string | undefined = (value: string) =>
            value + ''
    ) {
        if (!this.value) this.value = callback(this.rest);
        return this;
    }
    int(callback = (value: number) => value + '') {
        if (!this.value && /^-?\d+$/.test(this.rest))
            this.value = callback(+this.rest);
        return this;
    }
    number(callback = (value: number) => value + '') {
        if (!this.value && /^-?(\d+(\.\d+)?)+$/.test(this.rest))
            this.value = callback(+this.rest);
        return this;
    }
    dimension(callback = (value: string) => value + '') {
        if (!this.value && /^(\d+(\.\d+)?)+\w+$/.test(this.rest))
            this.value = callback(this.rest);
        return this;
    }
    percentage(callback = (value: number) => value + '') {
        if (!this.value && /^-?(\d+(\.\d+)?)+%$/.test(this.rest))
            this.value = callback(+this.rest);
        return this;
    }
    ratio(callback = (a: number, b: number) => (a / b) * 100 + '%') {
        if (!this.value) {
            const match = this.rest.match(/^(-?\d+)\/(-?\d+)$/);
            if (match) this.value = callback(+match[1], +match[2]);
        }
        return this;
    }
    color(
        map: {[key: string]: string} = this.colors,
        callback = ({r, g, b}: {r: number; g: number; b: number}) =>
            `rgba(${r},${g},${b},var(--mh-opacity));)`
    ) {
        if (!this.value)
            if ((this.rest || 'DEFAULT') in map) {
                const value = hex2rgb(map[this.rest || 'DEFAULT']);
                if (value) this.value = callback(value);
            } else if (/^\w+-\d+$/.test(this.rest)) {
                const match = this.rest.match(
                    /^(\w+)-(\d+)$/
                ) as RegExpMatchArray;
                if (match[1] in map) {
                    const hsl = hex2hsl(map[match[1]]);
                    hsl.l = 100 - (+match[2] * 7) / 90;
                    this.value = callback(hsl2rgb(hsl.h, hsl.s, hsl.l));
                }
            }
        return this;
    }
    nxl(callback = (value: number) => value + '') {
        if (!this.value && /^-?\d*xl$/.test(this.rest))
            this.value = callback(this.rest === 'xl' ? 1 : +this.rest);
        return this;
    }
    sqb(callback = (value: string) => value) {
        if (!this.value) {
            const match = this.rest.match(/\[(.+)\]$/)?.[1];
            if (match) this.value = callback(match.replace(/_/g, ' '));
        }
        return this;
    }
    spacing() {
        return this.number(number =>
            number === 0 ? '0px' : number / 4 + 'rem'
        );
    }
    variable(callback = (value: string) => `var(--${value})`) {
        if (!this.value) {
            const match = this.rest.match(/^\$([\w-]+)$/)?.[1];
            if (match) this.value = callback(match);
        }
        return this;
    }
    callback(func: (value: string) => Output) {
        if (!this.value) return;
        return func(this.value);
    }
    property(property: string | string[], callback = (value: string) => value) {
        if (this.value)
            return new Style(
                this.className,
                Array.isArray(property)
                    ? property.map(
                          prop =>
                              new Declaration(
                                  prop,
                                  callback(this.value as string)
                              )
                      )
                    : new Declaration(property, callback(this.value))
            );
    }
    style(callback: (value: string) => Declaration | Declaration[]) {
        if (this.value) return new Style(this.className, callback(this.value));
    }

    css(styles: Block) {
        if (this.value) return parseCSS(this.className, styles);
    }
}
