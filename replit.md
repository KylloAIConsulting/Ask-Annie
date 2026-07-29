# Ask Annie

An AI-powered digital safety companion that helps people spot warning signs in suspicious messages and decide what to do next.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Validation | Zod (shared schema — single source of truth) |
| Testing | Jest + ts-jest + React Testing Library + jest-axe |
| Styling | CSS Modules |
| AI | OpenAI Responses API (Sprint 3) |

## Project Structure

```
shared/    Zod schemas and TypeScript types — single source of truth
server/    Express API server (Node.js + TypeScript)
client/    React frontend (Vite + TypeScript)
ai/        Annie system prompt, response schema, risk framework (documentation)
docs/      Architecture, UX, design system, accessibility, screen specs
```

## Running the Application

### Development

```bash
npm install
npm run dev
```

- **Client** (Vite): http://localhost:5000  ← shown in Replit preview
- **Server** (Express): http://localhost:3001
- **Health check**: http://localhost:3001/health

### Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Sprint 3+ only | — | OpenAI API key — not needed when `USE_MOCK_AI=true` |
| `OPENAI_MODEL` | No | `gpt-5.6-terra` | OpenAI model name |
| `USE_MOCK_AI` | No | — | Set `true` to use mock AI (no API key needed) |
| `NODE_ENV` | No | `development` | `development` or `production` |

**For local development**: set `USE_MOCK_AI=true` in `.env`. No API key is required.

The server will refuse to start if `OPENAI_API_KEY` is absent and `USE_MOCK_AI` is not `true`.

### Tests

```bash
npm test                              # All tests (server + client)
npm run test --workspace=server       # Server tests only (includes shared schema tests)
npm run test --workspace=client       # Client tests only
```

### Type Checking

```bash
npm run typecheck --workspace=server
npm run typecheck --workspace=client
```

## Sprint Status

| Sprint | Scope | Status |
|--------|-------|--------|
| Sprint 1 | Project scaffold, shared schemas, server skeleton, test infrastructure | ✅ Complete |
| Sprint 2 | React UI screens (Welcome, Submit, Analysing, Results, Feedback) | ✅ Complete |
| Sprint 3 | OpenAI integration, image processing | ⏳ Pending |
| Sprint 4 | Polish, accessibility audit, deployment | ⏳ Pending |

## User Preferences

- Font weight 600 throughout (not 650)
- Canonical risk values: `LOWER_RISK`, `CONCERNING`, `HIGH_RISK`
- `USE_MOCK_AI=true` for development; mock keys `__MOCK_CONCERNING__` / `__MOCK_HIGH_RISK__` trigger non-default mock responses
- No `SESSION_SECRET` in Sprint 1 — MVP has no auth
- Long documents must be split into numbered parts of approximately equal length (e.g. Part 1 of 4). Never allow a response to be truncated by the context window. Stop at the end of a logical section and wait for "continue" if needed.
