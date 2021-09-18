import Processor from '..';
import CleanCSS from 'clean-css';
import {Style} from '../style';

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
    test('container', () => {
        expect(css('container')).toMatchSnapshot();
    });
    test('box-decoration-break', () => {
        expect(css('decoration-slice decoration-clone')).toMatchSnapshot();
    });
    test('display', () => {
        expect(css('grid flex')).toMatchSnapshot();
    });
    test('grid-cols', () => {
        expect(css('grid-cols-10')).toMatchSnapshot();
    });
    test('height', () => {
        expect(css('h-7')).toMatchSnapshot();
    });
});
