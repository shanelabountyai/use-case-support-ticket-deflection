# Edit-severity rubric

**Status: DRAFT instrument. Not yet calibrated, not yet signed.**

The project acceptance bar is *≥80% of drafts sent with only minor edits*. This
document is what makes "minor" a measurement instead of an opinion. Until the
sign-off block at the bottom is filled in, no phase may report a minor-edit rate.

---

## What is being tagged, and what it is not

A tagger sees a **pair**: a starting point, and the reply the agent actually
sent. They tag how far the sent reply moved from the starting point.

**In Phase 0 the starting point is a historical artefact, not a pipeline draft.**
No pipeline drafts exist yet. The pairs are what an agent began from — a macro,
a prior similar reply, or a blank editor — and what they sent. *(P0-AC-5.)*

This is a proxy, and it is a real limitation rather than a formality. Human
starting points fail in different shapes from model output: a stale macro is
wrong in ways an agent recognises on sight, while a model draft tends to be
fluent, plausible, and wrong in one specific clause. A rubric that discriminates
well on the first may discriminate poorly on the second.

**Therefore this rubric is re-validated on real pipeline drafts in Phase 2,
before it is used to judge the bar.** Agents re-tag a set of actual drafts, and
inter-rater agreement is measured again (P2-AC-12). If agreement drops
materially, the rubric is revised *then* — not after Phase 3's scores are
visible, when revising it would be unfalsifiable. Phase 3 scores with whichever
version survives that re-validation (P3-AC-3). *(P0-AC-6.)*

> ⚠️ **Open question before tagging can start.** This assumes the ticketing
> system retains a recoverable starting point per ticket. If it retains only the
> sent reply, these pairs do not exist in the assumed form and the calibration
> set has to be built differently — e.g. pairing a macro's current text against
> what was actually sent. Confirm before booking the tagging session.

---

## The tiers — DRAFT, for the agents to revise

These are a proposal to react to, not a decision. The calibration session
(below) is where agents argue with them, and the structure is expected to change.
What must **not** change afterwards is the tier that a given real edit falls in.

| Tier | Name | What it means | Illustrative examples |
|---|---|---|---|
| **0** | Sent as-is | Nothing changed but whitespace or the greeting/sign-off block. | Draft sent unedited; "Hi there" → "Hi Sam". |
| **1** | Cosmetic | Wording, tone or formatting changed. No fact, instruction, or figure altered; no content added or removed. | Reordered two paragraphs; softened a sentence; split a list. |
| **2** | Light substantive | One fact, figure, link or instruction corrected or added, or one short passage cut. The reply's shape and answer are unchanged. | Corrected "5 business days" to "7"; added the tracking link; removed a paragraph that did not apply. |
| **3** | Heavy substantive | Multiple corrections, or one correction that changes what the customer is told to do. The draft was a usable skeleton but not a usable answer. | Draft answered the wrong one of two questions asked; policy cited was superseded and the whole middle section was rewritten. |
| **4** | Rewritten | Little of the draft survives, or the agent started again. | Draft discarded; reply written from scratch or from a different macro. |
| **5** | Harmful if sent | The draft contained something that would have caused damage had it gone out unedited: a wrong policy stated confidently, another customer's information, unredacted personal data, or a commitment the business cannot honour. | Any occurrence. |

### Tier 5 is counted separately and always

A tier-5 draft is not a bad score, it is an incident. It is excluded from the
minor-edit rate's numerator, reported as its own count wherever the bar is
reported, and — where it involves personal data or cross-customer content — it
triggers the PII incident rule in [decision-rules.md](decision-rules.md)
regardless of what the aggregate looks like. **A single tier-5 in a measurement
window is a finding that must be surfaced to the bar owner, not averaged away.**

### Which tiers count as "minor"

> **`__________________________________________`**
>
> *To be completed and signed by the support lead (P0-AC-7). Leave blank until
> after calibration — deciding this before seeing how the tiers behave on real
> pairs is how a bar becomes unfalsifiable.*

The stricter this line, the more meaningful ≥80% is. Note the arithmetic before
signing: if tiers 0–2 count as minor, the bar permits every draft to need a
factual correction. If tiers 0–1 count, the bar demands drafts be factually
right. These are very different products and only one of them deflects work.

### Tie-break rules

A reply carrying edits of two severities is tagged at the **higher** tier. Three
cases that will otherwise be argued mid-session:

1. **Many cosmetic edits do not sum to substantive.** Ten reworded sentences
   with no fact changed is tier 1.
2. **A correction inside an otherwise untouched draft is tier 2, not tier 1** —
   however small the correction looks. If it changed what the customer is told,
   it is substantive.
3. **Additions count as edits.** A draft that was correct but incomplete, where
   the agent added a needed paragraph, is tier 2 — not tier 0.

---

## Calibration protocol

**Set:** ~40 historical pairs, drawn across the in-scope question types in
[measurement-design.md](measurement-design.md), not the convenient ones. The
draw must include pairs that were heavily rewritten — a rubric that never sees a
tier-4 cannot be shown to discriminate.

**Taggers:** three agents, tagging **independently and without conferring**
(P0-AC-2). Record the presentation order; if it is the same for all three,
record that too, as it is a shared-fatigue confound.

**Method:** each tagger fills one row per pair in `calibration/tagger-<name>.csv`:

```csv
pair_id,tier,note
p-001,2,corrected the refund window from 14 to 30 days
p-002,0,
```

**Agreement:** computed with `npm run agreement -- docs/phase-0/calibration/*.csv`,
which reports Fleiss' kappa alongside raw agreement. Record **kappa**, not raw
agreement: with six tiers and a skewed distribution, raw agreement flatters a
rubric that is not discriminating. Both figures go in the record below. *(P0-AC-3.)*

**Agreement floor:**

> **κ ≥ `_______`** — *number set by the support lead before tagging begins, not
> after seeing the result.*

**If agreement lands below the floor:**

> `__________________________________________`
>
> *Procedure to be written before tagging starts (P0-AC-4). It must name: how
> many revise-and-retag rounds are permitted, who decides to stop, and what
> happens if the floor is still not met after the last round — proceed with a
> coarser rubric, add a fourth tagger, or hold the phase. Deciding this while
> looking at a disappointing kappa is how the floor gets quietly lowered.*

---

## Calibration record

*Completed after the tagging session.*

| Field | Value |
|---|---|
| Date of session | `__________` |
| Taggers (three names) | `__________` |
| Pairs tagged | `______` |
| Question types covered | `__________` |
| Tier distribution observed | `__________` |
| Raw agreement | `______` |
| **Fleiss' κ** | `______` |
| Floor met? | ☐ yes ☐ no |
| Artefact type | **Historical agent replies, not pipeline drafts** *(P0-AC-5)* |
| Revise-and-retag rounds used | `______` |

**Discrimination check.** If no pair was tagged 3 or above by any tagger, the
sample was not drawn across the real range and the calibration does not stand —
redraw. A rubric under which everything passes measures nothing.

---

## Sign-off

By signing, the support lead confirms the tier definitions, the tie-break rules,
and the line above stating which tiers count as **minor edits** for the purposes
of the ≥80% acceptance bar.

| | |
|---|---|
| Support lead (name) | `__________` |
| Signature / recorded approval | `__________` |
| Date | `__________` |

**Re-validation due:** Phase 2, on real pipeline drafts, before this rubric is
used to score anything against the bar (P2-AC-12). Record the second kappa here:

| Field | Value |
|---|---|
| Re-validation date | `__________` |
| Drafts re-tagged | `______` |
| **Fleiss' κ on pipeline drafts** | `______` |
| Diverged from Phase 0? | ☐ no ☐ yes — revision required before Phase 3 |
