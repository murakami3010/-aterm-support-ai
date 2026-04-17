import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const versionPlugin = () => {
  const versionFile = resolve(__dirname, 'version.json')
  const data = JSON.parse(readFileSync(versionFile, 'utf-8'))
  return {
    name: 'version-increment',
    config(_, { command }) {
      if (command === 'build') {
        data.minor += 1
        writeFileSync(versionFile, JSON.stringify(data) + '\n')
      }
      const version = `${data.major}.${String(data.minor).padStart(3, '0')}`
      return { define: { __APP_VERSION__: JSON.stringify(version) } }
    }
  }
}

const copyAssetsPlugin = () => ({
  name: 'copy-assets',
  closeBundle() {
    const outDir = resolve(__dirname, 'dist/assets')
    mkdirSync(outDir, { recursive: true })
    for (const file of ['diagnosis.png', 'supplementary.png']) {
      copyFileSync(
        resolve(__dirname, 'src/assets', file),
        resolve(outDir, file)
      )
    }
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), versionPlugin(), copyAssetsPlugin()],
})
