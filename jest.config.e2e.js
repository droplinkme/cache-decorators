module.exports = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.e2e.test.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov', 'text', 'json-summary'],
  setupFiles: ['reflect-metadata'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
  },
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: [
    'src/database/implementations/**/actions/**/*.ts',
    '!src/**/**/index.ts',
  ]
};
