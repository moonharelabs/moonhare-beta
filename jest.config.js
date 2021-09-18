/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    clearMocks: true,
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    verbose: true
};
