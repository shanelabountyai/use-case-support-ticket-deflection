# Thresholds

**Status: every row is blank. Filling them is Phase 0's job.**

The audit's finding: Phase 1's exit was "the correct supporting article present
in the retrieved set at a level the support lead accepts", and freshness
filtering used "an agreed age threshold". Both are gates and neither is a
number. If nobody sets them, Phase 1 has no exit criterion and stale filtering
is unimplementable.

So each row below carries a **number**, a **named arbiter** empowered to set it
unilaterally if agreement fails, and a **deadline**. The arbiter exists because
"the support lead and the builder will agree a number" is how a threshold gets
deferred a second time. *(P0-AC-8, 9, 10, 11, 14.)*

**Set these before the thing they gate exists.** A retrieval threshold chosen
after seeing the retrieval results is not a threshold, it is a description.

---

## 1. Retrieval quality — P0-AC-8

Gates Phase 1 exit (P1-AC-13) and is re-reported per question type (P1-AC-14).

| Field | Value |
|---|---|
| Metric | recall@k — the labelled supporting article is present in the retrieved set |
| **k (retrieved-set size)** | `______` |
| **Threshold** | `______`% |
| Measured on | a labelled set of real in-scope tickets (P1-AC-12) |
| **Labelled-set size** | `______` tickets |
| Drawn across | all in-scope question types in [measurement-design.md](measurement-design.md) |
| **Arbiter** | `__________` |
| **Deadline** | `__________` |

**Two things to decide alongside the number.**

*Per-type floor.* An aggregate can pass while individual types fail badly, and
the failing types will be the ones the help centre covers worst — which is where
drafting is most likely to go wrong. Set a per-type floor as well, or state
explicitly that aggregate-only is accepted and why:

> per-type floor: `______`%  ·  or ☐ aggregate only, accepted because `__________`

*What a miss costs.* A question type below the floor is excluded from drafting
and named in writing (P2-AC-14). Confirm that is the intended consequence.

**Measured reference point, for calibration only — not a proposal.** The
lexical retriever in this repo scores **recall@4 = 58%** on the synthetic
fixture corpus, with two question types at 0%, and the answerable and
unanswerable score ranges overlapping so no abstention floor separates them
(`npm run report:retrieval`). That is a synthetic corpus of 13 passages and
proves nothing about real content. It is included only so the arbiter knows what
a naive lexical baseline looks like before choosing a number a real system has
to clear.

---

## 2. Reference-material staleness — P0-AC-9

Gates the ingestion filter (P1-AC-4). The plan names stale reference material as
the **main technical risk**: a confident draft citing an out-of-date article is
the failure mode that damages CSAT, and the agent reviewing it may not catch it,
because the draft looks right.

| Field | Value |
|---|---|
| **Maximum age** | `______` days since last update |
| **Rule for material older than that** | ☐ excluded ☐ down-ranked ☐ retrieved but flagged in the draft |
| Applies to | ☐ help centre ☐ macros ☐ ticket exemplars |
| **Per-source exceptions** | recorded where? `__________` |
| **Arbiter** | `__________` |
| **Deadline** | `__________` |

**Known limitation, to be recorded rather than solved by the number.** A
last-updated date reflects the last *edit*, not the last *fact check*. An
article touched for a typo last month can carry a policy that changed last year,
and a date-based rule cannot see that. Macro triage gives a second, content-based
signal where a macro contradicts an article; those contradictions are worth
routing to the help-centre content owner as findings regardless of whether this
pilot proceeds.

**Who owns help-centre content?** `__________` — they receive the staleness and
contradiction findings.

---

## 3. Abstention band — P0-AC-11

The audit's finding: abstention is a core design choice with nothing bounding it.
A system that abstains on 60% of tickets could pass ≥80% minor edits on the
remainder while deflecting almost nothing.

| Field | Value |
|---|---|
| **Acceptable abstention rate** | up to `______`% |
| **Rate above which the system is under-delivering** regardless of edit-severity scores | `______`% |
| Denominator | all in-scope tickets in the sampling frame, not only those where a draft was requested |
| **Arbiter** | `__________` |
| **Deadline** | `__________` |

**Co-reporting rule — not optional.** Coverage / abstention rate is reported in
the same table as the minor-edit rate, every time the bar is reported, in every
phase (P2-AC-7, P3-AC-4, P5-AC-4, P6-AC-3). A quality figure without its
coverage figure beside it is an incomplete report, and quality bought by
abstaining more must be visible in the same glance.

**Also to settle: which denominator is the bar?**

> The ≥80% applies to ☐ every sampled ticket ☐ only tickets where a draft was produced
>
> Decided by the bar owner: `__________`

These give materially different numbers. The second is the loophole the audit
named; the co-reporting rule contains the damage but does not settle it.

---

## 4. Redaction recall — P0-AC-14

The highest-consequence threshold here. Sensitivity is **pii** and the surface
is customer-facing.

| Field | Value |
|---|---|
| **Hand-audit sample size** | `______` documents/requests |
| How the sample is drawn | `__________` (must be reproducible) |
| **Acceptable misses in the sample** | `______` |
| Auditor | a human, named: `__________` |
| **Arbiter** | `__________` |
| **Deadline** | `__________` |

**A miss is a pipeline bug, not an accepted rate.** Every miss found is fixed,
covered by a regression test on synthetic fixtures, and the audit is re-run on a
**fresh** sample (P1-AC-8). Re-running on the same sample only proves the fix
fits the examples it was written from.

**Card fragments are never-index.** Any occurrence in the corpus, the index, a
draft, or a log triggers the incident rule in
[decision-rules.md](decision-rules.md) — including index purge and re-embed —
irrespective of whether the sample-level threshold was met.

**Worked evidence that this bar is not theoretical.** Building this repo's
redaction pass, the pattern set caught `ending in 4242`, `last four 1881` and
`**** **** **** 9310`, and missed `card ends 7788`. The miss was found by a
purge rehearsal, not by the design anticipating it. Real ticket prose will
contain shapes nobody listed. That is precisely why the bar is a human reading
real material and not a passing test suite.

---

## 5. Tagging-compliance floor

Not in the original plan; raised in the Phase 4 PRD. The plan's own assumption
list concedes that if agents do not tag reliably, the acceptance measurement
degrades to diff-based proxies plus support-lead sampling. That fallback needs a
trigger, and Phase 5 needs it before the window opens, not during it.

| Field | Value |
|---|---|
| **Minimum tagging compliance** | `______`% of sampled tickets carrying a severity tag |
| Below that, the measurement | ☐ degrades to diff-based proxy + support-lead sampling, labelled as such in the result ☐ is void and the window restarts |
| **Arbiter** | `__________` |
| **Deadline** | before Phase 5 opens |

---

## Ledger

| # | Threshold | Value set | Arbiter | Date | Signed |
|---|---|---|---|---|---|
| 1 | Retrieval recall@k | | | | ☐ |
| 2 | Staleness max age | | | | ☐ |
| 3 | Abstention band | | | | ☐ |
| 4 | Redaction recall | | | | ☐ |
| 5 | Tagging compliance | | | | ☐ |

**Phase 1 does not start until rows 1, 2 and 4 are signed.** They are its exit
criteria; without them there is nothing to pass or fail against.
