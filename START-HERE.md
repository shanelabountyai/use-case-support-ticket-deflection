# Start here — new session

Open **this folder** in its own Claude Code window (`cd ~/Documents/Claude/Projects/use-case-support-ticket-deflection && claude`). `CLAUDE.md` loads automatically, so the case, plan, audit findings and working rules are already in context.

Recommended model: **Opus** — customer PII, a redaction pipeline that has to actually work, and a hard rule that drafts are never auto-sent. Correctness and privacy dominate.

---

## Paste this to begin

```text
Read CLAUDE.md, SETUP.md, and docs/prd-pack.md before doing anything.

This is a build project scoped and independently audited by the AI Use-Case
Studio. The decision is made — do not re-score or re-scope the case. If the
premise looks wrong, say so rather than quietly redesigning around it.

Current state: scaffold only. The stack is installed (npm workspaces, Next 16,
Prisma + Postgres, vitest/Playwright) and prisma/schema.prisma has NO MODELS on
purpose — the entities come from the milestones.

NO PRDs HAVE BEEN WRITTEN YET. That is the first task.

docs/prd-pack.md holds a session starter (Step 0) plus one prompt per
milestone. Work them in order and save each PRD to docs/prd/<phase>.md. The
milestone's exit criterion is the PRD's acceptance bar — if a PRD comes back
with a softer bar than the milestone it came from, push back on that.

One thing to carry into every PRD: the audit's demanded fixes are in CLAUDE.md
under "What the audit demanded" and "Known gaps". Address each explicitly or
defer it in writing — do not let one pass silently.

Rules that are not negotiable here:
- Every acceptance criterion traces to a milestone exit criterion or the
  project acceptance bar. Don't invent new bars, don't loosen existing ones.
- Mark every estimate as an estimate. No invented benchmarks, vendor
  requirements, or ROI figures — a second model audited this plan for exactly
  that.
- If something isn't in CLAUDE.md or docs/, it's an open question, not an
  assumption to fill in.
- Oversight is required and sensitivity is PII. Drafts must never be
  auto-sent, and redaction belongs upstream of any model call, not downstream.
```

---

## What's true right now

| | |
|---|---|
| Verdict | BUILD · audit: SHIP WITH FIXES |
| PRDs | **None written** — start with `docs/prd-pack.md` |
| Code | Scaffold only; no models, no features |
| Database | Local test DB `ticket_deflection_test` exists; Neon project created — `.env.local` needs its URLs |

## Neon and local Postgres

This build has **its own Neon project**, named `use-case-support-ticket-deflection`. Never point it at the Studio's or a sibling build's — the three carry different data sensitivities, and one shared database inherits the strictest retention rule across all of them. See "Project boundaries" in CLAUDE.md.

### 1. Two connection strings, not one

Neon console → your project → **Connect**. You need *both*, and they differ by one substring:

| | Host | Goes in | Used for |
|---|---|---|---|
| **Pooled** | contains `-pooler` | `DATABASE_URL` | the app at runtime |
| **Direct** | same host, no `-pooler` | `DIRECT_URL` | Prisma migrations |

Serverless functions open many short-lived connections, which is what the pooler exists to absorb. Migrations need a real session and will hang or fail against the pooler — that mismatch is the single most common Neon-plus-Prisma failure, and it surfaces as a migration that never returns rather than as a clear error.

Both strings need `?sslmode=require`.

### 2. Write them in

```bash
cp .env.example .env.local
```

```bash
# .env.local — real values, never committed (.env*.local is gitignored)
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

`.env.example` documents names only and stays that way. Production values belong in the Vercel project's env vars, not in any file here.

### 3. Local Postgres for tests — already set up

```bash
# Already done: database created and .env.test written.
psql -lqt | grep ticket_deflection_test
```

`.env.test` overrides **only** the database; every other secret falls through to `.env.local`, because `dotenv -e .env.test -e .env.local` takes the **first** file's value. Tests never touch Neon — a remote test database turns a 0.75s integration test into 113s and makes infrastructure strain look exactly like flaky tests.

### 4. Confirm both halves

```bash
npm install            # if node_modules is missing
npm run db:status      # test (local) AND dev (Neon) — both must answer
npm test               # the guard proves tests still point at localhost
```

- `db:status:dev` fails → check `DIRECT_URL` is the **non-pooled** host and that `sslmode=require` is present.
- `npm test` starts failing "is local, never remote" → `.env.local` has leaked into the test path. Check the dotenv ordering; first file wins.
- Neither has migrations to report yet: `schema.prisma` has no models on purpose.

**The Zendesk credential should be read-only.** Drafts must never be auto-sent; a token that permits a send makes that a policy rather than a property of the system.


## Worth knowing before the PRDs

A sibling build (`use-case-grant-proposal-assembly`) has all seven PRDs written and is a useful shape reference: Context · Scope (in/out) · numbered testable acceptance criteria · Dependencies · Risks · Open questions, with each audit fix carried as an acceptance criterion rather than as advice.

Two things that surfaced writing those, worth checking for here:

- **Does a milestone actually assemble the golden set**, or do the phases only consume it? This plan describes the set inside Phase 3, the phase that also runs it, and hands long-term ownership over in Phase 6 — check whether anything actually *builds* it before Phase 3 needs it.
- **Does the redaction pipeline have its own acceptance criteria**, separate from the drafting quality bar? A redaction miss is a different class of failure from a weak draft, and shouldn't be measured by the same rubric line.
