import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.spec.ts'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text-summary', 'lcov', 'text', 'json-summary'],
  setupFiles: ['reflect-metadata'],
  modulePathIgnorePatterns: ['<rootDir>/dist'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@database/(.*)$': '<rootDir>/src/database/$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  moduleDirectories: ['node_modules'],
  collectCoverageFrom: [
    'src/core/common/decorators/**/*.ts',
    '!src/core/common/decorators/**/mock.ts',
    '!src/**/**/index.ts',
  ]
};

export default config;
