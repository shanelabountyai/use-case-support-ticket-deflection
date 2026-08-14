# Support ticket deflection & reply drafting

Build project scoped by the AI Use-Case Studio. The decision is made and
independently audited — this repo executes it. Do not re-scope or re-score
the case here; if the premise looks wrong, say so rather than quietly
redesigning around it.

## The case

- **Verdict:** BUILD — composite 77/100 (Quick win)
- **Problem:** Tier-1 support answers the same 40-odd question types by hand. Agents copy from a macro library that has drifted out of date, so replies are inconsistent and the macro list itself is no longer trusted.
- **Users:** Tier-1 support agents; end customers see the resulting reply.
- **Acceptance bar:** ≥80% of drafts sent with only minor edits, measured on 300 sampled tickets over four weeks; CSAT must not drop versus the pre-pilot baseline.
- **Data:** Three years of resolved Zendesk tickets, the public help centre, and the current macro library. — documents, large, sensitivity **pii**, periodic
- **Constraints:** latency interactive · oversight **required** · Tickets contain customer names, order history, and occasional card-last-four; drafts must never be auto-sent.

## The plan

**Architecture:** Direct prompting grounded with RAG over reference material (task shape: generate)

Tier-1 support answers ~40 recurring question types by hand against a drifted macro library. The build is a grounded drafting assistant: retrieval over the help centre, resolved-ticket history and the surviving macros supplies the facts and house style; a single prompted generation step composes a reply with citations into the agent console. Every draft lands in the agent's editor — never auto-sent — which satisfies the stated oversight and compliance constraint by construction. The spine of delivery is the acceptance bar: ≥80% of drafts sent with only minor edits across 300 sampled tickets over four weeks, with CSAT not dropping versus the pre-pilot baseline. Phase exit criteria ladder toward that bar: first a labelled corpus and an 'edit severity' rubric agents actually agree on, then retrieval quality alone, then offline rubric scores on a golden set, then shadow mode against what agents really sent, then limited live release. The main technical risk is not generation quality but retrieval over stale reference material — a confident draft citing an out-of-date article is the failure mode that damages CSAT. The main process risk is that 'minor edits' stays undefined until it is too late to measure. Both are addressed in the first two phases before any model work scales up.

### Milestones

- **Phase 0 — Bar, rubric and baseline** — Make the acceptance bar measurable. Write the edit-severity rubric, confirm the tiers that count as 'minor', and capture the pre-pilot CSAT baseline segmented by in-scope ticket types.  
  _Exit:_ Rubric written and validated by three agents independently tagging the same ~40 historical draft/sent pairs with acceptable agreement; support lead has signed off the definition of 'minor edits'; segmented pre-pilot CSAT and reopen-rate baseline recorded and dated.
- **Phase 1 — Corpus, redaction and retrieval** — Build the ingestion pipeline and prove retrieval finds the right reference material before any drafting work. Triage the drifted macro library.  
  _Exit:_ Help centre, filtered ticket exemplars and triaged macros indexed with metadata filters; redaction hand-audited on a sample with misses treated as bugs and fixed; a labelled retrieval set of real tickets shows the correct supporting article present in the retrieved set at a level the support lead accepts; macro quarantine report delivered.
- **Phase 2 — Thinnest drafting loop** — One prompted generation over retrieved passages producing a cited draft, with citation verification and abstention behaviour. No console polish, no scope beyond the core loop.  
  _Exit:_ End-to-end draft produced for the top recurring question types with verifiable citations; abstention fires correctly on held-out tickets the help centre does not answer; prompts and retrieval config versioned in the repo; no send capability present in the service.
- **Phase 3 — Offline evaluation and red-teaming** — Score the loop against the golden set using the Phase 0 rubric, and adversarially test the sensitive-data extraction risk.  
  _Exit:_ Golden set of a few hundred labelled tickets covering routine, edge and unanswerable cases scored by humans against the rubric, with results trending toward the ≥80% minor-edit bar; failures classified by taxonomy; red-team findings on injection and cross-customer data exposure resolved or accepted in writing and added to the golden set; any LLM-judge used has measured agreement against human ratings.
- **Phase 4 — Console integration and shadow mode** — Embed the draft in the agent's existing ticket view with citation inspection and one-click severity tagging; run in shadow against unaided agent replies.  
  _Exit:_ Draft renders in the console with the diff and severity-tag capture working end to end; shadow-mode comparison on a live sample scored by the support lead shows quality consistent with offline results; rollback triggers and thresholds pre-committed in writing by the owner; macro fallback path verified.
- **Phase 5 — Limited live release and the four-week measurement** — Run with a volunteer agent group behind the mandatory review queue and execute the stated measurement.  
  _Exit:_ The stated bar evaluated on 300 sampled tickets over four weeks: ≥80% of drafts sent with only minor edits, with pilot-segment CSAT not below the pre-pilot baseline. Rubber-stamping checks (blind spot-checks, send-time and reopen-rate monitoring) show review is genuine. Decision to widen, hold or roll back taken against the pre-committed triggers.
- **Phase 6 — Widening and ownership handover** — Extend to remaining agents and question types, and place long-term ownership of the corpus and golden set.  
  _Exit:_ Bar continues to hold as volume and agent coverage widen; named owner accountable for corpus freshness, golden-set curation and periodic judge re-validation; ingestion and reviewer-agreement monitoring live with alerting; no-auto-send constraint re-verified post-widening.

## What the audit demanded

Independent critic verdict: **NEEDS REWORK**.

Fix these before or during build:
- Reconcile the schedule with the funded quarter: either compress phases to ~13 weeks and state explicitly what is dropped, or flag the overrun to the owner as a budget decision instead of asserting the resourcing "is enough".
- Fix the Phase 0 circularity and thresholds: calibrate the edit-severity rubric on artefacts that exist pre-build (state clearly that these are historical agent replies, not pipeline drafts, and re-validate the rubric on real drafts in Phase 2/3), and force the retrieval-precision, staleness-age and abstention-rate numbers to be written down in Phase 0 with a named arbiter.
- Add a pre-release failure path and a PII incident path: a pre-committed rule for what happens if offline/shadow scores fall materially short of ≥80% (remediation cycles, cost ceiling, off-ramp to the macro-reconciliation deliverable only), and a defined response — including index purge/re-embed — for any unredacted card fragment or cross-customer content found in the corpus or a draft.

### Known gaps

- **No failure/abandon path if the bar is not met** — Every phase exit criterion assumes progress toward ≥80%. There is no pre-committed decision rule for what happens if Phase 3 offline rubric scores land materially short (e.g. 55%) — no defined number of remediation cycles, no cost ceiling, no 'stop and return the macro-reconciliation by-product only' off-ramp. Rollback triggers cover post-release degradation, not pre-release failure to reach the bar.
- **Retrieval and staleness thresholds deferred with no fallback definition** — Phase 1 exit is "the correct supporting article present in the retrieved set at a level the support lead accepts" and freshness filtering uses "an agreed age threshold". Both are undefined and both are gates. If the support lead sets no number, Phase 1 has no exit criterion and stale filtering is unimplementable. The plan should require these numbers be written down in Phase 0 alongside the rubric, and name who arbitrates if agreement fails.
- **Sampling design for the 300-ticket measurement is unspecified** — The bar is measured on 300 sampled tickets, but the plan never says how the sample is drawn. With a volunteer agent group and an explicit 'request a draft' button, agents will self-select the easy tickets, and only tickets where a draft was requested can be tagged — biasing the minor-edit rate upward. Define the sampling frame (random across in-scope types, including tickets where the agent declined to request a draft or the system abstained) before Phase 5.
- **Abstention has no acceptance criterion and no cost** — Abstention is a core design choice, but nothing bounds it: a system that abstains on 60% of tickets could technically pass ≥80% minor edits on the remainder while delivering almost no value. 'Over-abstention' appears in the failure taxonomy but has no threshold, and coverage/abstention rate is not reported alongside the bar.
- **Redaction recall is measured by hand-audit only, with no defined bar or incident path** — "hand-audit a sample and treat detected misses as pipeline bugs" sets no sample size, no acceptable-miss threshold, and no response when card-last-four appears in an already-embedded index (re-embedding/index purge is never mentioned). Given PII sensitivity and a customer-facing surface, this is the highest-consequence gap.

## Working rules

- Every acceptance criterion traces to a milestone exit criterion or the acceptance bar above. Don't invent new bars, don't loosen existing ones.
- Mark every estimate as an estimate. No invented benchmarks, vendor requirements, or ROI figures — a second model audited this plan for exactly that.
- If something isn't in this file or `docs/`, it's an open question, not an assumption to fill in.
- Oversight is **required** and sensitivity is **pii** — check any design change against both before proposing it.

## Project boundaries

**This build stands alone.** It has its own repo — `shanelabountyai/support-ticket-deflection` — and owns every piece of infrastructure it needs. Nothing is shared with the Use Case Studio that scoped it, or with the sibling builds (`grant-proposal-assembly`, `insurance-fnol-intake`).

Provision per-project, never shared:

- **Database** — its own Neon project for dev and production, so customer PII lives in one database with one access list. Tests run against a **local Postgres** (`ticket_deflection_test`), never a cloud database: a remote test DB turns a 0.75s integration test into 113s and makes infrastructure strain look exactly like flaky tests. It also means redaction bugs surface against synthetic fixtures rather than real tickets.
- **Env** — its own `.env` / `.env.local`, not inherited from a parent folder. `.env.example` documents variable **names** only.
- **Deploy and CI** — its own Vercel project and its own workflow.
- **Model provider keys** — its own, so revoking or rotating one build's key never touches another's.

**Why this is not ceremony.** This build's data is **pii** — customer names, order history, occasional card-last-four. The sibling builds are **regulated** and **internal**. A shared database would spread this project's PII across pilots that have no reason to hold it and no redaction pipeline for it, and would inherit the strictest retention rule across all three. Separate owners, separate acceptance bars, separate rollback triggers: a pause here must not pause anything else.

Schema travels through migrations in this repo. Data does not: fixtures never reach production, and production ticket data never reaches a laptop.

## Layout

- `docs/prd-pack.md` — session starter + one PRD prompt per milestone. Start here.
- `docs/build-kickoff-package.md` — the full deliverable: rationale, workflow diagrams, evaluation, governance.
- `docs/prd/` — PRDs as they get written, one per milestone.

## Provenance

- Plan model: `claude-opus-5` · prompt roster `bk-2-claude` · plan v2
- Generated from case `b6351aa8-25d3-4dcd-8ed2-277c58e18970`, job `95c3aaaa-d5be-4a19-bbe0-4043b872bf6c`

> Decision-support, not a guarantee. Every figure in the plan is an estimate unless traced to a source.