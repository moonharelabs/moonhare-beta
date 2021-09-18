import Processor from '.'
import CleanCSS from 'clean-css'

const shuffle = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

describe('Processor', () => {
    const processor = new Processor()

    test('sample', () => {
        const run = () => {
            const processor = new Processor()
            const {styleSheet} = processor.interpret(
                shuffle([
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
                ]).join('    ')
            )

            expect(
                new CleanCSS({format: 'beautify'}).minify(styleSheet.build())
                    .styles
            ).toMatchInlineSnapshot(`
                ".container {
                  width: 100%
                }
                @media (min-width:640px) {
                  .container {
                    width: 640px
                  }
                }
                @media (min-width:768px) {
                  .container {
                    width: 768px
                  }
                }
                @media (min-width:1024px) {
                  .container {
                    width: 1024px
                  }
                }
                @media (min-width:1280px) {
                  .container {
                    width: 1280px
                  }
                }
                @media (min-width:1536px) {
                  .container {
                    width: 1536px
                  }
                }
                .decoration-slice {
                  box-decoration-break: slice
                }
                .box-border {
                  box-sizing: border-box
                }
                .@dark:float-right {
                  float: right
                }
                .clear-left {
                  clear: left
                }
                .isolate {
                  isolation: isolate
                }"
            `)
        }
        run()
        run()
    })
})
