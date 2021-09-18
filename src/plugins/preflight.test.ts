import CleanCSS from 'clean-css';
import Processor from '..';

describe('preflight', () => {
    test('utilities', () => {
        expect(
            new CleanCSS({format: 'beautify'}).minify(
                new Processor()
                    .preflight()
                    .map(style => style.build())
                    .join('')
            ).styles
        ).toMatchSnapshot();
    });
});
