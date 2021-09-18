// @ts-check
/* eslint-env node */

'use strict'

/**
 * An object with ESLint options.
 * @type {import('eslint').Linter.Config}
 */
const options = {
    parser: '@typescript-eslint/parser',
    plugins: ['jest', '@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 9,
        sourceType: 'module',
        project: './tsconfig.json'
    },
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    env: {
        node: true,
        es6: true,
        'jest/globals': true
    }
}

module.exports = options
