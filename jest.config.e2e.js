module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', 'unit_integration', 'html'],
    globals: {
        'ts-jest': {
            tsConfig: '.tsconfig/tsconfig.e2e.json'
        }
    }
}
