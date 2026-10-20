// Ambient type references so plain `tsc --noEmit` understands Vitest global test
// APIs (describe/it/expect, enabled via vitest.config.ts "globals: true") and
// the jest-dom matchers registered by src/test/setup.ts. Vitest itself uses the
// same declarations at runtime.
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />
