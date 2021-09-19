import Processor from '.';
import CleanCSS from 'clean-css';

describe('Processor', () => {
    const processor = new Processor();

    test('sample', () => {
        const processor = new Processor();
        const {styleSheet} = processor.interpret(
            [
                'container',
                'decoration-slice',
                'box-border',
                'clear-left',
                '@dark:float-right',
                'isolate',
                'object-cover',
                'overflow-hidden',
                'static',
                '!-z-30',
                '-!inset-4'
            ].join(' ')
        );

        expect(
            new CleanCSS({format: 'beautify'}).minify(styleSheet.build()).styles
        ).toMatchSnapshot();
    });
});
