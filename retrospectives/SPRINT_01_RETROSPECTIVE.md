# Sprint 1 Retrospective — Ask Annie

**Sprint:** 1 — Project Scaffold
**Date:** 2026-07-29
**Status:** Complete ✅

---

## What We Set Out to Do

Stand up the full project skeleton for Ask Annie:

- npm workspaces (root, `server/`, `client/`, `shared/`)
- Shared Zod schema layer as the single source of truth
- Express server with middleware, rate limiting, and stub routes
- React + Vite client shell with design tokens and CSS architecture
- Accessibility test infrastructure (jest-axe)
- A working `npm run dev` workflow with both servers running

No real AI integration in Sprint 1. The `POST /api/analyse` endpoint deliberately returns `501 NOT_IMPLEMENTED` until Sprint 3.

---

## What Went Well

**Shared schema approach paid off immediately.**
Defining `AnnieResponse`, `AnalyseTextSchema`, and `FeedbackRequestSchema` in `shared/` and deriving all TypeScript types via `z.infer<>` meant there was never a moment of type drift between client and server. This will scale well as the schema evolves in later sprints.

**Express middleware stack is solid.**
`trust proxy` before rate limiters, `requestId` on every request, no stack traces in production, consistent error shape — all of it landed cleanly and is covered by the route integration tests. The feedback endpoint validates, returns, and discards without ever persisting user content.

**Accessibility infrastructure in from day one.**
`jest-axe` and `toHaveNoViolations` are wired up globally in `client/setupTests.ts`. Sprint 2 screen components will get axe coverage with three lines of test code. Retrofitting this later is painful; doing it now was the right call.

**MockAiService design is clean.**
The `AiService` interface + factory pattern means Sprint 3 can swap in the real OpenAI implementation without touching any route or middleware code. The mock's three trigger strings (`__MOCK_CONCERNING__`, `__MOCK_HIGH_RISK__`, and default) cover all risk levels for manual testing during Sprint 2.

---

## What Was Harder Than Expected

**Vitest was blocked by Replit's package firewall.**
Every Vitest tarball (v1.x and v2.x) was rejected due to a CVE flag on the package. This was not anticipated and required a full mid-sprint pivot to Jest + ts-jest. The good news: the test APIs are identical, no test logic changed, and Jest is a well-supported path. The bad news: it cost roughly half a day and introduced three compatibility shims that wouldn't have been necessary with Vitest.

**multer 2.x ships no TypeScript declarations.**
The package README implied first-party types were planned for 2.x; they were absent in the installed 2.2.0. A hand-written shim (`server/src/types/multer.d.ts`) was required. This is narrow — it only covers the surface used by `upload.ts` — but it is undocumented tech debt that will need attention if multer usage expands.

**jest-axe 8.x also ships no TypeScript declarations.**
Same situation, separate shim (`client/src/types/jest-axe.d.ts`). The additional wrinkle here was that the shim file must be a *script* (no top-level imports) for the ambient `declare module` to register correctly. A module-style shim silently fails to augment `jest.Matchers`.

**`rootDir` in `server/tsconfig.json` caused `TS6059`.**
The original config set `rootDir: "src"`, but `@shared/*` imports resolve to `../shared/`, which is outside that root. Removing `rootDir` fixes the typecheck but shifts the compiled output path from `dist/index.js` to `dist/server/src/index.js`. This is harmless during development (the dev workflow uses `tsx` and never reads compiled output) but will break any production deployment that points at `dist/index.js`. Logged as task #3.

---

## Technical Debt Carried Forward

| Ref | Item | Priority | Impact if Ignored |
|---|---|---|---|
| Task #3 | Server build output path broken (`dist/server/src/index.js` instead of `dist/index.js`) | **High** | Production deployment will fail at entry point |
| Task #4 | ts-jest `globals` deprecation warning (3 warnings per test run) | Low | Noise in CI; could mask real warnings |
| — | multer type shim is narrow; does not cover full multer API | Low | Only matters if multer usage expands beyond current routes |
| — | Shared tests run under the server's Jest config | Low | Fine for Sprint 1; may need its own workspace config as the schema grows |

---

## Decisions to Preserve

**Canonical risk values are `LOWER_RISK`, `CONCERNING`, `HIGH_RISK`.**
Not "green/amber/red", not "low/medium/high". These strings appear in the Zod schema, mock responses, and will appear in UI copy. Changing them later is a multi-file refactor.

**`USE_MOCK_AI=true` is a plain env var, not a secret.**
The real `OPENAI_API_KEY` is intentionally absent until Sprint 3. Do not add it earlier; the server's startup guard will refuse to start in an ambiguous state.

**Font weight is 600 throughout.**
The design token `--font-weight-body: 600` is intentional for accessibility (older-adult audience). Do not reduce it to 400 or 500.

**Rate limits are per-route, applied after `trust proxy`.**
`express trust proxy = 1` must remain the first configuration applied to the Express app, before any limiter. Reordering it breaks IP-based rate limiting behind a proxy.

---

## Sprint 2 Starting Checklist

- [ ] Resolve task #4 (ts-jest deprecation warning) — one config line, five minutes
- [ ] Build `InputScreen` component with form, validation, and submit handler
- [ ] Wire `POST /api/analyse` client call; handle `501` gracefully in UI
- [ ] Build `ResultScreen` component for all three risk levels
- [ ] Add per-screen jest-axe accessibility tests
- [ ] Task #3 (build path) deferred to Sprint 4 pre-deployment

---

## Final Numbers

| Metric | Value |
|---|---|
| Files created | 48 |
| Lines of code | ~10,356 insertions |
| npm packages installed | 559 |
| CVE blocks during install | 0 |
| TypeScript errors at close | 0 |
| Tests passing | 59 / 59 |
| Endpoints verified | 4 |
| Unresolved blockers | 0 |
