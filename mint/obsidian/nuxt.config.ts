import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const currentDir = dirname(fileURLToPath(import.meta.url))

export default defineNuxtConfig({
  alias: {
    '@base': '@visualizevalue/mint-app-base',
  },
  css: [
    '@base/assets/styles/index.css',
    join(currentDir, './assets/theme.css'),
  ],
})