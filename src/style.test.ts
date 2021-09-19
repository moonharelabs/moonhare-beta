import {parseCSS} from './style';

describe('Styles', () => {
    test('parseCSS', () => {
        expect(
            parseCSS('.container', {
                width: '100%',
                paddingLeft: undefined,
                paddingRight: undefined,
                marginRight: undefined,
                marginLeft: undefined,
                '@media (min-width: 640px)': {
                    width: '640px'
                    //paddingLeft: undefined,
                    //paddingRight: undefined,
                }

                //'@media (min-width: 768px)': {
                //    width: '768px',
                //    paddingLeft: undefined,
                //    paddingRight: undefined,
                //},
                //'@media (min-width: 1024px)': {
                //    width: '1024px',
                //    paddingLeft: undefined,
                //    paddingRight: undefined,
                //},
                //'@media (min-width: 1280px)': {
                //    width: '1280px',
                //    paddingLeft: undefined,
                //    paddingRight: undefined,
                //},
                //'@media (min-width: 1536px)': {
                //    width: '1536px',
                //    paddingLeft: undefined,
                //    paddingRight: undefined,
                //},
            }).length
        ).toMatchInlineSnapshot(`2`);
    });
});
