import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // The production site is hosted at the root of qiuxiaomiao.com.
  // Keeping this explicit prevents generated JS/CSS URLs from inheriting
  // a repository sub-path when the hosting provider builds the project.
  base: '/',
  plugins: [react()],
  build: {
    target: 'es2020',
  },
})
