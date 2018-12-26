import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: './dist/preumd/index.js',
    output: {
        file: './dist/umd/pubsubjs.dev.js',
        name: 'PubSubJS',
        format: 'umd',
        sourcemap: 'inline'
    },
    plugins: [resolve({ browser: true, jsnext: true, main: true }), commonjs()]
}
