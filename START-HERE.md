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

## Before the first session

```bash
cp .env.example .env.local     # add the Neon DATABASE_URL / DIRECT_URL
npm install                    # if node_modules is missing
npm run db:status              # confirms both test and dev reachable
npm test                       # the test-database guard should pass
```

## Worth knowing before the PRDs

A sibling build (`use-case-grant-proposal-assembly`) has all seven PRDs written and is a useful shape reference: Context · Scope (in/out) · numbered testable acceptance criteria · Dependencies · Risks · Open questions, with each audit fix carried as an acceptance criterion rather than as advice.

Two things that surfaced writing those, worth checking for here:

- **Does a milestone actually assemble the golden set**, or do the phases only consume it? This plan describes the set inside Phase 3, the phase that also runs it, and hands long-term ownership over in Phase 6 — check whether anything actually *builds* it before Phase 3 needs it.
- **Does the redaction pipeline have its own acceptance criteria**, separate from the drafting quality bar? A redaction miss is a different class of failure from a weak draft, and shouldn't be measured by the same rubric line.
