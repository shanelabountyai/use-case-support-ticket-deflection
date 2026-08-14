# Support ticket deflection & reply drafting

BUILD · 77/100 · audit: NEEDS REWORK

## Start here

1. Open this folder in Claude Code.
2. Paste **Step 0** from [docs/prd-pack.md](docs/prd-pack.md) to load the shared context.
3. Work through the 7 milestone prompts, saving each PRD to `docs/prd/`.

`CLAUDE.md` carries the case, plan, audit findings, and the rules for this project — it loads automatically.

## What this is

Tier-1 support answers ~40 recurring question types by hand against a drifted macro library. The build is a grounded drafting assistant: retrieval over the help centre, resolved-ticket history and the surviving macros supplies the facts and house style; a single prompted generation step composes a reply with citations into the agent console. Every draft lands in the agent's editor — never auto-sent — which satisfies the stated oversight and compliance constraint by construction. The spine of delivery is the acceptance bar: ≥80% of drafts sent with only minor edits across 300 sampled tickets over four weeks, with CSAT not dropping versus the pre-pilot baseline. Phase exit criteria ladder toward that bar: first a labelled corpus and an 'edit severity' rubric agents actually agree on, then retrieval quality alone, then offline rubric scores on a golden set, then shadow mode against what agents really sent, then limited live release. The main technical risk is not generation quality but retrieval over stale reference material — a confident draft citing an out-of-date article is the failure mode that damages CSAT. The main process risk is that 'minor edits' stays undefined until it is too late to measure. Both are addressed in the first two phases before any model work scales up.