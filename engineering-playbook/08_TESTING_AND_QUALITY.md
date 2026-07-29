# 08 — Testing & Quality

> **Playbook chapter:** 8 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Testing is the primary mechanism by which an engineering team gains justified confidence that the software it builds does what it is supposed to do. Quality assurance is the broader practice of preventing defects from reaching users — of which testing is one part alongside design review, code review, and monitoring.

This chapter defines our test strategy, coverage expectations, testing levels, and quality gates for every project.

---

## Scope

This chapter applies to all production software we build. It covers unit, integration, end-to-end, accessibility, and performance testing. It addresses both the strategy for what to test and the standards for how to write tests that are useful rather than merely present.

---

## Standard Process

### 1. Define the Test Strategy Early

Agree on the test strategy before writing production code. The strategy should answer:

- What test levels will be used (unit, integration, end-to-end)?
- What tooling will be used at each level?
- What coverage targets are expected?
- What constitutes a quality gate (what must pass before a merge or deployment)?
- Who is responsible for writing tests — is testing integrated into feature development or handled separately?

Document the agreed strategy in the project README or a dedicated `docs/testing.md` file.

### 2. Test Levels

**Unit tests** verify that individual functions, classes, or components behave correctly in isolation. External dependencies (databases, APIs, file systems) are replaced with test doubles. Unit tests are fast, deterministic, and numerous.

- Write unit tests for all business logic, validation rules, and utility functions
- Test the happy path, known edge cases, and failure modes
- Keep unit tests free of implementation detail — test behaviour, not internals

**Integration tests** verify that multiple components work correctly together. They exercise real interactions between layers (e.g. route handlers calling service functions, service functions calling repositories). They may use real databases (test instances) or carefully designed stubs.

- Write integration tests for all API endpoints
- Cover authentication and authorisation at the integration level
- Test that validation errors produce the correct response shape and status code

**End-to-end tests** verify complete user journeys through the deployed application. They are slower and more brittle than unit or integration tests and should be used selectively.

- Cover the critical user paths that, if broken, would immediately impact users
- Do not attempt to cover every edge case at this level — that belongs in unit tests
- Run end-to-end tests against a staging environment, not production

**Accessibility tests** verify that the application is usable by people who rely on assistive technology.

- Run automated axe-core checks on every screen and significant component
- Supplement automated checks with keyboard navigation testing
- Supplement both with screen reader testing on the primary target platform for high-risk interfaces

**Performance tests** verify that the application meets its response time and throughput targets.

- Define performance budgets at the architecture stage
- Run load tests against staging before significant releases
- Monitor real-user performance metrics in production

### 3. Coverage Standards

Coverage is a signal, not a target. A test suite with 90% line coverage and poor assertions is worse than one with 70% coverage and rigorous assertions.

Minimum expectations:

- **Business logic and validation:** 100% — there are no acceptable untested code paths
- **API routes:** 100% of routes and documented status codes covered by integration tests
- **UI components:** all interactive states, loading states, error states, and empty states tested
- **Accessibility:** all screens pass automated axe-core checks

Coverage below these minimums is a quality gate failure.

### 4. Test Quality Standards

A test is only valuable if it will catch a real defect. Apply these standards to every test written:

- **A failing test must mean something is wrong.** A test that can pass when the code it tests is broken is worse than no test.
- **Tests must be deterministic.** A test that sometimes passes and sometimes fails (a "flaky" test) erodes confidence in the entire suite. Fix or delete flaky tests immediately.
- **Tests must be independent.** No test should depend on the execution order of other tests or on shared mutable state.
- **Assertions must be specific.** `expect(result).toBeDefined()` does not test correctness. Assert the specific value or shape expected.
- **Test names must describe the scenario and expected behaviour.** `it('returns 400 when text is empty')` is a useful test name. `it('test 1')` is not.

### 5. Quality Gates

The following must pass before any merge to the main branch:

- All tests pass
- No linting errors
- TypeScript (or equivalent) compiles with no errors
- New code meets coverage minimums
- All accessibility checks pass

The following must pass before any production deployment:

- All of the above
- End-to-end tests pass against staging
- Performance benchmarks met (if defined)
- Security scan shows no new critical or high vulnerabilities

---

## Checklists

### New Feature Test Checklist

- [ ] Unit tests written for all business logic in the feature
- [ ] Unit tests cover happy path, known edge cases, and failure modes
- [ ] Integration tests cover all new API endpoints and documented status codes
- [ ] Accessibility tests run on all new or modified screens (automated axe-core)
- [ ] All assertions are specific — not just `toBeDefined()` or `toBeTruthy()`
- [ ] Test names describe the scenario and expected outcome
- [ ] Tests are deterministic — no reliance on date/time, random values, or test order
- [ ] Coverage minimums met for business logic and routes

### Test Suite Health Checklist

- [ ] No flaky tests in the suite (tests that fail intermittently)
- [ ] No tests that duplicate each other's coverage without adding new scenarios
- [ ] All tests run in CI on every pull request
- [ ] Coverage report generated and visible in CI output
- [ ] Test execution time reviewed — slow suites are maintained to stay fast

---

## Best Practices

**Test behaviour, not implementation.**
Tests that assert on internal state or private function calls break every time the implementation changes, even when the behaviour is correct. Test what the code does, not how it does it.

**Write the test before the fix.**
When fixing a bug, write a failing test that reproduces the bug first. Then fix the code. This confirms the test is sensitive to the defect and guards against regression.

**Make it easy to run tests locally.**
If running the test suite locally requires significant setup, engineers will avoid running it. Keep the local test command simple (`npm test`) and fast.

**Invest in test infrastructure.**
Test helpers, factory functions, and fixture builders that make it easy to set up test scenarios are worth the investment. Time spent building test infrastructure pays back in every test written after it.

**Treat test code as production code.**
Test code has the same readability, maintainability, and quality requirements as production code. Test code that is difficult to understand cannot be trusted.

**Delete tests that no longer provide value.**
A test for a feature that no longer exists, or a test that duplicates another test without adding coverage, is noise. Delete it.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next project.)*

---

*← [07 Engineering Standards](07_ENGINEERING_STANDARDS.md) · [09 Sprint Management →](09_SPRINT_MANAGEMENT.md)*
