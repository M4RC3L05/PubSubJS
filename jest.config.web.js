module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    globals: {
        'ts-jest': {
            tsConfig: '.tsconfig/tsconfig.web.json'
        }
    }
}
