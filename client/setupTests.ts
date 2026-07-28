import * as matchers from 'vitest-axe/matchers';
import { expect } from 'vitest';

// Extend vitest's expect with axe accessibility matchers (toHaveNoViolations)
expect.extend(matchers);
