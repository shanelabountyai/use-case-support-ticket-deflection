# Measurement design

**Status: unsigned. The baseline half cannot be recovered once the pilot starts.**

Four things that have to exist before anything is measured: the list of ticket
types in scope, the pre-pilot baseline, the rule for drawing the 300-ticket
sample, and confirmation the agent console can actually capture a severity tag.
*(P0-AC-15, 16, 17, 18.)*

**The baseline is the urgent one.** Once agents start seeing drafts, the unaided
comparison population no longer exists. It cannot be reconstructed later.

---

## 1. In-scope question types — P0-AC-17

The plan says "the same 40-odd question types". That phrase cannot be a sampling
frame, a baseline segmentation, or a scope boundary. Enumerate them.

| # | Question type | Approx. monthly volume | Answerable from current help centre? | In pilot |
|---|---|---|---|---|
| 1 | | | ☐ yes ☐ partly ☐ no | ☐ |
| 2 | | | ☐ yes ☐ partly ☐ no | ☐ |
| … | | | | |

**Assumption being tested here, not assumed.** The plan assumes these types can
be enumerated from three years of resolved tickets and that a majority are
answerable from current help-centre content. Filling the third column is how
that assumption gets confirmed or falsified — and if a large share come back
"no", the retrieval work in Phase 1 is larger than estimated and the owner
should hear it now.

| Field | Value |
|---|---|
| **Types enumerated** | `______` |
| **Types in the pilot** | `______` |
| **Weekly in-scope ticket volume** | `______` |
| Signed by support lead | `__________` date `__________` |

> **Weekly volume is load-bearing and currently unknown.** It decides whether
> shadow mode yields a scoreable sample, and whether 300 sampled tickets over
> four weeks is reachable at all. If it is not reachable, that is an owner
> decision — extend the window, or accept a smaller sample with the reduced
> confidence stated — taken **before** the measurement, not at its end.

---

## 2. Pre-pilot baseline — P0-AC-16

Capture before any agent sees a draft.

| Field | Value |
|---|---|
| **Window measured** | `__________` to `__________` |
| **Date recorded** | `__________` |
| **Segmentation rule** *(must be reproducible verbatim after the pilot)* | `__________________________________________` |
| **CSAT, in-scope segment** | `______` (n = `______`) |
| **Reopen rate, in-scope segment** | `______`% (n = `______`) |
| **Median time-to-send, in-scope segment** | `______` |

**Use an identical segmentation rule for the post-pilot comparison** (P5-AC-5).
A differently-segmented "after" number is not a comparison.

**Time-to-send is captured now on purpose.** Phase 5's rubber-stamping check
needs a send-time distribution to compare against, and "faster than before" is
meaningless without a before.

### If the segment is too thin

Survey volume segmented by ticket type is often small, and a CSAT difference on
a thin segment is noise. Decide now, not when the number is disappointing:

> **Minimum n for the CSAT comparison to be meaningful:** `______`
>
> **If the segment is thinner than that:** `__________________________________________`
>
> *Options include: reopen rate becomes the primary guardrail with CSAT reported
> as directional; the window lengthens; the comparison widens. Do not silently
> substitute an unsegmented baseline — that measures a different population.*

### Which CSAT comparison is the bar?

The project bar says "CSAT must not drop versus the pre-pilot baseline". Phase
5's exit says "pilot-segment CSAT". These are different tests with different
sensitivity.

> The bar is measured on ☐ pilot segment only ☐ organisation-wide
>
> Bar owner: `__________`

### What counts as "not below"?

> ☐ any decrease fails  ☐ a decrease beyond `______` fails  ☐ other: `__________`
>
> *Set now. A threshold chosen after seeing the number is not a threshold.*

---

## 3. Sampling frame for the 300 — P0-AC-15

The audit's sharpest finding. With a volunteer agent group and an explicit
"request a draft" button, agents self-select the tickets a draft will handle
well — and only tickets where a draft was requested can be tagged. The
minor-edit rate is then biased upward **by construction**, and no amount of
careful scoring afterwards repairs it.

### The frame

The 300 are drawn **at random across the in-scope question types**, from a frame
that includes:

- ☑ tickets where a draft was requested and tagged
- ☑ **tickets where the agent declined to request a draft**
- ☑ **tickets where the system abstained**

The last two are the point. A frame containing only the first measures "how good
is this when an agent already expected it to be good", which is not the question
the bar asks.

| Field | Value |
|---|---|
| **Draw procedure** *(reproducible by a third party)* | `__________________________________________` |
| **Stratified by question type?** | ☐ yes, proportional to volume ☐ yes, equal per type ☐ no |
| **Random seed recorded where** | `__________` |
| **Who draws the sample** | `__________` |
| **When drawn** | ☐ continuously through the window ☐ at the end from the window's population |

### How the untaggable cases are scored

A ticket where no draft was requested has no severity tag by definition. It
still belongs in the frame, and it still needs a disposition.

> **Tickets with no draft requested are recorded as:** `__________`
>
> **Tickets where the system abstained are recorded as:** `__________`
>
> *Support lead and bar owner. These choices move the headline number
> substantially, which is exactly why they are made before the window opens.*

### Composition is reported, not just the rate

Phase 5 reports counts of drafted-and-tagged, draft-declined and abstained
alongside the minor-edit rate (P5-AC-2). A sample consisting only of
drafted-and-tagged tickets fails that criterion.

---

## 4. Console feasibility — P0-AC-18

The plan assumes the ticketing platform exposes a surface that can render a
draft into the agent's editor **and** capture a one-click severity tag. If that
is false, the measurement design needs rework here — in week one — not in Phase 4.

| Check | Finding | Verified against |
|---|---|---|
| Draft renders into the agent's editor | `__________` | ☐ real platform ☐ vendor claim |
| One-click severity tag capturable | `__________` | ☐ real platform ☐ vendor claim |
| Tag capturable when **no draft was requested** | `__________` | ☐ real platform ☐ vendor claim |
| Tag capturable when the system **abstained** | `__________` | ☐ real platform ☐ vendor claim |
| Diff between draft and sent reply obtainable | `__________` | ☐ real platform ☐ vendor claim |
| Send time and reopen status obtainable per ticket | `__________` | ☐ real platform ☐ vendor claim |
| Ticketing credential can be issued **read-only** | `__________` | ☐ real platform ☐ vendor claim |

**Rows 3 and 4 are the ones that get missed.** They are what makes the sampling
frame above measurable rather than aspirational, and a platform that can tag a
draft cannot necessarily tag the absence of one.

**The read-only credential row matters for a different reason.** Drafts must
never be auto-sent; a credential that cannot send makes that a property of the
system rather than a policy (P2-AC-10).

> **If any row fails:** raise to the bar owner before Phase 1 starts. The
> fallback — diff-based proxies plus support-lead sampling — changes what ≥80%
> means and must be accepted explicitly, not discovered in Phase 4.

---

## Sign-off

| | Name | Date |
|---|---|---|
| Support lead — in-scope types, baseline, sampling frame | `__________` | `__________` |
| Bar owner — CSAT comparison basis, "not below" rule, untaggable dispositions | `__________` | `__________` |
