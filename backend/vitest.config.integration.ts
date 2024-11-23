import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./tests/*.test.ts'],
    maxConcurrency: 1,
    poolOptions: {
      threads: {
        maxThreads: 1,
        singleThread: true,
      }
    },
    isolate: false,
    fileParallelism: false,
    setupFiles: ['./tests/helpers/setup.ts']
  },
  resolve: {
    alias: {
      tests: '/tests'
    }
  }
})