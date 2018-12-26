import { uglify } from 'rollup-plugin-uglify'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
    input: './dist/preumd/index.js',
    output: {
        name: 'PubSubJS',
        file: './dist/umd/pubsubjs.prod.js',
        format: 'umd'
    },
    plugins: [
        resolve({ browser: true, jsnext: true, main: true }),
        commonjs(),
        uglify()
    ]
}
