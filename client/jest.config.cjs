const path = require('path');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '.',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    '^@shared/(.*)$': path.resolve(__dirname, '../shared/$1'),
    '^@shared$': path.resolve(__dirname, '../shared/index'),
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/fileMock.cjs',
    // Redirect the Vite-only fixtureMode module to a Jest-safe stub so that
    // ts-jest never compiles the file containing import.meta.env.
    '/lib/fixtureMode': '<rootDir>/src/lib/__mocks__/fixtureMode.ts',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.test.json',
        // isolatedModules: true is set in tsconfig.test.json rather than here
        // (the ts-jest transform option for it is deprecated in ts-jest v29).
        // This prevents ts-jest from following the import chain to
        // fixtureMode.ts and encountering its import.meta.env references.
        // Full cross-file type checking is still performed by
        // `npm run typecheck` (tsc --noEmit) which uses the production tsconfig.
      },
    ],
  },
};
