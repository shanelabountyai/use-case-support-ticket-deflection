# PRD — Phase 4: Console integration and shadow mode

**Milestone:** Phase 4 — Console integration and shadow mode
**Risk owner:** Builder
**Planned duration:** ~2 weeks *(estimate)*
**Milestone exit criterion (this PRD's acceptance bar):** Draft renders in the console with the diff and severity-tag capture working end to end; shadow-mode comparison on a live sample scored by the support lead shows quality consistent with offline results; rollback triggers and thresholds pre-committed in writing by the owner; macro fallback path verified.

---

## Context

Phase 4 is where the build meets the agent's actual working surface, and where the measurement instrument for Phase 5 is constructed. Both halves matter, and the second one is easy to under-build because it produces nothing visible.

**The severity tag is the measurement.** The ≥80% bar is measured from agents' one-click severity tags across 300 sampled tickets. If tagging is awkward, skippable, or ambiguous at the moment of the click, the bar is measured with a broken instrument and no later analysis repairs it. The tag capture is not a UI nicety; it is the apparatus.

**Shadow mode is the first partly-independent check.** Phase 3's scores came from agents who are the tool's beneficiaries and who have been close to it since Phase 0. Shadow mode compares system drafts against what agents actually sent, unaided, scored by the support lead. It is the only look at real traffic before the pilot goes live, and drafts produced in shadow are never shown to the agent handling the ticket — otherwise it is not shadow.

**Rollback triggers become numbers here.** The plan commits to "rollback triggers and thresholds pre-committed in writing by the owner." Phase 0 already fixed the pre-release failure rule (P0-AC-12) — that covers failing to reach the bar. This phase covers post-release degradation: what metric, what threshold, what window, and the mechanics of actually pausing.

**The macro fallback path is what agents use when the system is off.** Verifying it is not ceremony: if the pilot is rolled back mid-Phase-5, agents fall back to the macro library — which the Phase 1 triage has just quarantined parts of. The fallback has to be a path that still works after quarantine, and the quarantine report is what tells agents which macros survived.

**No send capability still holds.** Phase 2 removed it structurally. Console integration is the phase where a send path is most likely to creep back in, because the draft now sits inside a UI that has a send button of its own — the platform's. The draft lands in the agent's editor; the agent sends. Nothing in this build sends.

## Scope

### In scope

- **Draft rendering in the agent's existing ticket view**, on the surface confirmed feasible in P0-AC-18.
- **Citation inspection**: the agent can see, per draft, which reference material supports it and open the source, at the granularity stated in P2-AC-3.
- **Diff view**: what the agent's sent reply changed relative to the draft, computed and displayed.
- **One-click severity tag capture** using the Phase 0 rubric's tiers, recorded against the ticket with the draft's provenance.
- **Abstention rendering**: when the system abstains, the agent sees an explicit abstention, not an empty draft area.
- **Shadow mode**: drafts generated for live in-scope tickets and stored, never surfaced to the handling agent, paired with the reply the agent actually sent.
- **Support-lead scoring of the shadow sample** against the same rubric used in Phase 3, with the comparison to offline results written up.
- **Rollback triggers and thresholds**, pre-committed in writing by the owner: metric, threshold, rolling window, and who can pull the trigger.
- **Rollback mechanics**: the actual mechanism to stop drafts appearing, exercised once rather than described.
- **Macro fallback path verified** against the post-quarantine macro library.
- **Instrumentation for Phase 5**: send-time capture, reopen-rate capture, tagging-compliance capture, and the fields the P0-AC-15 sampling frame needs — including which tickets had no draft requested and which the system abstained on.

### Out of scope

- Any live release to customers beyond what shadow mode implies (shadow drafts are not shown to agents and never reach customers) — Phase 5.
- The 300-ticket measurement itself — Phase 5.
- Widening beyond the volunteer group or beyond the in-scope question types — Phase 6.
- Any send capability. Unchanged from Phase 2 and re-verified here.
- Changing the rubric, the bar, the abstention band, or the Phase 0 thresholds.
- Console features beyond draft, citations, diff, tag and abstention — the exit criterion names these and nothing else.

## Acceptance criteria

Each criterion is independently testable and traces to the milestone exit criterion or to a named audit fix.

| # | Criterion | How it is tested |
|---|---|---|
| **P4-AC-1** | A draft renders in the agent's existing ticket view for an in-scope ticket, end to end, against the real platform surface. | Demonstrated on the platform, not a mock; recorded. |
| **P4-AC-2** | Citation inspection works: from a rendered draft the agent can identify the supporting reference material and open it, at the granularity stated in P2-AC-3. | An agent unfamiliar with the build can check one claim's source without instruction. |
| **P4-AC-3** | The diff between the draft and the agent's sent reply is computed and displayed. | Edit a draft, send, and confirm the diff reflects exactly what changed. |
| **P4-AC-4** | One-click severity tagging captures a tier from the Phase 0 rubric and stores it against the ticket with the draft's provenance (P2-AC-13). | Tag three tickets; all three records carry tier, ticket, and draft version. |
| **P4-AC-5** | Tagging is capturable for every ticket in the P0-AC-15 sampling frame — including tickets where **no draft was requested** and where the **system abstained**. *(known gap: sampling design)* | Records exist for all three cases; a frame that can only record tagged drafts fails this criterion. |
| **P4-AC-6** | Abstention renders as an explicit abstention in the console, distinguishable from a failed or empty draft. | Trigger an abstention on a held-out ticket; the agent sees the distinction without being told. |
| **P4-AC-7** | Shadow mode runs on a live in-scope sample: drafts are generated and stored, paired with the reply actually sent, and **never surfaced to the handling agent**. | A test or attestation that the shadow path has no rendering surface; agents confirm they saw nothing. |
| **P4-AC-8** | The support lead has scored the shadow sample against the Phase 3 rubric version, and the comparison to offline results is written up including the coverage/abstention rate. *(P0-AC-11)* | Scored sheets plus a written comparison naming both numbers. |
| **P4-AC-9** | Shadow-mode quality is consistent with Phase 3's offline results, or the divergence is characterised — which failure classes moved, and in which direction. | An unexplained gap between offline and shadow is a finding that blocks Phase 5, not a footnote. |
| **P4-AC-10** | Rollback triggers are recorded with, for each: a metric, a numeric threshold, a rolling window, and the named individual who can pull it. Signed by the owner. | No trigger uses words like "materially"; each carries a number and a window. |
| **P4-AC-11** | Rollback **mechanics** have been exercised at least once: drafts stopped appearing, within a measured elapsed time, and the elapsed time recorded. | Rehearsal record with a timestamp, not a description of the intended procedure. |
| **P4-AC-12** | The macro fallback path is verified against the **post-quarantine** macro library: agents can find and use the surviving macros, and the quarantine report is available to them. | Walk an agent through handling an in-scope ticket with drafts disabled; they complete it using surviving macros. |
| **P4-AC-13** | Instrumentation captures send time, reopen rate, and tagging compliance per ticket, for the fields Phase 5's rubber-stamping checks need. | Query the store for a handled ticket; all three resolve. |
| **P4-AC-14** | The service still contains **no send capability**, re-verified structurally and at the credential after console integration. *(compliance constraint)* | P2-AC-9 and P2-AC-10 checks re-run and passing at this phase's commit. |
| **P4-AC-15** | Redaction remains upstream of the provider call on the console path, re-verified. *(pii constraint)* | P2-AC-8's structural test passes on the integrated path. |
| **P4-AC-16** | The system version scored in shadow mode is recorded — prompt version, retrieval config, model identifier — and compared against the version Phase 3 scored. | If they differ, the difference is named; otherwise the comparison in P4-AC-9 is not like-for-like. |

## Dependencies

- **Phase 3 complete**, with a result that passed the P0-AC-12 rule. If Phase 3 took the off-ramp, this phase does not run.
- **P0-AC-18's console feasibility finding.** If the platform cannot capture a one-click tag, P4-AC-4 and P4-AC-5 need a different design and the owner has already been told in Phase 0.
- **P0-AC-15's sampling frame definition**, which determines what P4-AC-5 must be able to record.
- **The Phase 1 macro quarantine report** (P1-AC-15), for the fallback verification.
- **Owner availability to sign rollback triggers** (P4-AC-10) — signing after shadow results are visible weakens them the same way a post-hoc failure rule would.
- **Support-lead time to score the shadow sample.** Alongside a two-week phase estimate, this is the critical path *(estimate)*.
- **Live in-scope ticket traffic** during the shadow window, sufficient to produce a sample the support lead can score.
- **Agents' consent and awareness** that shadow drafts are being generated on their tickets, even though they cannot see them.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **The severity tag is the measurement instrument and it is built last, in a two-week phase, alongside everything else.** A clumsy tag produces a compliance problem that looks like a quality result. | Build and test tag capture before diff and citation polish — it is the only console element the bar depends on. P4-AC-5 forces it to cover the harder cases (no draft requested, abstained) rather than just the happy path. Tagging compliance is instrumented (P4-AC-13) so poor compliance is visible during Phase 5 rather than at its end. |
| **Shadow drafts leak to the handling agent**, contaminating both the shadow comparison and the unaided baseline. | P4-AC-7 requires the shadow path to have no rendering surface at all, verified structurally, rather than relying on a flag that could be flipped. |
| **Shadow results diverge from offline results** and the divergence is rationalised. Real tickets are messier than a golden set — multi-question, badly written, missing context. | P4-AC-9 makes characterising the divergence a gate: which failure classes moved and how. A gap between a curated set and live traffic is expected; an uncharacterised gap means Phase 5's 300-ticket measurement is being entered blind. |
| **Rollback is a trigger with no mechanism.** Everyone agrees drafts should stop; nobody has stopped them. | P4-AC-11 requires the mechanics exercised and timed. A rollback that takes a day to execute is a different control from one that takes a minute, and the difference should be known before it is needed. |
| **The macro fallback is verified against the pre-quarantine library**, so a rollback drops agents onto macros Phase 1 just declared untrustworthy. | P4-AC-12 verifies against the post-quarantine state, with the quarantine report available to agents. |
| **A send path creeps in via the console integration** — the platform's own send button next to a draft, or a convenience "send as-is" affordance requested by an agent. | P4-AC-14 re-runs the structural checks at this phase's commit. The agent sends using the platform; this build never does. A "send as-is" request is a scope change requiring the owner and the compliance constraint to be revisited, not a UI ticket. |
| **Instrumentation for Phase 5 is treated as Phase 5's problem.** It cannot be — the data has to be captured as tickets are handled. | P4-AC-13 places it here, and P4-AC-5 places the sampling-frame fields here, because retrofitting them means the first weeks of Phase 5 are unmeasurable. |
| **Two weeks is optimistic** for console integration, shadow running long enough to yield a scoreable sample, and support-lead scoring. | Stated as an estimate. The shadow window's length is driven by live in-scope ticket volume, which nobody has quantified (Open question 2). |

## Open questions

1. **How long must shadow mode run to produce a sample the support lead can score meaningfully?** The exit criterion says "a live sample" without a size. Set the size before starting, from the same reasoning that produced the 300-ticket figure, and record it.
2. **What is the live in-scope ticket volume per week?** This determines the shadow window and, later, whether 300 sampled tickets over four weeks is achievable at all. Not stated anywhere in the plan.
3. **Do agents know shadow drafts are being generated on their tickets?** They should — both because it is their work being compared and because an agent who suspects a hidden system behaves differently. Confirm the disclosure with the support lead.
4. **What is the tagging-compliance floor below which the measurement is not valid?** The plan's assumption list already flags that poor compliance degrades the measurement to diff-based proxies plus support-lead sampling. That fallback needs a trigger number, and Phase 5 needs it before it starts.
5. **Who can pull rollback out of hours?** P4-AC-10 requires a named individual; a single name with no cover is a gap in a live pilot.
6. **Is the diff computed against the draft as generated, or as the agent last saw it** if they can regenerate? These give different edit-severity readings and the choice must be recorded before Phase 5 measures anything.

---

*Every duration in this document is a planning estimate, not a commitment. No benchmark, vendor requirement, or ROI figure is asserted. This PRD derives its acceptance criteria from the Phase 4 exit criterion, the project acceptance bar, and the independent audit's stated fixes; it does not introduce a new bar or loosen an existing one.*
