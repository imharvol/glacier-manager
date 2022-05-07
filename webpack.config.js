import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  entry: './aws-sdk-tobundle.js',
  output: {
    path: resolve(__dirname, 'static'),
    filename: 'aws-sdk-bundle.js'
  },
  mode: process.env.WEBPACK_MODE ?? 'development' // 'production'
}
