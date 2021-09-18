import { baseConfig } from './config';
import type {
    Config,
    UtilityGenerator,
    PluginUtils,
    VariantGenerator,
    PluginUtilOptions,
} from './interfaces';
import { Block, Container, CSS, parseCSS, Style, StyleSheet } from './style';
import { deepExtend, escape } from './tools';
import { Utility } from './util';

export class Processor {
    staticPlugins: Map<
        string,
        { className: string; css: Block; options: PluginUtilOptions }
    > = new Map();
    preflighPlugins: Container[] = [];
    dynamicPlugins: Map<string, UtilityGenerator> = new Map();
    _variants: Map<string, VariantGenerator> = new Map();
    count = 0;
    _config: Config;
    pluginUtils: PluginUtils = {
        addDynamic: (key, generator, options) =>
            this.addDynamic(key, generator, options),
        addUtilities: (utilities, options) =>
            this.addUtilities(utilities, options),
        addComponents: (utilities, options) =>
            this.addComponents(utilities, options),
        addBase: (utilities) => this.addBase(utilities),
        addVariant: (name, generator) => this.addVariant(name, generator),
        e: (ident) => escape(ident),
        prefix: (selector) => this.prefix(selector),
        theme: (path, defaultValue) => this.theme(path, defaultValue),
        config: (path, defaultValue) => this.config(path, defaultValue),
        variants: (path, defaultValue) => [
            ...this.variants(path, defaultValue),
        ],
    };

    constructor(config: Config = {}) {
        this._config = this.resolveConfig(config);
        for (const plugin of this._config.plugins ?? []) {
            plugin(this.pluginUtils);
        }
    }

    resolveConfig(config: Config): Config {
        return deepExtend({}, baseConfig, config);
    }

    extract(className: string): Container[] | undefined {
        const utility = new Utility(className);
        let matched = true;
        let styles: Container[] | undefined;
        if (this._config.prefix)
            className = className.replace(
                new RegExp(`^${this._config.prefix}`),
                ''
            );
        while (matched) {
            matched = false;
            for (const [variant] of this._variants) {
                if (utility.matchVariant(variant)) matched = true;
            }
        }

        for (const [expr, { className: realClass, css, options }] of this
            .staticPlugins) {
            if (
                new RegExp(expr).test(
                    (utility.isNegative ? '-' : '') + utility.raw
                )
            ) {
                className = realClass.replace(
                    '.' + escape((utility.isNegative ? '-' : '') + utility.raw),
                    '.' + className
                );
                styles = parseCSS(
                    options.respectPrefix ? this.prefix(className) : className,
                    css
                );
                if (options.respectImportant && this._config.important)
                    styles.forEach((style) => (style.important = true));
                return styles.map((style) =>
                    style.meta(
                        options.layer,
                        options.group,
                        options.order,
                        options.offset
                    )
                );
                break;
            }
        }

        if (!styles)
            for (const [expr, generator] of this.dynamicPlugins) {
                if (utility.matchPlugin(expr)) {
                    const style = generator(utility, this.pluginUtils);
                    if (style) {
                        styles = Array.isArray(style) ? style : [style];
                        break;
                    }
                }
            }

        if (styles) {
            for (const variant of utility.variants) {
                styles.forEach((style) => {
                    if (style instanceof Style) {
                        style._meta.variants.push(variant.id);
                        (this._variants.get(variant.id) as VariantGenerator)({
                            style,
                        });
                    }
                });
            }
            if (utility.important)
                styles.forEach((style) => (style.important = true));

            return styles;
        }
    }

    interpret(classNames: string) {
        const classes = classNames.split(/\s+/g);
        const success: string[] = [];
        const ignored: string[] = [];
        const styleSheet = new StyleSheet();
        for (const className of classes) {
            const result = this.extract(className);
            if (result) {
                success.push(className);
                styleSheet.add(...result);
            } else ignored.push(className);
        }
        styleSheet.variantOrder = this._config.variantOrder ?? [];
        return {
            success,
            ignored,
            styleSheet,
        };
    }

    preflight() {
        return this.preflighPlugins;
    }

    e = escape;

    prefix(selector: string): string {
        return selector.replace(/(?=[\w])/, this._config.prefix ?? '');
    }

    config<T>(path: string, defaultValue?: T): T {
        try {
            const value =
                new Function('_', `return _.${path}`)(this._config) ||
                defaultValue;
            return value;
        } catch {
            return defaultValue as T;
        }
    }

    theme<T>(path: string, defaultValue?: T): T {
        return this.config(`theme.${path}`, defaultValue);
    }

    variants(path: string, defaultValue?: string[]) {
        return this._variants.keys();
    }

    private addStatic(
        className: string,
        utility: Block,
        options: PluginUtilOptions
    ) {
        options = {
            layer: 'utilities',
            variants: [],
            respectPrefix: true,
            respectImportant: true,
            ...options,
        };

        options.order = options.group ? undefined : this.count++;

        const classes = className.match(/\.(?:[-\w\u{0080}-\u{FFFF}]|\\.)+/gu);

        if (classes)
            this.staticPlugins.set(
                '^' + classes.map((cls) => cls.slice(1)).join('$|^') + '$',
                { className, css: utility, options }
            );
    }

    addUtilities(
        utils: CSS | CSS[],
        options: string[] | PluginUtilOptions = {}
    ) {
        if (Array.isArray(options)) options = { variants: options };
        options = {
            layer: 'utilities',
            variants: [],
            respectPrefix: true,
            respectImportant: true,
            ...options,
        };
        let offset = 0; // set offset
        const addCSS = (utils: CSS) => {
            for (const [className, styles] of Object.entries(utils)) {
                this.addStatic(className, styles, {
                    ...(options as PluginUtilOptions),
                    offset: offset++,
                });
            }
        };
        if (Array.isArray(utils)) utils.forEach((util) => addCSS(util));
        else addCSS(utils);
    }
    addComponents(
        utils: CSS | CSS[],
        options: string[] | PluginUtilOptions = {}
    ) {
        if (Array.isArray(options)) options = { variants: options };
        return this.addUtilities(utils, { layer: 'components', ...options });
    }
    addBase(utils: CSS | CSS[], options: string[] | PluginUtilOptions = {}) {
        if (Array.isArray(options)) options = { variants: options };
        options = {
            layer: 'base',
            variants: [],
            respectPrefix: true,
            respectImportant: true,
            ...options,
        };
        let offset = 0; // set offset

        const addCSS = (utils: CSS) => {
            for (const [className, styles] of Object.entries(utils)) {
                const css = parseCSS(className, styles).map((style) =>
                    style.meta(
                        (options as PluginUtilOptions).layer,
                        (options as PluginUtilOptions).group,
                        (options as PluginUtilOptions).order || this.count++,
                        offset++
                    )
                );
                this.preflighPlugins.push(...css);
            }
        };
        if (Array.isArray(utils)) utils.forEach((util) => addCSS(util));
        else addCSS(utils);
    }

    addDynamic(
        name: string,
        generator: UtilityGenerator,
        options: PluginUtilOptions = {}
    ) {
        options = {
            layer: 'utilities',
            variants: [],
            respectPrefix: true,
            respectImportant: true,
            ...options,
        };
        this.dynamicPlugins.set(name, (util, tools) => {
            const styles = generator(util, tools);
            if (styles) {
                if (Array.isArray(styles))
                    styles.forEach((style) => {
                        style.meta(
                            options.layer,
                            options.group,
                            options.order,
                            undefined
                        );
                        if (options.respectImportant && this._config.important)
                            style.important = true;
                    });
                else {
                    styles.meta(
                        options.layer,
                        options.group,
                        options.group ? undefined : this.count++,
                        undefined
                    );
                    if (options.respectImportant && this._config.important)
                        styles.important = true;
                }
                return styles;
            }
        });
    }

    addVariant(name: string, generator: VariantGenerator) {
        if (!this._config.variantOrder?.includes(name))
            this._config.variantOrder?.push(name);
        this._variants.set(name, generator);
    }
}

export default Processor;
