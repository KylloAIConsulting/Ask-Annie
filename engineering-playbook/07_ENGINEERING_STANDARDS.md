# 07 — Engineering Standards

> **Playbook chapter:** 7 of 12
> **Last reviewed:** 2026-07-29

---

## Purpose

Engineering standards define the baseline of quality and consistency expected of all code that enters a project. They exist so that every engineer on the team can read, understand, and modify any part of the codebase without needing to ask how it works or adjust to a different style.

Standards are not about preference. They are about reducing cognitive load, preventing avoidable defects, and making the codebase maintainable by people who were not present when it was written.

---

## Scope

This chapter applies to all production code and the tests, configuration, and documentation that accompany it. It covers:

- Code style and formatting
- Naming conventions
- Code review process and standards
- Definition of done
- Documentation standards
- Version control practices

It does not cover testing strategy (chapter 08) or deployment practices (chapter 11).

---

## Standard Process

### 1. Formatting and Linting

All projects must have automated formatting and linting configured and enforced in CI before the first line of feature code is written.

- **Formatting:** use a deterministic formatter (Prettier for JavaScript/TypeScript, Black for Python, gofmt for Go). Formatting is not a code review concern — the formatter decides.
- **Linting:** use a linter appropriate to the language (ESLint for JavaScript/TypeScript, flake8/ruff for Python). Linting rules must be agreed at project start and documented in the project's README.
- **CI enforcement:** the build must fail if formatting or linting checks fail. A "we'll fix it later" policy produces a codebase that no one fixes.

### 2. Naming Conventions

Names are the primary form of documentation in code. Follow these principles:

- Names should describe what something is or does, not how it is implemented
- Boolean variables and functions that return booleans should read as yes/no questions (`isValid`, `hasPermission`, `shouldRetry`)
- Functions should be named for the action they perform (`createUser`, `fetchInvoice`, `validateSchema`)
- Avoid abbreviations except for universally understood domain terms
- Be consistent: if the rest of the codebase uses `userId`, do not introduce `user_id` or `uid`
- Follow the language's community conventions (camelCase for JavaScript, snake_case for Python, PascalCase for types and components)

### 3. Code Review

All code that enters the main branch must be reviewed by at least one engineer who did not write it. Code review is a quality control step, not a gatekeeping ritual.

**What reviewers should assess:**
- Does the code do what it claims to do?
- Is it correct at the edges — empty inputs, missing data, concurrent access?
- Is it secure — no injection vectors, no hardcoded secrets, appropriate access controls?
- Is it readable — will a new team member understand it without asking the author?
- Is it tested — are the tests present, correct, and meaningful?
- Does it match project conventions — naming, structure, patterns?

**What reviewers should not do:**
- Demand stylistic changes that the formatter would handle
- Block a merge over personal preference when multiple approaches are equally valid
- Leave reviews open for more than one working day without comment

**Review response expectations:**
- Authors should respond to all review comments before requesting re-review
- Blocking comments must be resolved; non-blocking suggestions may be deferred with a note
- If a comment sparks a design discussion, take it to a synchronous conversation rather than resolving it in review comments

### 4. Definition of Done

A piece of work is done when all of the following are true:

- [ ] The acceptance criteria from the user story are met
- [ ] All new code has been reviewed and approved
- [ ] All tests pass (unit, integration, and any applicable end-to-end)
- [ ] New functionality has appropriate test coverage
- [ ] Code is formatted and lint-free
- [ ] TypeScript (or equivalent) compiles with no errors or warnings
- [ ] Documentation is updated if the change affects public interfaces, APIs, or setup instructions
- [ ] The change has been manually tested in the development environment
- [ ] The change is merged to the main branch

### 5. Documentation Standards

Write documentation for the next engineer, not for yourself.

- **Inline comments:** explain *why*, not *what*. Code describes what it does; comments explain why it does it that way. A comment that merely restates the code adds noise.
- **Function and module documentation:** document the contract (inputs, outputs, preconditions, side effects) for any function or module with a non-obvious interface.
- **README:** every project must have a README that covers: what it is, how to run it locally, how to run tests, how to configure it, and where to go for more information.
- **Architecture documentation:** maintain a current architecture document as described in chapter 04.
- **Changelog:** maintain a CHANGELOG or equivalent record of significant changes, at minimum for every production release.

### 6. Version Control Practices

- Work on feature branches. The main branch should always be in a deployable state.
- Branch names should be descriptive: `feature/user-auth`, `fix/rate-limit-header`, `chore/upgrade-dependencies`.
- Commit messages should be clear and follow the Conventional Commits format: `type(scope): description` where type is one of `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `style`.
- Squash or rebase before merging to keep the main branch history readable.
- Tag releases with semantic version numbers.

---

## Checklists

### New Project Setup Checklist

- [ ] Formatter configured and enforced in CI
- [ ] Linter configured and enforced in CI
- [ ] Branch protection rules enabled on the main branch (require review, require passing CI)
- [ ] Commit message convention documented in README or CONTRIBUTING.md
- [ ] Definition of done agreed with the team
- [ ] README covers local setup, test execution, and configuration

### Code Review Checklist

- [ ] Code does what the story's acceptance criteria require
- [ ] Edge cases handled (empty, null, oversized, concurrent)
- [ ] No obvious security issues (injection, hardcoded credentials, missing authorisation)
- [ ] Tests present and meaningful
- [ ] Naming is clear and consistent with the rest of the codebase
- [ ] No commented-out code committed
- [ ] Documentation updated if public interfaces changed

---

## Best Practices

**Automate what can be automated.**
Formatting debates, import ordering, and style consistency are not conversations worth having. Automate them and spend code review effort on correctness, security, and design.

**Write code for the reader.**
The author of a piece of code reads it once. Every other engineer reads it many times. Optimise for reading, not writing.

**Small, focused commits.**
A commit that does one thing is easier to review, easier to revert, and easier to understand in the history than a commit that does many things. If a commit message needs "and" to describe it, consider splitting it.

**Leave the codebase better than you found it.**
The Boy Scout rule: if you touch a file, leave it slightly cleaner than it was. This is not a licence for scope creep in a PR — it means fixing an obvious naming issue or adding a missing comment while you are in the file anyway.

**Consistency over perfection.**
An imperfect convention followed consistently is better than a perfect convention applied inconsistently. When in doubt, match the existing pattern rather than introducing a new one.

---

## Lessons Learned

*This section is updated after each project. Add a bullet with the date and a brief description of what was learned.*

- *(No entries yet. Add the first lesson after your next project.)*

---

*← [06 AI Collaboration](06_AI_COLLABORATION.md) · [08 Testing & Quality →](08_TESTING_AND_QUALITY.md)*
