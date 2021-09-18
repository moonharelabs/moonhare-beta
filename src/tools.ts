import {UtilityGenerator} from './interfaces'
import {dashify} from './style'

export function propertyStatic(
    property: string,
    map: {
        [key: string]: unknown
    }
): UtilityGenerator {
    return util =>
        util
            .static(map)
            .property(dashify(property))
            ?.meta(
                'utilities',
                property,
                undefined,
                Object.keys(map).indexOf(util.rest) + 1
            )
}

export function propertyValues(
    values: string[],
    property?: string
): UtilityGenerator {
    return util =>
        util
            .string(value => (values.includes(value) ? value : undefined))
            .property(property ? dashify(property) : util.id)
            ?.meta(
                'utilities',
                property || util.id,
                undefined,
                values.indexOf(util.value as string) + 1
            )
}

export function propertyBody(
    map: {
        [key: string]: unknown
    },
    property?: string
): UtilityGenerator {
    return util =>
        util
            .body(map)
            .property(property ? dashify(property) : util.id)
            ?.meta(
                'utilities',
                property || util.id,
                undefined,
                Object.keys(map).indexOf(util.rest) + 1
            )
}

/** @reference https://git.io/JuD04 **/
export const escape =
    typeof CSS !== 'undefined' && CSS.escape
        ? CSS.escape
        : (ident: string) =>
              ident.replace(
                  /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g, // eslint-disable-line no-control-regex
                  (ch, asCodePoint) => {
                      if (asCodePoint) {
                          // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                          if (ch === '\0') {
                              return '\uFFFD'
                          }

                          // Control characters and (dependent upon position) numbers get escaped as code points
                          return (
                              ch.slice(0, -1) +
                              '\\' +
                              ch.charCodeAt(ch.length - 1).toString(16) +
                              ' '
                          )
                      }

                      // Other potentially-special ASCII characters get backslash-escaped
                      return '\\' + ch
                  }
              )

export const css = (strings: TemplateStringsArray, ...args: unknown[]) =>
    strings.reduce(
        (acc, currentString, index) =>
            acc + currentString + (args[index] || ''),
        ''
    )

export function deepExtend(out: any, ...args: any[]) {
    out = out || {}

    for (const obj of args) {
        if (!obj) continue

        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object') {
                if (Array.isArray(value))
                    if (out[key]) out[1] = [...out[key], ...value.slice(0)]
                    else out[key] = value.slice(0)
                else out[key] = deepExtend(out[key], value)
            } else out[key] = value
        }
    }

    return out
}
export function rgb2hex(r: number, g: number, b: number) {
    let sr = r.toString(16),
        sg = g.toString(16),
        sb = b.toString(16)

    if (sr.length == 1) sr = '0' + r
    if (sg.length == 1) sg = '0' + g
    if (sb.length == 1) sb = '0' + b

    return '#' + sr + sg + sb
}

export function hex2rgb(h: string) {
    let r: string = '',
        g: string = '',
        b: string = ''

    // 3 digits
    if (h.length == 4) {
        r = h[1] + h[1]
        g = h[2] + h[2]
        b = h[3] + h[3]

        // 6 digits
    } else if (h.length == 7) {
        r = h[1] + h[2]
        g = h[3] + h[4]
        b = h[5] + h[6]
    }

    return {r: parseInt(r, 16), g: parseInt(g, 16), b: parseInt(b, 16)}
}

export function hsl2rgb(h: number, s: number, l: number) {
    // Must be fractions of 1
    s /= 100
    l /= 100

    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0,
        g = 0,
        b = 0

    if (0 <= h && h < 60) {
        r = c
        g = x
        b = 0
    } else if (60 <= h && h < 120) {
        r = x
        g = c
        b = 0
    } else if (120 <= h && h < 180) {
        r = 0
        g = c
        b = x
    } else if (180 <= h && h < 240) {
        r = 0
        g = x
        b = c
    } else if (240 <= h && h < 300) {
        r = x
        g = 0
        b = c
    } else if (300 <= h && h < 360) {
        r = c
        g = 0
        b = x
    }
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return {r, g, b}
}

export function rgb2hsl(r: number, g: number, b: number) {
    // Make r, g, and b fractions of 1
    r /= 255
    g /= 255
    b /= 255

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0
    // Calculate hue
    // No difference
    if (delta == 0) h = 0
    // Red is max
    else if (cmax == r) h = ((g - b) / delta) % 6
    // Green is max
    else if (cmax == g) h = (b - r) / delta + 2
    // Blue is max
    else h = (r - g) / delta + 4

    h = Math.round(h * 60)

    // Make negative hues positive behind 360°
    if (h < 0) h += 360
    // Calculate lightness
    l = (cmax + cmin) / 2

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1)
    l = +(l * 100).toFixed(1)

    return {h, s, l}
}

export function hsl2hex(h: number, s: number, l: number) {
    const {r, g, b} = hsl2rgb(h, s, l)
    return rgb2hex(r, g, b)
}

export function hex2hsl(hex: string) {
    const {r, g, b} = hex2rgb(hex)
    return rgb2hsl(r, g, b)
}
