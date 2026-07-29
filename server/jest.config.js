const path = require('path');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  testEnvironment: 'node',
  // Run tests from both server and shared directories
  roots: [
    '<rootDir>/src/__tests__',
    path.resolve(__dirname, '../shared/__tests__'),
  ],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': path.resolve(__dirname, '../shared/$1'),
    '^@shared$': path.resolve(__dirname, '../shared/index'),
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.json',
        // Suppress errors from compiling shared files with server tsconfig
        // (rootDir mismatch does not affect runtime correctness)
        diagnostics: {
          ignoreCodes: ['TS6059'],
        },
      },
    ],
  },
};
