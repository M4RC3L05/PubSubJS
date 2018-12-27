module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            tsConfig: '.tsconfig/tsconfig.node.json'
        }
    }
}
