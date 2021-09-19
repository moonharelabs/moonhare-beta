import type {VariantGenerator, Plugin} from '../interfaces';

type RawBreakpoint = {raw: string};
type MinMaxBreakpoint = {min?: string; max?: string};
type ScreenBreakpoint = RawBreakpoint | MinMaxBreakpoint;

export default (({addVariant, theme}) => {
    const breakpoints = Object.entries(
        theme('screens') as Record<string, string | ScreenBreakpoint>
    ).sort(([, sizeA], [, sizeB]) => sortWeight(sizeA) - sortWeight(sizeB));

    breakpoints.forEach(([name, size], index) => {
        if (typeof size === 'string') {
            const [, nextSize] = breakpoints[index + 1] || [];
            addVariant(name, styleForBreakpoint({min: size}));
            addVariant(
                `<${name}`,
                styleForBreakpoint({
                    max: size.replace(
                        /^-?[0-9]+\.?[0-9]*/,
                        value => +value - 0.1 + ''
                    )
                })
            );
            addVariant(
                `@${name}`,
                styleForBreakpoint(
                    nextSize
                        ? {
                              min: size,
                              max: (nextSize as string).replace(
                                  /^-?[0-9]+\.?[0-9]*/,
                                  value => +value - 0.1 + ''
                              )
                          }
                        : {min: size}
                )
            );
            addVariant(`-${name}`, styleForBreakpoint({max: size}));
            addVariant(
                `\\+${name}`,
                styleForBreakpoint(
                    nextSize
                        ? {min: size, max: nextSize as string}
                        : {min: size}
                )
            );
        } else {
            addVariant(name, styleForBreakpoint(size));
        }
    });

    /*
     * See MDN web docs for more information
     * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes
     */
    [
        'active',
        'any-link',
        'checked',
        'default',
        'disabled',
        'empty',
        'enabled',
        // 'first-child',
        'first',
        'first-of-type',
        'fullscreen',
        'future',
        'focus',
        'focus-visible',
        'focus-within',
        'hover',
        'indeterminate',
        'in-range',
        'invalid',
        // 'last-child',
        'last',
        'last-of-type',
        'left',
        'link',
        'only-child',
        'only-of-type',
        'optional',
        'out-of-range',
        'read-only',
        'read-write',
        'required',
        'right',
        'root',
        'scope',
        'target',
        'valid',
        'visited'
    ].forEach(pseudo => {
        addVariant(pseudo, ({style}) =>
            style.append.push(
                ':' + ['first', 'last'].includes(pseudo)
                    ? pseudo + '-child'
                    : pseudo
            )
        );

        // Not states
        // https://developer.mozilla.org/en-US/docs/Web/CSS/:not
        addVariant('not-' + pseudo, ({style}) =>
            style.append.push(`:not(:${pseudo})`)
        );

        // Group states
        // You'll need to add className="group" to an ancestor to make these work
        // https://github.com/ben-rogerson/twin.macro/blob/master/docs/group.md
        addVariant('group-' + pseudo, ({style}) =>
            style.prepend.push(`group:${pseudo} `)
        );
    });

    /*
     * See MDN web docs for more information
     * https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-elements
     */
    [
        'after',
        'backdrop',
        'before',
        'first-letter',
        'first-line',
        'marker',
        'placeholder',
        'selection'
    ].forEach(pseudo => {
        addVariant(pseudo, ({style}) => style.append.push('::' + pseudo));
    });
    ['even', 'odd'].forEach(pseudo => {
        addVariant(pseudo, ({style}) =>
            style.append.push(`nth-child(${pseudo})`)
        );
    });
    ['even', 'odd'].forEach(pseudo => {
        addVariant(pseudo, ({style}) =>
            style.append.push(`nth-of-type(${pseudo})`)
        );
    });

    addVariant('svg', ({style}) => style.append.push(' svg'));
    addVariant('all', ({style}) => style.append.push(' *'));
    addVariant('children', ({style}) => style.append.push(' > *'));
    addVariant('siblings', ({style}) => style.append.push(' ~ *'));
    addVariant('sibling', ({style}) => style.append.push(' + *'));

    addVariant('ltr', ({style}) => style.append.push("[dir='ltr'] "));
    addVariant('rtl', ({style}) => style.append.push("[dir='rtl'] "));

    // Motion control
    // https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
    addVariant('motion-safe', ({style}) =>
        style.atRules.push('@media (prefers-reduced-motion: no-preference)')
    );
    addVariant('motion-reduce', ({style}) =>
        style.atRules.push('@media (prefers-reduced-motion: reduce)')
    );
    ['dark', 'light'].forEach(type => {
        const at: VariantGenerator = ({style}) =>
                style.atRules.push(`@media (prefers-color-scheme: ${type})`),
            dot: VariantGenerator = ({style}) =>
                style.prepend.push(`.${type} `);
        addVariant('@' + type, at);
        addVariant('.' + type, dot);
        addVariant(type, theme('darkMode') === 'media' ? at : dot);
    });
}) as Plugin;

function styleForBreakpoint(rule: ScreenBreakpoint): VariantGenerator {
    const mediaConditions =
        'raw' in rule
            ? rule.raw
            : [
                  rule.min && `(min-width: ${rule.min})`,
                  rule.max && `(max-width: ${rule.max})`
              ]
                  .filter(Boolean)
                  .join(' and ');
    return ({style}) => style.atRules.push(`@media ${mediaConditions}`);
}

// NOTE: Non-size breakpoints should come first, to avoid using them in the
// +breakpoint definition.
function sortWeight(breakpoint: string | ScreenBreakpoint): number {
    return typeof breakpoint === 'string'
        ? parseInt(breakpoint)
        : Number.NEGATIVE_INFINITY;
}
