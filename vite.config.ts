import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves project sites from /<repo-name>/.
const base = process.env.VITE_BASE_PATH || '/portfolio/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
})
