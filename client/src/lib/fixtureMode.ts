/**
 * Wraps Vite's import.meta.env so that App.tsx can reference fixture-mode
 * configuration without embedding Vite-specific syntax in a file that is
 * compiled by ts-jest under module:CommonJS.
 *
 * In Jest this file is NEVER compiled or executed — jest.config.cjs maps it
 * to src/lib/__mocks__/fixtureMode.ts via moduleNameMapper. The @ts-ignore
 * comments below are a safety net for any toolchain that does reach this file.
 */

/** True only in a Vite dev build when VITE_USE_FIXTURE=true is set in .env. */
// @ts-ignore — import.meta is Vite-only; ts-jest never reaches this file
export const DEV_USE_FIXTURE: boolean =
  // @ts-ignore
  import.meta.env.DEV === true && import.meta.env.VITE_USE_FIXTURE === 'true';

/**
 * The VITE_FIXTURE_RISK_LEVEL env variable value, or undefined when unset.
 * Passed to selectFixture() to pick which fixture response to return.
 */
// @ts-ignore
export const DEV_FIXTURE_LEVEL: string | undefined =
  // @ts-ignore
  import.meta.env.VITE_FIXTURE_RISK_LEVEL as string | undefined;
