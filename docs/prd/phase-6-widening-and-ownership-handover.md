# PRD — Phase 6: Widening and ownership handover

**Milestone:** Phase 6 — Widening and ownership handover
**Risk owner:** Support lead
**Planned duration:** ~2 weeks *(estimate)*
**Milestone exit criterion (this PRD's acceptance bar):** Bar continues to hold as volume and agent coverage widen; named owner accountable for corpus freshness, golden-set curation and periodic judge re-validation; ingestion and reviewer-agreement monitoring live with alerting; no-auto-send constraint re-verified post-widening.

---

## Context

Phase 5 measured a volunteer group on in-scope question types over four weeks. Phase 6 asks the two questions that decide whether the pilot becomes a system: **does the result survive contact with the rest of the agent population and the rest of the question types**, and **who owns it when the builder stops**.

Both halves fail quietly if not built for.

**Widening is a re-measurement, not a rollout.** The Phase 5 group volunteered. Wider agents did not, are less invested, and will use the drafts differently — some more trustingly, which raises the rubber-stamping risk, and some not at all, which raises the coverage question. Widening the question types brings in the ones Phase 1's per-type retrieval report flagged as weaker (P1-AC-14). Both changes are exactly the kind that move a 82% to a 71%, so the bar is re-evaluated after widening rather than assumed to carry.

**Ownership without monitoring is a name on a page.** The corpus goes stale continuously — the help centre changes, macros change, ticket patterns change — and staleness is the failure mode the plan named as the main technical risk. An owner who has no signal that freshness has degraded cannot act on it. Alerting on ingestion and on reviewer agreement is what makes the ownership real.

**Reviewer agreement drifts.** The rubric was calibrated in Phase 0, re-validated on pipeline drafts in Phase 2, and used to score in Phases 3–5. As new agents join, they were never calibrated on it, and the instrument that measures the bar quietly changes. Monitoring agreement is monitoring the measurement.

**The no-auto-send constraint is re-verified because widening is when it is most likely to erode** — more agents, more volume, more pressure to speed up, and a plausible-sounding request for a "send as-is" shortcut for drafts that need no edits. That request is a change to the compliance constraint, not a feature.

## Scope

### In scope

- **Widening to the remaining agents** in the in-scope population, in a recorded sequence.
- **Widening to remaining question types**, including those flagged weak in P1-AC-14, each admitted on evidence rather than by default.
- **Re-measurement of the bar post-widening**, using the Phase 5 sampling frame and rubric, reported with coverage/abstention.
- **Rubric onboarding for new agents**, with agreement measured rather than assumed.
- **Named long-term owner** for corpus freshness, golden-set curation, and periodic judge re-validation — one accountable individual per responsibility, all three assigned.
- **Ingestion monitoring with alerting**: ingestion failures, staleness of indexed material against the P0-AC-9 threshold, and index/source drift.
- **Reviewer-agreement monitoring with alerting**, against the P0-AC-4 floor.
- **Periodic judge re-validation schedule**, if an LLM-judge is in use per P3-AC-13.
- **No-auto-send re-verification** post-widening, structurally and at the credential.
- **Redaction re-verification** post-widening, including on any newly-admitted question types whose ticket content may carry different sensitive-data shapes.
- **Handover documentation**: how to run the pipeline, how to re-run the golden set, how to execute the PII incident rule, how to roll back.

### Out of scope

- Any auto-send capability, in any form, at any level of measured quality.
- New architecture, new retrieval strategies, or model changes not required by widening — a widened pilot that is also a rebuilt pilot cannot tell which change moved the number.
- Extending to ticket types outside the in-scope frame agreed in P0-AC-17 without the support lead admitting them explicitly.
- Re-opening the acceptance bar, the rubric, the abstention band, or the rollback triggers.

## Acceptance criteria

Each criterion is independently testable and traces to the milestone exit criterion or to a named audit fix.

| # | Criterion | How it is tested |
|---|---|---|
| **P6-AC-1** | Widening is executed in a recorded sequence — which agents and which question types were added, when — so a change in the bar can be attributed. | Sequence record with dates; a single simultaneous widening that moves the number tells nobody why. |
| **P6-AC-2** | The bar is re-measured post-widening using the P0-AC-15 sampling frame and the P3-AC-3 rubric version, and reported against ≥80%. | A post-widening number exists; it is not the Phase 5 number restated. |
| **P6-AC-3** | The coverage/abstention rate is reported alongside the post-widening minor-edit rate and compared against the P0-AC-11 band. *(P0-AC-11)* | Both numbers co-located, as in every prior phase. |
| **P6-AC-4** | Per-question-type results are reported for newly-admitted types, and any type below the bar is named rather than absorbed into the aggregate. | Per-type table; the aggregate alone fails this criterion. |
| **P6-AC-5** | CSAT and reopen rate for the widened population are compared against the P0-AC-16 baseline using the identical segmentation rule. | Like-for-like comparison shown. |
| **P6-AC-6** | New agents have been onboarded to the rubric and their tagging agreement measured against the P0-AC-4 floor before their tags count toward the bar. | Onboarding record plus an agreement figure per cohort. |
| **P6-AC-7** | A named individual is accountable for **corpus freshness**, with the responsibility written down and accepted. | A name, not a team; acceptance recorded. |
| **P6-AC-8** | A named individual is accountable for **golden-set curation**, including adding new failure classes and red-team findings. | A name; acceptance recorded. |
| **P6-AC-9** | A named individual is accountable for **periodic judge re-validation**, or a written statement that no judge is in use per P3-AC-14. | Either a name and a schedule, or an explicit no-judge statement. |
| **P6-AC-10** | Ingestion monitoring is live with alerting: ingestion failures, and material exceeding the P0-AC-9 staleness threshold, both alert to a named recipient. | Trigger each condition deliberately; the alert arrives at the named recipient. |
| **P6-AC-11** | Reviewer-agreement monitoring is live with alerting against the P0-AC-4 floor. | Simulate agreement below floor; the alert fires. |
| **P6-AC-12** | The no-auto-send constraint is re-verified post-widening, structurally and at the credential. *(compliance constraint)* | P2-AC-9 and P2-AC-10 checks pass at the post-widening commit. |
| **P6-AC-13** | Redaction is re-verified post-widening, including against ticket content from newly-admitted question types, with a fresh hand-audit at the P0-AC-14 sample size. *(pii constraint)* | New audit record, dated post-widening; misses treated as bugs per P1-AC-8. |
| **P6-AC-14** | Handover documentation exists covering: running the pipeline, re-running the golden set, executing the P0-AC-13 PII incident rule, and executing rollback. | Someone other than the builder completes each of the four from the documentation alone. |
| **P6-AC-15** | Rollback mechanics are re-verified at the widened scale — stopping drafts for all agents, timed. | Rehearsal record with elapsed time at the wider footprint. |
| **P6-AC-16** | If the bar does **not** hold post-widening, the response follows the pre-committed triggers (P4-AC-10) and the failure rule (P0-AC-12) rather than a new judgement, and the decision record cites the numbers. *(audit fix 3)* | Decision record shows measured-versus-committed; widening is narrowed, held, or rolled back per the rule. |
| **P6-AC-17** | The schedule position against the funded quarter is stated in the final record. *(audit fix 1)* | Elapsed total recorded; a reporting requirement, not a gate. |

## Dependencies

- **Phase 5 complete with a widen decision** taken against the pre-committed triggers. If Phase 5 said hold or roll back, this phase does not run.
- **Named individuals willing and authorised to accept the three ownership responsibilities** (P6-AC-7/8/9). Raised in Phase 0 (P0-AC-19); if the Phase 6 owner slot was blank then, it is blocking now.
- **Alerting infrastructure and a named recipient** for P6-AC-10 and P6-AC-11.
- **Agent time for rubric onboarding** across the wider group (P6-AC-6).
- **Phase 1's per-type retrieval report** (P1-AC-14) to decide which new question types are admissible on evidence.
- **Sufficient volume in the widened population** to re-measure the bar within the phase — the ~2-week estimate does not obviously contain a re-measurement of the size Phase 5 used *(estimate; see Open question 1)*.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **The bar does not hold post-widening**, because volunteers were not representative and the new question types are the ones retrieval covered worst. | Expected as a real possibility, not a surprise. P6-AC-1 sequences the widening so the cause is attributable, P6-AC-4 names failing types instead of averaging them, and P6-AC-16 routes a shortfall through the pre-committed rules. Narrowing back to the types that hold is a legitimate outcome. |
| **Rubber-stamping increases with wider adoption.** New agents inherit a tool the pilot group already trusts, without having watched it fail. | The Phase 5 rubber-stamping checks (send-time, reopen rate, blind spot-checks) should continue through widening, not stop with the pilot. Reviewer-agreement alerting (P6-AC-11) is the standing version of the same concern. |
| **Ownership names are assigned without capacity.** Corpus freshness is continuous work; a name attached to no time is the same as no name. | P6-AC-7/8/9 require acceptance recorded, not assignment announced. If nobody accepts, that is an escalation to the owner and a live risk to the system's lifespan — say so rather than closing the phase. |
| **Monitoring exists but alerts nowhere anyone reads.** | P6-AC-10 and P6-AC-11 require the alert to be *triggered* and to arrive at a named recipient, not merely configured. |
| **The two-week estimate cannot contain a real re-measurement.** Phase 5 needed four weeks for 300 tickets; a credible post-widening measurement is not obviously faster. | Stated as an estimate. If the re-measurement needs longer, it needs longer — a re-measurement compressed to fit the estimate is the same as not re-measuring. Raise it to the owner with the schedule position (P6-AC-17). |
| **A "send as-is" shortcut is requested** for drafts that need no edits, justified by the measured quality. | Out of scope by construction and re-verified structurally (P6-AC-12). The constraint is that drafts are never auto-sent; a quality result is not an argument against it, and changing it requires the owner and the compliance position to be revisited explicitly. |
| **New question types bring different sensitive-data shapes** — refunds carrying card fragments, address changes carrying full addresses — that the Phase 1 redaction rules never saw. | P6-AC-13 requires a fresh hand-audit at the P0-AC-14 sample size, on the new content, rather than trusting the Phase 1 result to generalise. |
| **The builder leaves and the documentation is the builder's memory.** | P6-AC-14 requires someone else to complete all four procedures from the documentation alone. A walkthrough with the builder present tests nothing. |

## Open questions

1. **How large must the post-widening re-measurement be** to be credible, and does it fit in two weeks at the widened volume? The exit criterion says the bar "continues to hold" without specifying how that is established. Set the size and the window before widening starts.
2. **Which remaining question types are admissible**, and who decides? P1-AC-14 named the weak ones. Admitting them by default is how a held bar becomes a missed one.
3. **Does the pilot's rubber-stamping monitoring continue indefinitely, or stop at Phase 6?** Oversight is a standing requirement, not a pilot artefact. If it stops, the evidence that review is genuine stops with it.
4. **Who funds and staffs corpus freshness after handover?** The named owner needs recurring time. Unstated in the plan and not a detail the builder can assume.
5. **What is the re-validation cadence for the rubric itself**, as agents turn over? Reviewer-agreement alerting catches drift; it does not decide when to recalibrate.
6. **What is the end-of-life or renewal decision point for this system**, and who takes it? The plan ends at handover with no review date. A system nobody re-decides is a system that decays until it fails visibly.

---

*Every duration in this document is a planning estimate, not a commitment. No benchmark, vendor requirement, or ROI figure is asserted. This PRD derives its acceptance criteria from the Phase 6 exit criterion, the project acceptance bar, and the independent audit's stated fixes; it does not introduce a new bar or loosen an existing one.*
