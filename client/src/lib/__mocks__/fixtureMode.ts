/**
 * Jest stub for src/lib/fixtureMode.ts.
 *
 * Loaded instead of the real module via jest.config.cjs moduleNameMapper.
 * Fixture mode is always disabled in tests; AnalysingScreen tests pass a
 * mock `analyse` prop directly instead.
 */
export const DEV_USE_FIXTURE = false;
export const DEV_FIXTURE_LEVEL: string | undefined = undefined;
