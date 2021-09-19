import {baseConfig} from './config';

describe('Config', () => {
    test('baseConfig', () => {
        expect(baseConfig).toMatchSnapshot({
            attributify: false,
            darkMode: 'class',
            plugins: expect.any(Array),
            prefixer: true,
            variantOrder: expect.any(Array)
        });
    });
});
