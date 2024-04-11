// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    exclude: ['<rootDir>/dist', '<rootDir>/build', 'node_modules'],
    include: ['**/*.spec.ts'],
    coverage: {
      include: [
        'src/core/common/decorators/**/*.ts',
        '!src/core/common/decorators/**/mock.ts',
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