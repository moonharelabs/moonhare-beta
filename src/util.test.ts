import { Utility } from './util';

describe('Utility', () => {
    test('parse class name', () =>
        [[], ['sm'], ['sm', 'hover']].forEach((variants) => {
            [0, 1, 2].forEach((important) => {
                [true, false].forEach((negative) => {
                    const original = `${important === 1 ? '!' : ''}${
                        negative ? '-' : ''
                    }${important === 2 ? '!' : ''}${
                        variants.length ? variants.join(':') + ':' : ''
                    }placeholder-gray-500`; //-placeholder-gray-500
                    const utility = new Utility(original);
                    variants.forEach((variant) =>
                        expect(utility.matchVariant(variant)).toBe(true)
                    );
                    expect(utility.matchPlugin('placeholder')).toBe(true);
                    variants.forEach((variant, index) =>
                        expect(utility.variants[index].id).toBe(variant)
                    );
                    expect(utility.id).toBe('placeholder');
                    expect(utility.important).toBe(!!important);
                    expect(utility.isNegative).toBe(!!negative);
                    expect(utility.match).toContain('placeholder');
                    expect(utility.original).toBe(original);
                    expect(utility.raw).toBe('placeholder-gray-500');
                    expect(utility.rest).toBe(`${negative ? '-' : ''}gray-500`);
                    expect(utility.value).toBe('');
                });
            });
        }));
});
