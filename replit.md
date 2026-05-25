# Ouwibo — Airdrop Tracker Dashboard

A public (no-auth) airdrop tracker dashboard inspired by CryptoRank. Track crypto airdrops, complete task checklists, and chat with an AI assistant.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/ouwibo run dev` — run the frontend (port 24060)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite (artifact: `artifacts/ouwibo`)
- API: Express 5 (artifact: `artifacts/api-server`, port 8080, base path `/api`)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec at `lib/api-spec/openapi.yaml`)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/airdrops.ts` — DB schema source of truth (airdrops, airdrop_tasks tables)
- `lib/db/src/schema/activity.ts` — activity log table
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contracts)
- `lib/api-client-react/src/generated/api.ts` — generated React Query hooks
- `lib/api-zod/src/generated/api.ts` — generated Zod schemas for server validation
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/ouwibo/src/pages/` — Frontend pages
- `artifacts/ouwibo/src/index.css` — Neobrutalism CSS design tokens

## Architecture decisions

- Contract-first API: OpenAPI spec defines the contract; Orval generates both React Query hooks (client) and Zod schemas (server validation). Never write these by hand.
- DB tables `airdrops` and `airdrop_tasks` created via raw SQL (drizzle-kit push requires TTY in this environment). Run schema changes via `psql $DATABASE_URL`.
- AI chat uses a smart mock by default. Replace the block in `artifacts/api-server/src/routes/chat.ts` with your LLM API call.
- Frontend uses `wouter` for routing with BASE_URL support for Replit proxy.
- Theme toggle (light/dark) stored in localStorage via ThemeProvider.

## Product

**Ouwibo** is a public airdrop tracker with:
- **Dashboard** — live stats (total/active/upcoming airdrops, tasks), featured airdrops, recent activity feed, active airdrop grid
- **Airdrops** — landscape card list with search + status/category filter, add/edit/delete airdrops
- **Airdrop Detail** — info panel with reward/TVL/difficulty/participants, social links, task checklist with "Go" links, progress tracker
- **AI Chat** — smart airdrop assistant with suggestion chips, real DB data awareness
- **Settings** — site config, LLM API key, appearance toggle, notification preferences

## Design

Neobrutalism + Apple hybrid aesthetic:
- Fonts: Unbounded (headers), Space Mono (labels/monospace), Inter (body)
- Background: warm beige (`--background: 36 40% 96%`) / dark mode available
- Neo-cards: `border: 2px solid hsl(var(--border)); box-shadow: 4px 4px 0 hsl(var(--border))`
- Accent: orange-red `#d95c38` (CSS var `--primary`)
- Status badges use pastel colors (mint=active, yellow=upcoming, sage=ended, lavender=potential)

## User preferences

- Keep the design in neobrutalism + Apple hybrid style
- No authentication required (public dashboard)
- AI chat should be easy to swap with a real LLM (see chat.ts TODO comment)

## Gotchas

- `drizzle-kit push` requires interactive TTY — run schema changes via raw `psql` instead
- Old route files (`projects.ts`, `tasks.ts`, `members.ts`, `analytics.ts`) still exist in `artifacts/api-server/src/routes/` but are NOT imported — safe to delete
- Always run codegen after editing `openapi.yaml`: `pnpm --filter @workspace/api-spec run codegen`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
