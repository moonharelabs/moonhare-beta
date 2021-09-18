import {baseConfig} from './config'

describe('Config', () => {
    test('baseConfig', () => {
        expect(baseConfig).toMatchInlineSnapshot(
            {
                attributify: false,
                darkMode: 'class',
                plugins: expect.any(Array),
                prefixer: true,
                variantOrder: expect.any(Array)
            },
            `
            Object {
              "attributify": false,
              "darkMode": "class",
              "plugins": Any<Array>,
              "prefixer": true,
              "theme": Object {
                "colors": Object {
                  "blue": "#0055ff",
                  "bright-green": "#55ff00",
                  "dark-orange": "#ff5500",
                  "emerald": "#00ffaa",
                  "fuchsia": "#ff00ff",
                  "green": "#00ff55",
                  "hotpink": "#ff00aa",
                  "indigo": "#0000ff",
                  "light-blue": "#00aaff",
                  "light-green": "#00ff00",
                  "lime": "#aaff00",
                  "orange": "#ffaa00",
                  "pink": "#ff0055",
                  "purple": "#aa00ff",
                  "red": "#ff0000",
                  "teal": "#00ffff",
                  "violet": "#5500ff",
                  "yellow": "#ffff00",
                },
                "inset": Object {},
                "screens": Object {
                  "2xl": "1536px",
                  "lg": "1024px",
                  "md": "768px",
                  "sm": "640px",
                  "xl": "1280px",
                },
              },
              "variantOrder": Any<Array>,
            }
        `
        )
    })
})
