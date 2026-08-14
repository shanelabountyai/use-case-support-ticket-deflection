# Start here

> ## ⏸ PAUSED — 2026-08-14
>
> **Why: there are no real support tickets, and every remaining acceptance
> criterion needs them.** Not a blocker that more building gets around — the
> next real step is data access and three signatures, neither of which is code.
>
> Everything buildable without tickets has been built. Read
> [Was it worth doing?](#was-it-worth-doing-without-tickets) before deciding
> whether to resume, then [Picking this up](#picking-this-up).

---

## Where it stopped

| | |
|---|---|
| Verdict | BUILD 77/100 · audit: NEEDS REWORK, fixes carried into the PRDs |
| PRDs | **All seven written** — [docs/prd/](docs/prd/) |
| Phase 0 instruments | **Written, unsigned** — [docs/phase-0/](docs/phase-0/) |
| Schedule | **13 weeks, agreed, with the costs named** — [docs/schedule.md](docs/schedule.md) |
| Code | Working drafting pipeline against a synthetic corpus. 58 tests pass |
| Database | Local test DB and Neon both answer; `schema.prisma` still has no models on purpose |
| Model key | In `.env.local`, verified live |

## What blocks it

Every one of these needs a person, not a commit.

| Blocked | Needs | Who |
|---|---|---|
| Phase 0 thresholds | Retrieval, staleness, redaction-recall numbers written down | Threshold arbiter — **unnamed** |
| Phase 0 rubric | ~40 historical draft/sent pairs, three agents tagging | Support lead |
| Pre-pilot baseline | Segmented CSAT + reopen rate **captured before any agent sees a draft** | Support lead |
| Failure + incident rules | Signature | Bar owner — **unnamed** |
| Phase 1 onward | Real Zendesk tickets, help centre, macro library | Data owner |
| Golden set | A few hundred **real** labelled tickets | Unassigned |

**The baseline is the one with a deadline that has already started running.**
Once agents see drafts, the unaided comparison population is gone and cannot be
reconstructed. If the pilot ever resumes, capture it first.

## Was it worth doing without tickets?

The honest answer, since it was asked directly.

**The pipeline could not have been finished, and stopping here was right.**
Phases 3–6 are gated end to end on real data: the golden set is real labelled
tickets, shadow mode is real agent replies, the bar is 300 real sampled tickets
with real CSAT. Building an evaluation harness or a console now would be code
nobody can tell is good — the exact failure the plan was constructed to prevent.
A synthetic golden set would be worse than nothing, because it produces a number
that looks like evidence.

**Three things here have value independent of whether the pilot ever runs.**

1. **The governance instruments** ([docs/phase-0/](docs/phase-0/)) — the
   severity rubric, the threshold ledger with named arbiters, the pre-release
   failure rule, the PII incident path, the sampling frame. This is the part
   most projects skip and then cannot reconstruct under pressure, and almost
   none of it is specific to this use case.
2. **The working pipeline** ([packages/core/](packages/core/)) — redaction
   structurally upstream of embedding and of the model call, mechanical citation
   verification, abstention, no send path. It runs, it is tested, and the shape
   transfers to any grounded-drafting build.
3. **Four findings that cost something to learn** — below.

**What would have been waste:** filling the Phase 0 blanks with plausible
numbers, assembling a synthetic golden set, or building the Phase 4 console.
None were done.

### The four findings

- **Retrieval score cannot drive abstention.** Measured on the fixture corpus,
  the answerable and unanswerable coverage ranges *overlap* — no floor separates
  them. The model reading the retrieved passages does the job the score could
  not: on tkt-0001 it was handed a plausible-looking article about a 30-day
  window for *faulty* items and correctly refused to answer a *change-of-mind*
  question from it. That is the CSAT failure mode the whole plan is built around,
  caught. `npm run report:retrieval`.
- **Ranking and answerability cannot be one number.** Conflating them ranked a
  question about steel tensile ratings above a genuine refund question.
- **Raw agreement flatters a rubric that is not discriminating.** On a
  realistically skewed tagging distribution: 93.3% raw agreement, Fleiss'
  κ = −0.034. The floor belongs on kappa. `npm run agreement`.
- **Redaction missed `card ends 7788`.** Found by a purge rehearsal, not by the
  design anticipating it — which is why the redaction bar is a human reading real
  prose (P1-AC-7), not a passing test suite.

## Picking this up

### If tickets and people are available

Work in this order. It is the order the [13-week schedule](docs/schedule.md)
assumes, and week 1 is entirely non-technical.

1. Fill the role table in [docs/phase-0/README.md](docs/phase-0/README.md).
   A blank arbiter or bar owner blocks everything downstream.
2. **Capture the pre-pilot baseline** — [measurement-design.md](docs/phase-0/measurement-design.md).
3. Set and sign the thresholds — [thresholds.md](docs/phase-0/thresholds.md).
   Phase 1 has no exit criterion until rows 1, 2 and 4 are signed.
4. Sign the failure and incident rules — [decision-rules.md](docs/phase-0/decision-rules.md).
5. Run the rubric calibration — [edit-severity-rubric.md](docs/phase-0/edit-severity-rubric.md),
   then `npm run agreement -- docs/phase-0/calibration/tagger-*.csv`.
6. Only then start Phase 1 ingestion, and **start golden-set assembly in
   week 3** — it is on the critical path and still unowned.

### If they are not

Treat it as complete and stop. The deliverables are the PRDs, the Phase 0
instruments, the pipeline and the findings above. Do not build Phases 3–6
against synthetic data; a score measured on invented tickets is not a weaker
result, it is a misleading one.

### Two decisions still open

- **Which tiers count as "minor edits"** — unsigned, and it sets what ≥80%
  actually demands. Tiers 0–2 permits every draft to need a factual correction;
  tiers 0–1 does not. See the rubric.
- **Golden-set ownership** — nobody owns assembly, and Phase 3 cannot start
  without the set.

---

## Running what exists

```bash
nvm use && npm install
npm test                  # 58 tests, no API key or network needed
npm run report:retrieval  # per-question-type recall + the quarantine report
npm run agreement -- <tagger csvs>
npm run demo:draft        # live model call; needs ANTHROPIC_API_KEY in .env.local
```

**Keys go in `.env.local`, never `.env.example`** — the latter is committed and
documents variable *names* only. Do not export `ANTHROPIC_API_KEY` in your
shell: `dotenv` will not override it, so it silently shadows this build's own
key. `demo:draft` refuses to run when it detects that.

## Database

This build has **its own** Neon project (`use-case-support-ticket-deflection`)
for dev and production, and a **local** Postgres for tests. Never point the
suite at a cloud database: a remote test DB turns a 0.75s integration test into
113s and makes infrastructure strain look exactly like flaky tests. For this
build there is a third reason — redaction bugs should surface against synthetic
fixtures, not against someone's real order history.

You need **two** Neon connection strings, differing by one substring:

| | Host | Goes in | Used for |
|---|---|---|---|
| Pooled | contains `-pooler` | `DATABASE_URL` | the app at runtime |
| Direct | same host, no `-pooler` | `DIRECT_URL` | Prisma migrations |

Migrations need a real session and will hang against the pooler — the single
most common Neon-plus-Prisma failure, and it surfaces as a migration that never
returns rather than a clear error. Both strings need `?sslmode=require`.

```bash
npm run db:status   # test (local) AND dev (Neon) — both must answer
```

`.env.test` overrides **only** the database; every other secret falls through to
`.env.local`, because `dotenv -e .env.test -e .env.local` takes the **first**
file's value. Neither database has migrations to report: `schema.prisma` has no
models on purpose — the entities come from the milestones, and inventing them
would be the assumption the working rules forbid.

**The Zendesk credential must be read-only.** Drafts are never auto-sent; a
token that cannot send makes that a property of the system rather than a policy.
