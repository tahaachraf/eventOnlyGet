import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base = nom du dépôt : le site est servi sur https://tahaachraf.github.io/eventOnlyGet/
export default defineConfig({
  base: '/eventOnlyGet/',
  plugins: [react()],
})