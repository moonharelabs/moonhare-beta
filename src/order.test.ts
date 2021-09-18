import {layerOrder, pluginOrder, variantOrder} from './order'

describe('Order', () => {
    test('layerOrder', () => {
        expect(layerOrder).toMatchInlineSnapshot(`
Array [
  "base",
  "components",
  "shortcuts",
  "utilities",
]
`)
    })
    test('pluginOrder', () => {
        expect(pluginOrder).toMatchSnapshot()
    })
    test('variantOrder', () => {
        expect(variantOrder).toMatchSnapshot()
    })
})
