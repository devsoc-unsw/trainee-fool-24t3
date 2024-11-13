import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./tests/**/*.test.ts'],
    poolOptions: {
      threads: {
        maxThreads: 1,
        singleThread: true
      }
    },
    setupFiles: ['./tests/helpers/setup.ts']
  },
  resolve: {
    alias: {
      tests: '/tests'
    }
  }
})