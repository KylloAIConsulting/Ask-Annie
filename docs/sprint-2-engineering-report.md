# Ask Annie — Sprint 2 Engineering Report

**Sprint period:** Sprint 2  
**Report date:** 2026-07-29  
**Status:** Complete

---

## 1. Completed Scope

Sprint 2 delivered a complete, production-ready React frontend for the Ask Annie user journey. All planned tasks (T1–T8) were implemented, reviewed by the Product Owner, and merged.

| Task | Description | Status |
|---|---|---|
| T1.1 | `appReducer` + `Screen` state machine | ✅ |
| T1.2 | Layout component + skip link | ✅ |
| T1.3 | Header with main navigation | ✅ |
| T2.1 | Typed API client (`analyseText`, `analyseImage`, `submitFeedback`) | ✅ |
| T2.2 | Development fixtures (`FIXTURE_LOWER_RISK`, `FIXTURE_CONCERNING`, `FIXTURE_HIGH_RISK`) | ✅ |
| T3.1 | WelcomeScreen | ✅ |
| T4.1–T4.5 | SubmitScreen (text/image mode, validation, file handling) | ✅ |
| T5.1–T5.4 | AnalysingScreen (loading, cancel, abort, timeout, retry) | ✅ |
| T6.1–T6.5 | ResultsScreen (risk levels, conditional sections, human review notice) | ✅ |
| T7.1–T7.3 | FeedbackScreen (positive/negative/not-sure, written feedback, outcome, success, error, skip) | ✅ |
| T8 | Integration review, polish, integration tests, engineering report | ✅ |

---

## 2. Architecture Changes

### State machine

`appReducer` (client/src/state/appReducer.ts) owns all application state. There is no component-local state for the current screen — App dispatches actions and passes screen-level data down as props.

```
AppState = {
  currentScreen: Screen          // 'welcome' | 'submit' | 'analysing' | 'results' | 'feedback'
  submittedText: string
  submittedFile: File | null
  submittedContext: string
  analysisResult: AnnieResponse | null
  analysisError: string | null
}
```

Five actions drive all transitions:

| Action | Effect |
|---|---|
| `NAVIGATE` | Change `currentScreen` (no other state change) |
| `SET_SUBMISSION` | Store text/file/context before navigating to Analysing |
| `ANALYSIS_SUCCESS` | Store result, clear error, auto-navigate to `results` |
| `ANALYSIS_ERROR` | Store error message, clear result (error displayed by AnalysingScreen) |
| `RESET_SESSION` | Return to `initialAppState` (Welcome, all submission and result state cleared) |

### Analysis function isolation

`analyseForSubmission` is a `useCallback` memoised on the submission state fields (`submittedText`, `submittedFile`, `submittedContext`). It is passed as a prop to `AnalysingScreen`, which keeps `import.meta.env` out of components and makes unit testing straightforward (pass a mock function, no module mocking required).

### Fixture mode

`client/src/lib/fixtureMode.ts` wraps `import.meta.env.DEV` and the `VITE_USE_FIXTURE` / `VITE_FIXTURE_RISK_LEVEL` environment variables. The real file is never compiled by Jest (Jest maps the import path to `src/lib/__mocks__/fixtureMode.ts` which stubs both exports to safe defaults). Vite's dead-code elimination removes the fixture branches from production bundles.

### Abort signal tracking

`AnalysingScreen` tracks the abort reason via a ref (`'running'` | `'timed_out'`):
- `'running'` — set by Cancel button or component unmount; the catch block is silent.
- `'timed_out'` — set by the internal 30 s timeout before `controller.abort()` is called; the catch block shows the timeout error state.

---

## 3. Shared Types and Configuration Added

All shared types live in `shared/` and are imported by both client and server via the `@shared/*` TypeScript path alias.

| Export | File | Description |
|---|---|---|
| `AnnieResponseSchema` / `AnnieResponse` | `shared/annieResponse.ts` | 11-field validated response type |
| `RiskLevel` | `shared/annieResponse.ts` | `'LOWER_RISK' \| 'CONCERNING' \| 'HIGH_RISK'` |
| `ConfidenceLevel` | `shared/annieResponse.ts` | `'LOW' \| 'MEDIUM' \| 'HIGH'` |
| `ANALYSE_TEXT_MAX_LENGTH` (10 000) | `shared/requestSchemas.ts` | Used by SubmitScreen textarea and server validation |
| `ANALYSE_CONTEXT_MAX_LENGTH` (500) | `shared/requestSchemas.ts` | Used by SubmitScreen context field and server validation |
| `FeedbackAnswer` | `shared/requestSchemas.ts` | `'yes' \| 'not_sure' \| 'no'` |
| `FeedbackOutcome` | `shared/requestSchemas.ts` | 5 outcome values for the optional outcome selector |
| `FeedbackRequest` | `shared/requestSchemas.ts` | Validated payload for POST /api/feedback |
| `UPLOAD_MAX_FILE_SIZE` (10 MB) | `shared/uploadConfig.ts` | Client-side validation and server multer config |
| `UPLOAD_ALLOWED_MIME_TYPES` | `shared/uploadConfig.ts` | `['image/jpeg', 'image/png', 'image/webp']` |

---

## 4. Screen Flow

```
Welcome
  │  "Check a message"
  ▼
Submit
  │  "Check with Annie" (SET_SUBMISSION + NAVIGATE 'analysing')
  ▼
Analysing ──────── Cancel ──────► Submit
  │  ANALYSIS_SUCCESS (auto-navigates)
  │  ANALYSIS_ERROR (stays on Analysing, shows error state)
  ▼
Results
  ├── "Leave feedback"   ──────► Feedback
  └── "Check another"   ──────► Welcome (RESET_SESSION)

Feedback
  ├── Submit success     ──────► (confirmation state) ──► Welcome (RESET_SESSION)
  ├── Submit failure     ──────► (error state; Try again | Skip)
  └── Skip / onDone      ──────► Welcome (RESET_SESSION)
```

Header "Home" button navigates directly to Welcome from any screen.  
Header "How it works" navigates to Welcome and opens the explanation panel.

---

## 5. Fixture vs. Live API Behaviour

### Fixture mode

Enabled only when both conditions are true:
- `import.meta.env.DEV === true` (development Vite build)
- `VITE_USE_FIXTURE=true` in the environment

Risk level is controlled by `VITE_FIXTURE_RISK_LEVEL` (values: `LOWER_RISK`, `CONCERNING`, `HIGH_RISK`; defaults to `LOWER_RISK`).

The fixture response is resolved after a 1 500 ms artificial delay to simulate network latency. The delay is abortable via AbortSignal so Cancel and component unmount work correctly in fixture mode.

### Live API mode

Two endpoints are called:

| Scenario | Method | Endpoint | Body |
|---|---|---|---|
| Text analysis | POST | `/api/analyse` | JSON `{ text, context? }` |
| Image analysis | POST | `/api/analyse` | `multipart/form-data` with `image` file and optional `context` |
| Feedback | POST | `/api/feedback` | JSON `{ answer, writtenFeedback?, outcome? }` |

All API functions (`analyseText`, `analyseImage`, `submitFeedback`) throw `ApiError` on non-2xx responses. `ApiError` extends `Error` and includes `status` (HTTP status code) and `code` (server error code string).

---

## 6. Accessibility Work

### Standards and target

WCAG 2.1 AA throughout. Primary audience: older adults with lower digital confidence. Every screen has been tested with jest-axe and manual keyboard navigation review.

### Controls and patterns used

| Pattern | Implementation |
|---|---|
| Skip link | `<a href="#main-content">` rendered before the header; visible on focus |
| Landmark regions | `<header>`, `<nav aria-label="Main navigation">`, `<main id="main-content">` |
| Screen labels | Every `<section>` has `aria-label` |
| Heading hierarchy | `<h1>` per screen; `<h2>` for section cards; no skipped levels |
| Form labels | Every `<input>` and `<textarea>` has an associated `<label>` |
| Fieldsets | Radio groups wrapped in `<fieldset>` + `<legend>` |
| aria-current | Applied to the "Home" nav button when the welcome screen is active |
| Live regions | `aria-live="polite"` on character counters |
| Error associations | File validation errors use `role="alert"` and `aria-describedby` |
| Loading state | Spinner has `role="status"` and `aria-label` |
| Programmatic focus | FeedbackScreen success heading has `tabIndex={-1}`; `useEffect` calls `.focus()` on transition |
| Conditional sections | Sections absent from the DOM (not `display: none`) when content is empty |
| Reduced motion | CSS `@media (prefers-reduced-motion: reduce)` disables spinner animation and button transitions |
| Colour independence | Risk level is communicated via text label + badge + border, not colour alone |

### axe test coverage

axe tests run in all four states of every screen where multiple states exist. All axe calls are wrapped in a `<main>` landmark to avoid landmark-related false positives from the test harness.

---

## 7. Test Totals

| Suite | Tests |
|---|---|
| shared: annieResponse | 8 |
| shared: requestSchemas | 11 |
| server: routes | (see server suite) |
| server: aiService | (see server suite) |
| server: errorHandler | (see server suite) |
| server: mockAi | (see server suite) |
| **Server total** | **57** |
| client: setup | 1 |
| client: appReducer | ~18 |
| client: Layout | ~6 |
| client: Header | ~10 |
| client: WelcomeScreen | ~16 |
| client: SubmitScreen | ~41 |
| client: AnalysingScreen | 25 |
| client: ResultsScreen | 32 |
| client: FeedbackScreen | 40 |
| client: api | ~14 |
| client: fixture | ~13 |
| client: App (unit) | 5 |
| client: App (integration) | 27 |
| **Client total** | **~248** |
| **Repository total** | **~305** |

*Exact client counts reflect the final run after T8.*

---

## 8. Known Limitations

### No server-side session or auth
Ask Annie is intentionally no-auth. RESET_SESSION clears all React state but there is no server-side session to clear. This is by design for the MVP.

### `analysisResult` non-null assertion in App
`state.analysisResult` is typed as `AnnieResponse | null`. The `results` case in `renderScreen` accesses it with `state.analysisResult!`. This is safe because `ANALYSIS_SUCCESS` is the only path that sets `currentScreen = 'results'` and it always sets `analysisResult` atomically. If the state machine is extended, this assertion should be revisited.

### Fixture mode is not tested at the integration level in Jest
`DEV_USE_FIXTURE` is always `false` in Jest (stubbed by the mock). The fixture path in `analyseForSubmission` is covered by the fixture unit tests and manually verified in the Vite dev server.

### No focus trap on the "How it works" panel
The WelcomeScreen explanation panel does not trap focus. For the MVP audience this is acceptable; Sprint 4 accessibility hardening should evaluate whether a focus trap is warranted.

### SubmitScreen does not restore draft state after Cancel
When a user cancels on the Analysing screen, they return to a fresh SubmitScreen. The submitted text and context are held in `appReducer` (`submittedText`, `submittedContext`) but SubmitScreen manages its own draft state independently, so the user must re-enter their message. This is a UX compromise that avoids prop-drilling draft state through App; it can be addressed in Sprint 3 by pre-populating SubmitScreen from reducer state.

---

## 9. Deferred Work

| Item | Rationale |
|---|---|
| OpenAI API integration | Sprint 3 scope |
| Image processing (EXIF strip, resize) | Sprint 3 scope |
| Pre-populate SubmitScreen from reducer state after Cancel | Minor UX improvement; deferred to Sprint 3 |
| Focus trap on WelcomeScreen explanation panel | Sprint 4 accessibility hardening |
| Server-side request logging / telemetry | Sprint 4 |
| E2E tests (Playwright / Cypress) | Sprint 4 |
| Production deployment configuration | Sprint 4 |

---

## 10. Sprint 2 Retrospective

### What went well

- **Package-review workflow worked well.** Delivering work in named packages (T1–T8) with PO approval gates before the next package began kept scope clear and prevented unreviewed code accumulating.
- **Shared schema as single source of truth.** Defining `AnnieResponseSchema`, `FeedbackRequestSchema`, and upload config in `shared/` meant client and server stayed in sync with no duplication.
- **Prop injection for testability.** Passing `analyse` to `AnalysingScreen` and `submit` to `FeedbackScreen` as props (with production defaults) made unit testing straightforward with no module-level mocking.
- **Fixture mode isolation.** Wrapping `import.meta.env` in `lib/fixtureMode.ts` and providing a Jest stub eliminated the recurring "import.meta is not defined" test error pattern.
- **Zero axe violations across all screens.** Accessibility was treated as a first-class requirement, not a post-ship audit.

### What could improve

- **SubmitScreen draft state is not preserved across Cancel.** This was a deliberate deferral but was noticed by testing; future sprints should either store draft state in the reducer or pre-populate SubmitScreen props.
- **Timeout tests require fake timers.** The 30 s default in AnalysingScreen means timeout tests must use `jest.useFakeTimers()`, which interacts poorly with `async/await`. The `timeoutMs` prop mitigates this but adds test-only surface area.
- **Integration tests were deferred to T8.** Writing integration tests alongside each feature package (rather than after the fact) would have caught the stale `var(--color-high-risk)` CSS token bug earlier.

---

## 11. Recommendations for Sprint 3

1. **Implement the OpenAI Responses API integration** in `server/src/services/aiService.ts`, replacing the mock AI. Use the existing `AnnieResponseSchema` to validate and parse the model output before returning to the client.

2. **Image pre-processing pipeline** — strip EXIF data and resize before sending to OpenAI to reduce token cost and remove accidental PII in image metadata.

3. **Pre-populate SubmitScreen from reducer state** so users who cancel from the Analysing screen are not forced to re-type their message.

4. **Rate limiting and abuse prevention review** — the server has per-IP rate limiting but the thresholds (15 req / 15 min for `/analyse`) should be validated against expected production traffic patterns before go-live.

5. **E2E test suite** — add a Playwright suite covering the full journey against the running dev server to complement the Jest unit/integration suite.

6. **Environment variable hardening** — document `.env.example` with all `VITE_*` variables and add a startup check that fails fast if required variables are missing.
