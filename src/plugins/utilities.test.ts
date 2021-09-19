import Processor from '..';
import CleanCSS from 'clean-css';

const cleanCss = new CleanCSS({format: 'beautify'});

const processor = new Processor();
function css(className: string, proc = processor) {
    return cleanCss.minify(proc.interpret(className).styleSheet.build()).styles;
}

describe('utilities', () => {
    test('dynamic', () => {
        expect([...processor.dynamicPlugins.keys()]).toMatchSnapshot();
    });

    test('container', () => {
        expect(css('container')).toMatchSnapshot();
    });

    test('container with padding', () => {
        expect(
            css(
                'container',
                new Processor({
                    theme: {
                        container: {padding: '2rem'}
                    }
                })
            )
        ).toMatchSnapshot();
        expect(
            css(
                'container',
                new Processor({
                    theme: {
                        container: {padding: {DEFAULT: '4rem'}}
                    }
                })
            )
        ).toMatchSnapshot();
    });

    test('container with center', () => {
        expect(
            css(
                'container',
                new Processor({
                    theme: {
                        container: {center: true}
                    }
                })
            )
        ).toMatchSnapshot();
    });

    test('container with custom breakpoints', () => {
        expect(
            css(
                'container',
                new Processor({
                    theme: {
                        container: {
                            screens: {
                                mobile: '768px',
                                desktop: '1280px'
                            }
                        }
                    }
                })
            )
        ).toMatchSnapshot();
    });

    test('container with custom breakpoints and padding', () => {
        expect(
            css(
                'container',
                new Processor({
                    theme: {
                        container: {
                            padding: {
                                DEFAULT: '4rem',
                                mobile: '2rem',
                                desktop: '8rem'
                            },
                            screens: {
                                mobile: '768px',
                                desktop: '1280px'
                            }
                        }
                    }
                })
            )
        ).toMatchSnapshot();
    });

    test('box-decoration-break', () => {
        expect(css('decoration-slice decoration-clone')).toMatchSnapshot();
    });

    test('box-sizing', () => {
        expect(css('box-content box-border')).toMatchSnapshot();
    });

    test('display', () => {
        expect(
            css(
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
                ]
                    .reverse()
                    .join(' ')
            )
        ).toMatchSnapshot();
    });

    test('float', () => {
        expect(css('float-right float-none float-left')).toMatchSnapshot();
    });

    test('clear', () => {
        expect(
            css('clear-right clear-none clear-both clear-left')
        ).toMatchSnapshot();
    });

    test('isolation', () => {
        expect(css('isolate isolation-auto')).toMatchSnapshot();
    });

    test('object-fit', () => {
        expect(
            css(
                'object-contain object-cover object-fill object-none object-scale-down'
            )
        ).toMatchSnapshot();
    });

    test('object-position', () => {
        expect(
            css(
                'object-bottom object-center object-left object-right object-top object-left-top object-left-bottom object-right-top object-right-bottom'
            )
        ).toMatchSnapshot();
    });

    test.todo(
        'object-position with config' /*, () => {
        expect(
            css(
                '',
                new Processor({
                    theme: {
                        objectPosition: {}
                    }
                })
            )
        ).toMatchSnapshot();
    }*/
    );

    test('grid-cols', () => {
        expect(css('grid-cols-10')).toMatchSnapshot();
    });

    test('height', () => {
        expect(css('h-7')).toMatchSnapshot();
    });
});
