import {Plugin} from '../interfaces';
import {Block, dashify} from '../style';

export default (({
    addBase: base,
    addUtilities: add,
    addComponents: component,
    addDynamic: dynamic,
    theme
}) => {
    function Value<P extends string, V extends string>(
        values: V[],
        property: P
    ) {
        add(
            Object.fromEntries(
                values.map(value => [
                    `.${value}`,
                    {[dashify(property)]: value} as {[key in P]: V}
                ])
            ),
            {group: property}
        );
    }

    function nameValue(values: string[], name: string, property = name) {
        add(
            Object.fromEntries(
                values.map(value => [
                    `.${name}-${value}`,
                    {[dashify(property)]: value}
                ])
            ),
            {group: property}
        );
    }

    function nameMap(
        map: Record<string, string>,
        name: string,
        property = name
    ) {
        add(
            Object.fromEntries(
                Object.entries(map).map(([value, css]) => [
                    `.${name}-${value}`,
                    {[dashify(property)]: css}
                ])
            ),
            {group: property}
        );
    }

    // https://tailwindcss.com/docs/container
    component(
        {
            '.container': {
                width: '100%',
                paddingLeft:
                    theme('container.padding.DEFAULT') ||
                    theme('container.padding'),
                paddingRight:
                    theme('container.padding.DEFAULT') ||
                    theme('container.padding'),
                marginRight: theme('container.center'),
                marginLeft: theme('container.center'),
                ...Object.fromEntries(
                    Object.entries(
                        theme('container.screens') || theme('screens')
                    ).map(([screen, size]) => [
                        `@media (min-width: ${size})`,
                        {
                            width: size,
                            paddingLeft: theme(`container.padding.${screen}`),
                            paddingRight: theme(`container.padding.${screen}`)
                        } as Block
                    ])
                )
            }
        },
        {group: 'container'}
    );

    // https://tailwindcss.com/docs/box-decoration-break
    nameValue(['slice', 'clone'], 'decoration', 'boxDecorationBreak');

    // https://tailwindcss.com/docs/box-sizing
    nameMap(
        {
            border: 'border-box',
            content: 'content-box'
        },
        'box',
        'boxSizing'
    );

    // https://tailwindcss.com/docs/display
    add(
        Object.fromEntries(
            [
                'block',
                'inline-block',
                'inline',
                'flex',
                'inline-flex',
                'table',
                'inline-table',
                'table-caption',
                'table-cell',
                'table-column',
                'table-column-group',
                'table-footer-group',
                'table-header-group',
                'table-row-group',
                'table-row',
                'flow-root',
                'grid',
                'inline-grid',
                'contents',
                'list-item',
                'hidden'
            ].map(value => [
                '.' + value,
                {display: value === 'hidden' ? 'none' : value}
            ])
        ),
        {group: 'display'}
    );

    // https://tailwindcss.com/docs/float
    nameValue(['right', 'left', 'none'], 'float');

    // https://tailwindcss.com/docs/clear
    nameValue(['left', 'right', 'both', 'none'], 'clear');

    // https://tailwindcss.com/docs/isolation
    add(
        {
            '.isolate': {
                isolation: 'isolate'
            },
            '.isolation-auto': {
                isolation: 'auto'
            }
        },
        {group: 'isolation'}
    );

    // https://tailwindcss.com/docs/object-fit
    nameValue(['contain', 'cover', 'fill', 'none', 'scale-down'], 'objectFit');

    // https://tailwindcss.com/docs/object-position
    nameMap(theme('objectPosition') ?? {}, 'objectPosition');

    // https://tailwindcss.com/docs/overflow
    const overflow = ['contain', 'cover', 'fill', 'none', 'scale-down'];
    nameValue(overflow, 'overflow');
    nameValue(overflow, 'overflow-x');
    nameValue(overflow, 'overflow-y');

    dynamic('bg', utility =>
        utility
            .color(
                theme('backgroundColor') || theme('colors'),
                ({r, g, b}) => `rgba(${r},${g},${b},var(--mh-bg-opacity))`
            )
            .sqb()
            .variable()
            .css({'--mh-bg-opacity': '1', backgroundColor: utility.value})
            ?.map(style => style.meta('utilities', 'backgroundColor'))
    );

    dynamic('h|w', utility => {
        const name = utility.id === 'w' ? 'width' : 'height';
        return utility
            .body(theme(name))
            .sqb()
            .spacing()
            .ratio()
            .dimension()
            .nxl(number => `${(number - 3) * 8 + 48}rem`)
            .variable()
            .property(name)
            ?.meta('utilities', name, undefined);
    });
    dynamic('space-(x|y)', utility =>
        utility
            .body(theme('space'))
            .sqb()
            .spacing()
            .dimension()
            .variable()
            .css(
                utility.match[1] === 'x'
                    ? {
                          '--tw-space-x-reverse': '0',
                          'margin-right': `calc(${utility.value} * var(--tw-space-x-reverse))`,
                          'margin-left': `calc(${utility.value} * calc(1 - var(--tw-space-x-reverse)))`
                      }
                    : {
                          '--tw-space-y-reverse': '0',
                          'margin-top': `calc(${utility.value} * calc(1 - var(--tw-space-y-reverse)))`,
                          'margin-bottom': `calc(${utility.value} * var(--tw-space-y-reverse))`
                      }
            )
            ?.map(style => {
                style.selectors = style.selectors.map(
                    selector => selector + '> :not([hidden]) ~ :not([hidden])'
                );
                return style.meta(
                    'utilities',
                    'space',
                    undefined,
                    (utility.match[1] === 'x' ? 2 : 1) +
                        (utility.isNegative ? 2 : 0)
                );
            })
    );

    dynamic('grid-(cols|rows)', utility => {
        const type = utility.match[1] === 'cols' ? 'columns' : 'rows';
        const group =
            type === 'rows' ? 'gridTemplateRows' : 'gridTemplateColumns';

        return (
            utility
                .body(theme(group))
                .sqb()
                .string(value => (value === 'none' ? value : undefined))
                .property(`grid-template-${type}`)
                ?.meta('utilities', group, undefined, 1) ||
            utility
                .int()
                .variable()
                .property(
                    `grid-template-${type}`,
                    value => `repeat(${value}, minmax(0, 1fr))`
                )
                ?.meta('utilities', group, undefined, 2)
        );
    });
}) as Plugin;

/*
export const a = () =>
    ({

        // https://tailwindcss.com/docs/position
        [`(${position.join('|')})$`]: propertyStatic(
            'position',
            Object.fromEntries(position.map((value) => [value, value]))
        ),

        // https://tailwindcss.com/docs/top-right-bottom-left
        inset: (utility, { theme }) =>
            utility
                .body(theme('inset'))
                .sqb()
                .spacing()
                .ratio()
                .dimension()
                .variable()
                .callback(() => {
                    switch (utility.id) {
                        case 'top':
                        case 'right':
                        case 'bottom':
                        case 'left':
                            return utility
                                .property(utility.id)
                                ?.meta('utilities', 'inset', undefined, 4);
                        case 'inset-x':
                            return utility
                                .property(['right', 'left'])
                                ?.meta('utilities', 'inset', undefined, 3);
                        case 'inset-y':
                            return utility
                                .property(['top', 'bottom'])
                                ?.meta('utilities', 'inset', undefined, 2);
                        case 'inset':
                            return utility
                                .property(['top', 'right', 'bottom', 'left'])
                                ?.meta('utilities', 'inset', undefined, 1);
                    }
                }),

        // https://tailwindcss.com/docs/visibility
        '(in)?visible$': propertyStatic('visibility', {
            visible: 'visible',
            invisible: 'hidden',
        }),

        // https://tailwindcss.com/docs/z-index
        z: (utility, { theme }) =>
            utility
                .body(theme('zIndex'))
                .int()
                .variable()
                .property('z-index')
                ?.meta('utilities', 'zIndex'),
    } as Record<string, UtilityGenerator>);

function propertyStatic(
    property: string,
    map: {
        [key: string]: unknown;
    }
): UtilityGenerator {
    return (util) =>
        util
            .static(map)
            .property(dashify(property))
            ?.meta(
                'utilities',
                property,
                undefined,
                Object.keys(map).indexOf(util.rest) + 1
            );
}

function propertyBody(
    map: {
        [key: string]: unknown;
    },
    property?: string
): UtilityGenerator {
    return (util) =>
        util
            .body(map)
            .property(property ? dashify(property) : util.id)
            ?.meta(
                'utilities',
                property || util.id,
                undefined,
                Object.keys(map).indexOf(util.rest) + 1
            );
}

const display = ;


const overflow = ;

const overscroll = ['auto', 'contain', 'none'];

const position = ['static', 'fixed', 'absolute', 'relative', 'sticky'];
*/
