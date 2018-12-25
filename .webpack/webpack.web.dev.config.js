const path = require('path')

module.exports = {
    target: 'web',
    entry: './indexWeb.js',
    output: {
        path: path.resolve(__dirname, '..', 'umd'),
        filename: 'pubsubjs.dev.js',
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
        minimize: false
    }
}
