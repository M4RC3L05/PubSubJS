module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testPathIgnorePatterns: ['/node_modules/', 'e2e'],
    globals: {
        'ts-jest': {
            tsConfig: '.tsconfig/tsconfig.node.json'
        }
    }
}
