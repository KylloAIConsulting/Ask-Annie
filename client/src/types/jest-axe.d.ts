/**
 * Minimal type declarations for jest-axe 8.x.
 * jest-axe does not ship TypeScript declarations.
 * This file must be a script (no top-level imports/exports) so that
 * `declare module 'jest-axe'` registers as a new ambient module declaration
 * rather than an augmentation.
 */

// No top-level imports — file must be a global script.

declare module 'jest-axe' {
  import type { AxeResults } from 'axe-core';

  /** Runs axe accessibility checks on a mounted element or HTML string. */
  function axe(html: Element | string, options?: object): Promise<AxeResults>;

  /** Pass to `expect.extend(toHaveNoViolations)` to register the matcher. */
  const toHaveNoViolations: {
    toHaveNoViolations(results: AxeResults): {
      pass: boolean;
      message(): string | undefined;
      actual: AxeResults['violations'];
    };
  };

  function configureAxe(options?: object): typeof axe;

  export { axe, toHaveNoViolations, configureAxe };
}

/** Side-effect import: calls expect.extend(toHaveNoViolations). No exports. */
declare module 'jest-axe/extend-expect' {}

/** Augments jest's Matchers interface so toHaveNoViolations is recognised by tsc. */
declare namespace jest {
  interface Matchers<R> {
    toHaveNoViolations(): R;
  }
}
