import * as csstype from 'csstype';
export declare type Value = null | undefined | string | number;
export interface Meta {
    layer: string;
    order: number;
    offset: number;
    variants: string[];
}
export interface Block extends csstype.PropertiesFallback<Value, Value>, csstype.PropertiesHyphenFallback<Value, Value> {
    [property: string]: Value | Value[] | Block;
}
export interface CSS {
    [selector: string]: Block;
}
export declare type LayerName = 'base' | 'utilities' | 'components';
export declare class Declaration {
    property: string;
    value: string;
    important: boolean;
    constructor(property: string, value: string, important?: boolean);
    build(): string;
}
export declare class Container {
    nodes: (Declaration | Container)[];
    _meta: Meta;
    important: boolean;
    constructor(nodes?: (Declaration | Container)[]);
    meta(layer?: string, plugin?: string, order?: number, offset?: number, variants?: string[]): this;
    build(): string;
}
export declare class Style extends Container {
    selectors: string[];
    prepend: string[];
    append: string[];
    atRules: string[];
    nodes: Declaration[];
    constructor(selectors?: string | string[], style?: Declaration | Declaration[]);
    selectorText(selectorText?: string): string | undefined;
    clone(selectors?: string | string[], nodes?: Declaration | Declaration[]): Style;
    build(): string;
}
export declare class InlineAtRule extends Container {
    name: string;
    params: string;
    constructor(name: string, params: string);
    build(): string;
}
declare type sheetVariants = {
    [variant: string]: sheetVariants | Container[];
};
declare type sheetLayers = Record<string, sheetVariants>;
export declare class StyleSheet {
    layers: sheetLayers;
    variantOrder: string[];
    constructor();
    add(...styles: Container[]): void;
    buildGroup(styles?: Container[]): string;
    buildVariant(variantOrder: string[], variants?: sheetVariants): string;
    build(variantOrder?: string[]): string;
}
export declare function dashify(str: string): string;
export declare function parseCSS(parent: string, obj: Block, root?: Style): Style[];
export {};
