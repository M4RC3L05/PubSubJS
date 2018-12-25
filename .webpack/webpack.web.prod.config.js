const path = require('path')

module.exports = {
    target: 'web',
    entry: './indexWeb.ts',
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'pubsub.prod.js',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ }]
    },
    resolve: {
        extensions: ['.js']
    },
    optimization: {
        minimize: true
    }
}
