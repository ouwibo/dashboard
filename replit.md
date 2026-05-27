# Ouwibo

Ouwibo is a Crypto Airdrop Tracker & News dashboard that lets users discover, track, and complete crypto airdrop tasks.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, TailwindCSS v4, shadcn/ui, Wouter routing, React Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ouwibo-app/` — React/Vite frontend (port 23361, preview at `/`)
- `artifacts/api-server/` — Express API server (port 8080, prefix `/api`)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API)
- `lib/api-client-react/src/generated/` — generated React Query hooks (do not hand-edit)
- `lib/api-zod/src/generated/` — generated Zod validation schemas (do not hand-edit)
- `lib/db/src/schema/` — Drizzle ORM schema (airdrops, airdrop_tasks, activity tables)

## Architecture decisions

- Contract-first API: OpenAPI spec → codegen → typed hooks + Zod validators
- Frontend uses Wouter (lightweight React router) instead of React Router
- No authentication — public read, no user accounts
- Activity feed is manually seeded; not auto-generated from mutations yet
- AI Chat page uses mock responses unless an LLM API key is configured

## Product

- **Dashboard**: Stats overview (total/active/upcoming/ended airdrops), top-ranked airdrops list, latest news section
- **Airdrops**: Browse and filter all airdrops by status, category, chain; search by name
- **Airdrop Detail**: View tasks, links, requirements, and metadata for each airdrop
- **News**: Crypto news and analysis articles
- **AI Chat**: Ask questions about airdrops (mock responses, LLM-ready)
- **Settings**: Theme and app preferences

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The `.migration-backup/` folder contains the original imported project — these workflows intentionally fail (they're archive copies, not active)
- After any OpenAPI spec change, always re-run codegen before editing routes or frontend
- `artifacts/ouwibo` slug is reserved by the backup artifact; active frontend uses `ouwibo-app`
- Seed data is in the DB from initial setup; re-running seeds will duplicate rows (no unique constraint on slug)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
