# Phase 0 — Bar, rubric and baseline

**These documents are instruments, not answers.** Every number in them is a
blank. Filling the blanks is the phase, and it is done by the people named
below — not by the builder and not by inference from anything in this repo.

That is the point of the phase. The independent audit's finding was that
retrieval precision, staleness age and abstention rate were deferred to "a
level the support lead accepts", which is not a criterion; and that the Phase 0
rubric was to be calibrated on artefacts that do not exist before the build.
Writing the numbers down here, before the thing they gate exists, is the fix.
A threshold set after seeing the result it judges is not a threshold.

Requirements trace to `../prd/phase-0-bar-rubric-and-baseline.md`.

## The documents

| Document | Covers | Signed by |
|---|---|---|
| [edit-severity-rubric.md](edit-severity-rubric.md) | P0-AC-1 … 7 — the rubric, the calibration protocol, the agreement floor, the definition of "minor edits" | Support lead, after three agents calibrate |
| [thresholds.md](thresholds.md) | P0-AC-8, 9, 10, 11, 14 — retrieval, staleness, abstention band, redaction recall, tagging-compliance floor | Named arbiter per row |
| [decision-rules.md](decision-rules.md) | P0-AC-12, 13 — the pre-release failure path and the PII incident path | Bar owner |
| [measurement-design.md](measurement-design.md) | P0-AC-15 … 18 — sampling frame, pre-pilot baseline, in-scope types, console feasibility | Support lead and bar owner |

## Roles — P0-AC-19

Every role the plan relies on, mapped to one accountable individual. A role with
no name is a blocker, not a detail: three of these have to sign something before
Phase 1 can start.

| Role | Name | What they are accountable for | Filled |
|---|---|---|---|
| Bar owner | `__________` | The acceptance bar, the failure rule, the incident rule, rollback triggers, the widen/hold/rollback decision | ☐ |
| Support lead | `__________` | The rubric, the definition of "minor edits", the in-scope type list, the retrieval threshold, shadow-mode scoring | ☐ |
| Data owner | `__________` | Approving redacted ticket content for indexing; signing off the redaction pipeline against its audit records | ☐ |
| Threshold arbiter | `__________` | Setting any threshold in `thresholds.md` unilaterally if agreement fails, by the stated deadline | ☐ |
| Builder | `__________` | The pipeline, the evaluation harness, the records this phase produces | ☐ |
| Corpus owner (long-term) | `__________` | Post-handover corpus freshness, golden-set curation, judge re-validation (Phase 6) | ☐ |

**If the corpus-owner row cannot be filled now, say so now.** Phase 6 cannot
close without it, and discovering that at handover is worse than knowing it at
the start.

## Exit checklist

Phase 0 is complete when every box is ticked. Phase 1 does not start before it.

- [ ] Rubric written with tiers, worked examples, a tie-break rule, and an explicit statement of which tiers count as **minor** (P0-AC-1)
- [ ] Three agents have independently tagged the same ~40 historical pairs, without conferring (P0-AC-2)
- [ ] Inter-rater agreement computed and recorded, with the statistic named (P0-AC-3)
- [ ] Agreement floor stated as a number, with the procedure when it is not met (P0-AC-4)
- [ ] Calibration record states plainly that the pairs are **historical agent replies, not pipeline drafts** (P0-AC-5)
- [ ] Rubric carries its Phase 2/3 re-validation requirement (P0-AC-6)
- [ ] Support lead has signed the definition of "minor edits", named and dated (P0-AC-7)
- [ ] Retrieval threshold recorded as a number (P0-AC-8)
- [ ] Staleness age threshold recorded, with the rule for older material (P0-AC-9)
- [ ] Every threshold has a named arbiter and a deadline (P0-AC-10)
- [ ] Abstention band recorded, plus the rule that coverage is reported beside every quality figure (P0-AC-11)
- [ ] Pre-release failure rule signed: materially-short score, remediation cycles, cost ceiling, off-ramp (P0-AC-12)
- [ ] PII incident rule signed, per location, including index purge and re-embed (P0-AC-13)
- [ ] Redaction-recall bar recorded: audit sample size and acceptable-miss threshold (P0-AC-14)
- [ ] Phase 5 sampling frame defined and reproducible (P0-AC-15)
- [ ] Segmented pre-pilot CSAT and reopen-rate baseline recorded and dated (P0-AC-16)
- [ ] In-scope question types enumerated and signed (P0-AC-17)
- [ ] Console surface confirmed against the real platform (P0-AC-18)
- [ ] Every role above mapped to a named individual (P0-AC-19)
- [ ] No ticket content sent to a model provider during this phase (P0-AC-20)

## Still open above this phase

Neither is the builder's to close, and both were raised when the PRDs were written:

1. **Schedule.** The plan's own per-phase estimates sum to ~17–20 weeks against a
   ~13-week funded quarter, and Phase 5's four-week measurement cannot be
   compressed without changing the bar. Bar owner's decision.
2. **Golden-set assembly is unowned.** Phase 3's exit requires a few hundred
   labelled tickets assembled *and* scored in ~2–3 weeks, and no earlier
   milestone builds the set. Assign an owner and a start point before Phase 1
   ends, or revise the Phase 3 estimate.
