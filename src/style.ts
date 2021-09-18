import * as csstype from 'csstype'
import {layerOrder, pluginOrder} from './order'

export type Value = null | undefined | string | number

export interface Meta {
    layer: string
    order: number
    offset: number
    variants: string[]
}

export interface Block
    extends csstype.PropertiesFallback<Value, Value>,
        csstype.PropertiesHyphenFallback<Value, Value> {
    [property: string]: Value | Value[] | Block
}

export interface CSS {
    [selector: string]: Block
}

export type LayerName = 'base' | 'utilities' | 'components'

export class Declaration {
    property: string
    value: string
    important: boolean
    constructor(property: string, value: string, important = false) {
        this.property = property
        this.value = value
        this.important = important
    }

    build() {
        return `${this.property}:${this.value}`
    }
}

export class Container {
    nodes: (Declaration | Container)[]
    _meta: Meta = {
        layer: 'components',
        order: 0,
        offset: 0,
        variants: []
    }
    important = false

    constructor(nodes: (Declaration | Container)[] = []) {
        this.nodes = nodes
    }

    meta(
        layer = this._meta.layer,
        plugin?: string,
        order = this._meta.order,
        offset = this._meta.offset,
        variants = this._meta.variants
    ) {
        this._meta = {
            layer,
            order: plugin
                ? pluginOrder[plugin as keyof typeof pluginOrder]
                : order,
            offset,
            variants
        }
        return this
    }

    build(): string {
        return this.nodes.map(node => node.build()).join('')
    }
}

export class Style extends Container {
    selectors: string[] = []
    prepend: string[] = []
    append: string[] = []
    atRules: string[] = []
    nodes: Declaration[]
    constructor(
        selectors: string | string[] = [],
        style: Declaration | Declaration[] = []
    ) {
        super()
        if (Array.isArray(selectors)) this.selectors = selectors
        else this.selectorText(selectors)
        this.nodes = Array.isArray(style) ? style : [style]
    }

    selectorText(selectorText?: string) {
        if (selectorText) this.selectors = selectorText.split(/\s*,\s*/)
        else
            return this.selectors
                .map(
                    selector =>
                        `${this.prepend.join('')}${selector}${this.append.join(
                            ''
                        )}`
                )
                .join(',')
    }

    clone(
        selectors: string | string[] = [...this.selectors],
        nodes: Declaration | Declaration[] = [...this.nodes]
    ) {
        const style = new Style(selectors, nodes)
        style.atRules = [...this.atRules]
        style._meta = {...this._meta}
        return style
    }

    build() {
        let css = `${this.selectorText(undefined)}{${this.nodes
            .map(decl => {
                if (this.important) decl.important = true
                return decl.build()
            })
            .join(';')}}`
        this.atRules.forEach(rule => (css = `${rule}{${css}}`))
        return css
    }
}

export class InlineAtRule extends Container {
    name: string
    params: string
    constructor(name: string, params: string) {
        super()
        this.name = name
        this.params = params
    }
    build() {
        return `${this.name} ${this.params};`
    }
}

type sheetVariants = {[variant: string]: sheetVariants | Container[]}
type sheetLayers = Record<string, sheetVariants>
export class StyleSheet {
    layers: sheetLayers = {}
    variantOrder: string[] = []
    constructor() {} // eslint-disable-line
    add(...styles: Container[]) {
        styles.forEach(style => {
            let layer =
                this.layers[style._meta.layer] ||
                (this.layers[style._meta.layer] = {})

            for (const variant of style._meta.variants) {
                layer = (layer[variant] ||
                    (layer[variant] = {})) as sheetVariants
            }
            ;((layer.DEFAULT || (layer.DEFAULT = [])) as Container[]).push(
                style
            )
        })
    }
    buildGroup(styles?: Container[]) {
        return styles
            ? styles
                  .sort(
                      (a: Container, b: Container) =>
                          a._meta.order - b._meta.order ||
                          a._meta.offset - b._meta.offset
                  )
                  .map(style => {
                      return style.build()
                  })
                  .join('')
            : ''
    }
    buildVariant(variantOrder: string[], variants?: sheetVariants): string {
        return variants
            ? this.buildGroup(variants.DEFAULT as Container[]) +
                  variantOrder
                      .map(variant =>
                          this.buildVariant(
                              variantOrder,
                              variants[variant] as sheetVariants
                          )
                      )
                      .join('')
            : ''
    }
    build(variantOrder = this.variantOrder) {
        return layerOrder
            .map(layer => this.buildVariant(variantOrder, this.layers[layer]))
            .join('')
    }
}
const IMPORTANT = /\s*!important\s*$/i

const UNITLESS = [
    'box-flex',
    'box-flex-group',
    'column-count',
    'flex',
    'flex-grow',
    'flex-positive',
    'flex-shrink',
    'flex-negative',
    'font-weight',
    'line-clamp',
    'line-height',
    'opacity',
    'order',
    'orphans',
    'tab-size',
    'widows',
    'z-index',
    'zoom',
    'fill-opacity',
    'stroke-dashoffset',
    'stroke-opacity',
    'stroke-width'
]

export function dashify(str: string) {
    return str
        .replace(/([A-Z])/g, '-$1')
        .replace(/^ms-/, '-ms-')
        .toLowerCase()
}

function decl(parent: Style, name: string, value?: string | number | null) {
    name = dashify(name)
    let propValue = '',
        important = false
    if (value === undefined || value === null) return
    else if (typeof value === 'number') {
        if (value === 0 || UNITLESS.indexOf(name) > -1)
            propValue = value.toString()
        else propValue = value + 'px'
    } else if (IMPORTANT.test(value)) {
        propValue = value.replace(IMPORTANT, '')
        important = true
    } else propValue = value

    parent.nodes.push(new Declaration(name, propValue, important))
}

export function parseCSS(parent: string, obj: Block, root?: Style) {
    if (!root) root = new Style(parent)

    const output = [root]
    for (const [name, value] of Object.entries(obj)) {
        if (value === null || typeof value === 'undefined') {
            continue
        } else if (name[0] === '@') {
            const parts = name.match(
                /@(\S+)(\s+([\W\w]*)\s*)?/
            ) as RegExpMatchArray
            if (parts) {
                if (typeof value == 'object' && !Array.isArray(value))
                    output.push(
                        ...parseCSS(
                            parent,
                            value,
                            root.clone(undefined, [])
                        ).map(sty => {
                            sty.atRules.push(`@${parts[1]} ${parts[3]}`)
                            return sty
                        })
                    )
            }
        } else if (Array.isArray(value)) {
            for (const i of value) {
                decl(root, name, i)
            }
        } else if (typeof value === 'object') {
            const selector =
                name[0] === '&'
                    ? name.replace(/&/g, parent)
                    : `${parent} ${name.replace(/&/g, parent)}`
            output.push(...parseCSS(parent, value, root.clone(selector, [])))
        } else {
            decl(root, name, value)
        }
    }
    return output
}
