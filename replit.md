# Ask Annie

An AI-powered digital safety companion that helps people spot warning signs in suspicious messages and decide what to do next.

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | React + TypeScript + Vite |
| Backend | Node.js + Express + TypeScript |
| Validation | Zod (shared schema — single source of truth) |
| Testing | Vitest + React Testing Library + vitest-axe |
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
npm run test --workspace=server       # Server tests only
npm run test --workspace=client       # Client tests only
```

### Type Checking

```bash
npm run typecheck                     # Both server and client
```

## API Endpoints

| Method | Path | Rate Limit | Description |
|--------|------|------------|-------------|
| `GET` | `/health` | None | Health check |
| `POST` | `/api/analyse` | 10 req / 10 min / IP | Submit content for risk analysis |
| `POST` | `/api/feedback` | 20 req / 10 min / IP | Submit optional feedback |

### POST /api/feedback

**Required:** `answer` — one of `yes`, `not_sure`, `no`  
**Optional:** `writtenFeedback` (string, max 1000 chars), `outcome` (enum)

> Note: selecting "Skip" on the feedback screen must **not** call this endpoint.

## Security Notes

- API keys are server-side only — never sent to the client
- Trust proxy is configured before rate limiting (Replit proxy aware)
- All responses include a `requestId` for traceability
- Stack traces are never exposed in production error responses
- User-submitted content is never logged

## Sprint Status

| Sprint | Status | Description |
|--------|--------|-------------|
| Sprint 1 | ✅ Complete | Foundation: monorepo, shared schema, mock AI, dev workflow |
| Sprint 2 | ⬜ Pending | Complete non-AI user journey (all 5 screens) |
| Sprint 3 | ⬜ Pending | Real OpenAI Responses API integration |
| Sprint 4 | ⬜ Pending | Security hardening, WCAG 2.2 AA audit, deployment |

## User Preferences

- No `SESSION_SECRET` — the MVP has no accounts, authentication or sessions
- Canonical risk identifiers: `LOWER_RISK`, `CONCERNING`, `HIGH_RISK` (Green/Amber/Red is retired)
- Font weight 600 throughout (not 650)
- Mock AI keys: embed `__MOCK_CONCERNING__` or `__MOCK_HIGH_RISK__` in text to select a response
