# Decision rules — pre-committed

**Status: unsigned. Both rules must be signed by the bar owner before Phase 1
starts.**

Two things happen to this project that the plan, as audited, had no answer for:
the scores come back short of the bar, or personal data turns up somewhere it
should not be. Both rules are written now, while nobody knows how the pilot goes
and nobody has an incentive to write them leniently.

That timing is the entire mechanism. A failure rule written after seeing 74%
gets written to accommodate 74%. *(P0-AC-12, P0-AC-13.)*

---

# 1. Pre-release failure path — P0-AC-12

The audit's finding: every phase exit criterion assumes progress toward ≥80%.
There is no pre-committed decision rule for Phase 3 landing materially short —
no number of remediation cycles, no cost ceiling, no off-ramp. Rollback triggers
cover post-release degradation, not pre-release failure to reach the bar.

### When this rule fires

Offline rubric scores on the golden set (P3-AC-15), or shadow-mode scores
(Phase 4), landing below the materially-short threshold.

### The numbers

| Field | Value |
|---|---|
| **"Materially short" is a minor-edit rate below** | `______`% |
| **Remediation cycles permitted** | `______` |
| What counts as one cycle | `__________` *(e.g. one round of prompt + retrieval changes, re-scored on the golden set)* |
| **Cost ceiling for remediation** | `__________` *(builder time, model spend, agent scoring hours — state which are counted)* |
| **Who declares a cycle spent** | `__________` |

### The zone between the threshold and the bar

A score above "materially short" but below 80% is not covered by the numbers
above, and it is the most likely outcome. Phase 3's exit says results should be
"trending toward" the bar without saying what suffices.

> **What passes Phase 3:** `__________________________________________`
>
> *Bar owner. Write this as a number or a rule, not as a judgement to be made later.*

### The off-ramp

If the cycles are spent or the ceiling is reached without clearing the bar, the
project **stops and delivers the macro-reconciliation by-product only**.

That deliverable is real and already exists by then: the macro quarantine report
(P1-AC-15) classifies every macro in the library as current, superseded, or
contradicted-by-help-centre, with evidence, plus the staleness and contradiction
findings for the help centre. The agents' stated problem is a macro library that
has drifted and is no longer trusted. The report addresses that directly, with
or without a drafting assistant.

**This is what makes the off-ramp signable.** It is a partial success with a
named artefact and an owner, not a write-off — which is why it can be agreed
honestly in advance instead of being argued about under pressure.

| Field | Value |
|---|---|
| Off-ramp deliverable | Macro quarantine report + help-centre staleness and contradiction findings |
| **Who receives it** | `__________` |
| **Who takes the stop decision** | `__________` |

### Execution

When the rule fires, the decision record cites these numbers with the measured
figures beside them (P3-AC-15, P6-AC-16). Changing any number after a score is
visible is an amendment carrying the bar owner's signature and a date — not a
re-reading.

### Sign-off

| | |
|---|---|
| Bar owner (name) | `__________` |
| Signature / recorded approval | `__________` |
| Date | `__________` |

---

# 2. PII incident path — P0-AC-13

The audit's finding: redaction recall was to be hand-audited with no response
defined for a miss reaching an already-embedded index. Re-embedding and index
purge were never mentioned.

### What counts as an incident

Any of the following, wherever found, whether by audit, red-team, agent report,
or customer report:

- an unredacted card fragment or full card number
- another customer's identifying information in a draft or a retrieved passage
- unredacted personal data in the index, a log, or a model-provider request
- a tier-5 rubric tag (see [edit-severity-rubric.md](edit-severity-rubric.md)) involving personal data

**Severity does not depend on whether a customer saw it.** A fragment sitting in
the index is an incident before it ever reaches a draft.

### Response by location

| Location | Required response |
|---|---|
| **Source corpus** (pre-index) | Fix the redaction rule as a pipeline bug; add a regression test; re-run the hand-audit on a **fresh** sample |
| **Index / embeddings** | **Purge the affected items and re-embed.** A prompt or filter change does not remove retrievable content. Use the per-passage provenance record (P1-AC-16) to scope the purge; if provenance cannot resolve it, purge and rebuild the whole index |
| **A draft** (not yet sent) | Quarantine the draft; check whether the source is corpus or generation; apply the corpus response if corpus |
| **A sent reply** | Above, plus the customer-facing remediation path: `__________` |
| **Logs / traces** | Purge the affected records; confirm retention and downstream copies |
| **Model-provider request** | Record it; confirm the provider's retention terms; notify per the contract |

### Timing and notification

| Field | Value |
|---|---|
| **Notify within** | `______` hours of discovery |
| **Notified: data owner** | `__________` |
| **Notified: bar owner** | `__________` |
| **Notified: privacy / legal** | `__________` |
| **Who can halt the pilot** | `__________` |
| **Purge + re-embed completed within** | `______` hours |

### Does the pilot pause?

> `__________________________________________`
>
> *Bar owner. State whether an incident pauses drafting automatically, or on
> whose judgement, and what has to be true to resume. "It depends" here means it
> will be decided by whoever is in the room at the time.*

### Rehearsal, not description

The purge-and-re-embed path is **exercised once on a planted synthetic fragment
before Phase 2**, with elapsed time recorded (P1-AC-11). A response that has
never been run is a paragraph, not a control.

This repo already carries a rehearsal against the synthetic corpus: a planted
card fragment is redacted at ingestion, and `purge()` removes the item and its
provenance (`tests/drafting.test.ts`). That proves the mechanism exists. It does
not prove the operational path — who is called, how fast the real index rebuilds,
whether anyone notices — which is what the Phase 1 rehearsal is for.

### Sign-off

| | |
|---|---|
| Bar owner (name) | `__________` |
| Data owner (name) | `__________` |
| Signature / recorded approval | `__________` |
| Date | `__________` |

---

## Incident log

Every incident recorded here, whether or not it reached a customer.

| # | Date found | Location | What | Response executed | Elapsed | Closed by |
|---|---|---|---|---|---|---|
| | | | | | | |
