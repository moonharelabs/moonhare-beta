import {Utility} from './util';
import type {
    Value,
    Meta,
    Block,
    CSS,
    LayerName,
    Declaration,
    Container,
    Style,
    InlineAtRule,
    StyleSheet
} from './style';

export type {
    Value,
    Meta,
    Block,
    CSS,
    LayerName,
    Declaration,
    Container,
    Style,
    InlineAtRule,
    StyleSheet
};

export type Output = Container | Container[] | undefined;

export type UtilityGenerator = (utility: Utility, utils: PluginUtils) => Output;
export type VariantGenerator = (tools: {style: Style}) => void;

export type PluginUtilOptions = {
    variants?: string[];
    completions?: string[];
    respectPrefix?: boolean;
    respectImportant?: boolean;
    selector?: string;
    layer?: string;
    offset?: number;
    order?: number;
    group?: string;
};

export interface PluginUtils {
    addDynamic: (
        key: string,
        generator: UtilityGenerator,
        options?: PluginUtilOptions
    ) => void;
    addUtilities: (utilities: CSS | CSS[], options?: PluginUtilOptions) => void;
    addComponents: (
        components: CSS | CSS[],
        options?: PluginUtilOptions
    ) => void;
    addBase: (baseStyles: CSS | CSS[]) => void;
    addVariant: (name: string, generator: VariantGenerator) => void;
    e: (selector: string) => string;
    prefix: (selector: string) => string;
    theme: <T>(path: string, defaultValue?: T) => T;
    variants: (path: string, defaultValue?: string[]) => string[];
    config: <T>(path: string, defaultValue?: T) => T;
}

export type Plugin = (utils: PluginUtils) => void;

export interface Config {
    separator?: string;
    important?: boolean | string;
    darkMode?: 'class' | 'media';
    theme?: Record<string, any>;
    variantOrder?: string[];
    plugins?: Plugin[];
    prefix?: string;

    // ===== Depreacted =====
    /**
     * @deprecated no longer needed
     */
    purge?: unknown;
    /**
     * @deprecated no longer needed
     */
    variants?: {[key: string]: string[]};
    /**
     * Fallback
     */
    [key: string]: any;
}
