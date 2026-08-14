# Schedule — 13-week quarter

**Decision, 2026-08-14.** The funded quarter is 13 weeks. The plan's own
per-phase estimates sum to ~17–20 weeks, so the phases are compressed to fit and
**what is dropped is stated below rather than absorbed silently.** This closes
the first fix the independent audit demanded.

*Every duration here is a planning estimate, not a commitment.*

---

## The immovable four weeks

Phase 5's measurement is 300 sampled tickets over four weeks. It cannot be
shortened, because it **is** the acceptance bar — shortening it changes what
≥80% means, and the working rules forbid loosening an existing bar. Working
backwards, the measurement runs weeks 10–13, so Phases 0–4 have **nine weeks**
against 11–13 weeks of estimate.

Everything below follows from that arithmetic.

## The plan

| Week | Phase | Work | Runs alongside |
|---|---|---|---|
| 1 | 0 | Thresholds set and signed — retrieval, staleness, redaction recall. In-scope type list. **Pre-pilot baseline captured.** Roles named. | — |
| 2 | 0 | Rubric written; three agents calibrate on ~40 historical pairs; agreement measured | Phase 1 ingestion starts once week-1 thresholds are signed |
| 2–4 | 1 | Corpus ingestion, redaction pipeline + hand-audit, staleness filtering, macro triage, labelled retrieval set | **Golden-set assembly starts week 3** |
| 5–7 | 2 | Drafting loop: retrieval, one generation, citation verification, abstention. Rubric re-validated on real drafts | Golden-set labelling continues |
| 7–9 | 3 | Golden set scored against the rubric; failure taxonomy; injection and cross-customer red-teaming | Phase 4 console build overlaps from week 8 |
| 8–9 | 4 | Console integration, diff, severity-tag capture, rollback triggers signed, macro fallback verified | — |
| 9 | 4 | **Shadow mode — one week, not two** | — |
| 10–13 | 5 | The four-week measurement. Weekly rubber-stamping checks throughout | — |

**Gate at end of week 9:** Phase 3 scores plus shadow-mode results, judged
against the pre-release failure rule. Only a pass opens the measurement window.

## What is dropped

Stated explicitly, because the alternative is discovering it in week 11.

### 1. Phase 6 leaves the quarter

Widening to the remaining agents and question types, and long-term ownership
handover, move to the following quarter. The quarter ends at the
widen / hold / roll back decision, not after widening.

**Consequence:** the pilot's result is measured on a **volunteer group over the
in-scope types only**. Whether it generalises to the wider agent population is
genuinely unknown at the quarter's end, and the Phase 6 PRD's warning stands —
volunteers are the enthusiasts, and the newly-admitted question types are the
ones retrieval covers worst. Do not report the quarter's number as if it were
the widened number.

**Also deferred with it:** the named long-term corpus owner, ingestion and
reviewer-agreement alerting, and the post-widening redaction re-audit. The
system is therefore **not yet operable beyond the pilot** at week 13. If the
decision is to widen, week 14 starts with that work, not with more agents.

### 2. All remediation slack

There is no room for a remediation cycle. If Phase 3 lands below the
materially-short threshold in [decision-rules.md](phase-0/decision-rules.md),
**the failure rule fires immediately** — the off-ramp is taken and the macro
quarantine report is the deliverable. There is no second attempt inside this
quarter.

**This is the sharpest cost of the compression and the owner should hold it in
mind when setting that threshold.** A threshold set as though a remediation
round were available will be wrong.

### 3. Shadow mode halves, from two weeks to one

**Consequence:** a smaller shadow sample, so the comparison against Phase 3's
offline results is noisier, and P4-AC-9's requirement to *characterise* any
divergence between offline and live is harder to satisfy. The support lead's
scoring must be booked in advance for week 9 — there is no slack to wait on
availability.

Whether one week yields a scoreable sample depends on weekly in-scope ticket
volume, which is still unknown ([measurement-design.md](phase-0/measurement-design.md)).
**If volume is too low, this is the first thing that breaks.**

### 4. Phase 0 and Phase 1 overlap

Phase 1 ingestion begins in week 2, before the rubric calibration finishes.
Safe only because the **thresholds** land in week 1 and it is the thresholds
Phase 1 depends on, not the rubric.

**Hard sequencing constraint:** if the week-1 threshold signatures slip, the
whole schedule slips one-for-one. There is no absorbing it.

## What is not dropped

- The four-week, 300-ticket measurement, and its sampling frame
- The redaction hand-audit on real material, and re-audit after fixes
- Red-teaming for injection and cross-customer exposure
- The pre-release failure rule and the PII incident path
- Coverage reported beside every quality figure
- No-auto-send, structurally and at the credential

None of these buy time worth having. Cutting the red-team pass or the redaction
audit would save days and move the highest-consequence risks in the build from
managed to unmanaged.

## The three things that will break this schedule

1. **Week-1 threshold signatures slip.** Everything is one-for-one behind.
2. **Weekly ticket volume is lower than assumed.** Shadow mode yields nothing
   scoreable in one week, and 300 tickets over four weeks may not be reachable —
   which is an owner decision to take *before* week 10, not during it.
3. **Golden-set assembly does not start in week 3.** Phase 3 then has no set to
   score and the week-9 gate cannot be held. See
   [phase-3/golden-set-protocol.md](phase-3/golden-set-protocol.md).

## Decision record

| Field | Value |
|---|---|
| Date | 2026-08-14 |
| Decision | Compress to 13 weeks; Phase 6 out of quarter; zero remediation slack; shadow mode 1 week |
| Alternatives considered | Narrow to ~10 question types (keeps a remediation cycle, costs coverage); overrun to ~17 weeks as a budget request |
| Rejected outright | Shortening the four-week measurement — that changes the acceptance bar |
| Decided by | Project owner |
| Recorded by | Builder |
