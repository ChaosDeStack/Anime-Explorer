import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',          // fake browser for tests
    globals: true,                 // lets us use test(), expect() without importing
    setupFiles: './src/setupTests.js',
    testTimeout: 20000,            // allow 20 seconds per test (default is 5) for slower computers
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{js,jsx}'],
      // Files that only connect to Firebase or start the app are not tested
      exclude: ['src/main.jsx', 'src/setupTests.js', 'src/firebase.js', 'src/**/*.test.{js,jsx}'],
    },
  },
})