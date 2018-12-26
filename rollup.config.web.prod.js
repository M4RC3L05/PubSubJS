import { uglify } from 'rollup-plugin-uglify'

export default {
    input: './dist/preumd/index.js',
    dest: './dist/umd/pubsubjs.prod.js',
    format: 'umd',
    output: {
        name: 'PubSubJS'
    },
    plugins: [uglify()]
}
