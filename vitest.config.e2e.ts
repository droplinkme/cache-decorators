// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    sequence: {
      concurrent: false,
      setupFiles: 'list'
    },
    poolOptions: {
      threads: {
        singleThread: true
      }
    },
    exclude: ['<rootDir>/dist', '<rootDir>/build', 'node_modules'],
    include: ['**/*.e2e.test.ts'],
    coverage: {
      include: [
        'src/database/implementations/**/actions/**/*.ts',
        '!src/**/**/index.ts',
      ],
      reporter: ['text', 'json', 'lcov'],
    },
  },
  resolve: {
    alias: {
      '@core': '/src/core',
      '@database': '/src/database',
    },
  },
})