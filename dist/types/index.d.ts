import type { Config, UtilityGenerator, PluginUtils, VariantGenerator, PluginUtilOptions, Block, Container, CSS } from './interfaces';
import { StyleSheet } from './style';
export declare class Processor {
    staticPlugins: Map<string, {
        className: string;
        css: Block;
        options: PluginUtilOptions;
    }>;
    preflighPlugins: Container[];
    dynamicPlugins: Map<string, UtilityGenerator>;
    _variants: Map<string, VariantGenerator>;
    count: number;
    cache: Set<string>;
    _config: Config;
    pluginUtils: PluginUtils;
    constructor(config?: Config);
    resolveConfig(config: Config): Config;
    extract(className: string): Container[] | undefined;
    interpret(classNames: string): {
        success: string[];
        ignored: string[];
        styleSheet: StyleSheet;
    };
    preflight(): Container[];
    e: typeof CSS.escape;
    prefix(selector: string): string;
    config<T>(path: string, defaultValue?: T): T;
    theme<T>(path: string, defaultValue?: T): T;
    variants(path: string, defaultValue?: string[]): string[];
    private addStatic;
    addUtilities(utils: CSS | CSS[], options?: string[] | PluginUtilOptions): void;
    addComponents(utils: CSS | CSS[], options?: string[] | PluginUtilOptions): void;
    addBase(utils: CSS | CSS[], options?: string[] | PluginUtilOptions): void;
    addDynamic(name: string, generator: UtilityGenerator, options?: PluginUtilOptions): void;
    addVariant(name: string, generator: VariantGenerator): void;
}
export default Processor;
