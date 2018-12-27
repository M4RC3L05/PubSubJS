module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['/node_modules/', 'e2e'],
    globals: {
        'ts-jest': {
            tsConfig: '.tsconfig/tsconfig.web.json'
        }
    }
}
