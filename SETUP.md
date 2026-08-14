# Setup — Support ticket deflection & reply drafting

This project is self-contained. Every resource below belongs to **this build
only** — nothing is shared with the Use Case Studio that scoped it or with the
sibling use-case builds. The repo can be moved anywhere on disk, or handed to
someone else, without breaking a reference.

Sensitivity is **pii**; oversight is **required**. See "Project boundaries" in
[CLAUDE.md](CLAUDE.md) for why separation is load-bearing rather than tidy.

---

## 1. Source control — done

`shanelabountyai/use-case-support-ticket-deflection`, private. Its own history,
issues and access list. The `use-case-` prefix marks it as generated from the
AI Use-Case Studio.

## 2. Install

```bash
nvm use            # .nvmrc → 22
npm install        # postinstall runs prisma generate
```

Stack matches the rental and storage platforms: npm workspaces (`apps/web`,
`packages/core`, `packages/db`), Next 16 / React 19, Prisma + Postgres,
next-auth v5, Tailwind v4 with shadcn/radix, vitest for unit, Playwright for
e2e.

## 3. Database — the test suite never points at a remote database

**Dev/prod:** this project's own Neon project, named
`use-case-support-ticket-deflection`. This build holds customer names, order
history and occasional card-last-four; it needs one database with one access
list and its own redaction pipeline. Sharing with the regulated or internal
builds spreads PII into projects that have no reason to hold it and no
redaction path for it.

**Tests: local Postgres. Always — and never real tickets.**

```bash
brew install postgresql@17 && brew services start postgresql@17
createdb ticket_deflection_test

# .env.test overrides ONLY the database; every other secret falls through
# to .env.local. Both are gitignored.
printf 'DATABASE_URL=postgresql://%s@localhost:5432/ticket_deflection_test\nDIRECT_URL=postgresql://%s@localhost:5432/ticket_deflection_test\n' \
  "$(whoami)" "$(whoami)" > .env.test

npm run db:migrate:test && npm run db:seed:test
npm test
```

The `dotenv -e .env.test -e .env.local` scripts are already wired in
`package.json` — `test`, `test:e2e`, `dev:test`, plus `db:migrate:all`,
`db:status` and `db:reset:test`. You don't need to add them.

**Why, measured on the rental platform — same suite, same machine, only the
database moved:**

| | Remote (Neon, us-east-2) | Local Postgres |
|---|---|---|
| one integration test file | 113s | **0.75s** |
| full unit suite (1,321 tests) | ~120s | **39.8s** |
| full e2e sweep | ~20 min | **8.8 min** |

Integration tests are latency-bound, not compute-bound. Localhost turns a ~50ms
round trip into ~0.5ms, and no paid tier fixes that — distance is distance.

**The bigger reason is diagnostic honesty.** A shared remote test database made
infrastructure strain look exactly like flaky tests: 48,000 rows of accumulated
test debris, one mid-sweep outage that produced 239 failures all with the same
signature, and a 2.4-second test starved past a 60-second timeout. Hours went
into chasing "flaky tests" that were never code. Locally, a failing test means
the code is wrong.

For this build there is a third reason: redaction bugs should surface against
synthetic fixtures, not against someone's real order history.

**Three traps, each of which has cost a debugging pass:**

- **`dotenv -e A -e B`: the FIRST file wins.** Verify it in your version rather
  than assuming — that ordering is the whole reason `.env.test` can override
  just the database and inherit every other secret from `.env.local`.
- **Playwright's `webServer` must run `dev:test`, not `dev`.** Already set in
  `playwright.config.ts`. With plain `dev`, the app under test talks to the
  cloud while the specs talk to localhost — a split brain where a spec seeds a
  record the app cannot see.
- **Migrations no longer reach the cloud dev branch as a side effect** of
  running tests. `db:migrate:all` and `db:status` exist so that cannot go
  unnoticed. Production stays a deliberate, separate command.

**Schema syncs; data deliberately does not.** Migrations in git are the only
thing shared between local, dev and production. Fixtures must never reach
production, and production ticket data must never reach a laptop.

## 4. Environment

```bash
cp .env.example .env.local     # fill in; never commit
```

Before any new file's first push, confirm nothing secret is tracked:

```bash
git ls-files | grep -iE "\.env$|\.env\.local|secret|credential|\.pem$|\.key$"   # expect no output
```

**The ticketing credential should be read-only.** Drafts must never be
auto-sent; a token that permits a send makes that a policy rather than a
property of the system.

## 5. Deploy and CI

Its own Vercel project and its own workflow — not a directory inside another
project's deployment. `apps/web` has a `vercel-build` that generates the Prisma
client before `next build`.

## 6. Model provider

Its own key, so rotating or revoking one build's credential never touches
another's. Keep redaction upstream of the provider call rather than downstream,
and confirm onward data handling before ticket content is processed through it.

---

## Still open

`packages/db/prisma/schema.prisma` has **no models on purpose**. The entities
this build needs are defined by its milestones (`docs/prd/`), and inventing them
here would be the exact assumption this project's working rules forbid: if it
isn't in `CLAUDE.md` or `docs/`, it's an open question, not a default to fill in.

PRDs for this build have not been written yet — the milestone prompts are in
[docs/prd-pack.md](docs/prd-pack.md).
