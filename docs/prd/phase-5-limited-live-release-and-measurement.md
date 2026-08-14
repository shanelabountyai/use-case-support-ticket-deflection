# PRD — Phase 5: Limited live release and the four-week measurement

**Milestone:** Phase 5 — Limited live release and the four-week measurement
**Risk owner:** Support lead
**Planned duration:** ~4–5 weeks *(estimate)*
**Milestone exit criterion (this PRD's acceptance bar):** The stated bar evaluated on 300 sampled tickets over four weeks: ≥80% of drafts sent with only minor edits, with pilot-segment CSAT not below the pre-pilot baseline. Rubber-stamping checks (blind spot-checks, send-time and reopen-rate monitoring) show review is genuine. Decision to widen, hold or roll back taken against the pre-committed triggers.

---

## Context

This is the phase the whole plan is built to reach: the acceptance bar, measured on real traffic. It is also the phase with the most ways to produce a number that is technically correct and substantively meaningless.

**The sampling frame decides the answer.** The audit named this as a gap and it is the sharpest one. With a volunteer agent group and an explicit "request a draft" button, agents self-select the tickets a draft will handle well. If the 300 are drawn only from tickets where a draft was requested and tagged, the minor-edit rate is biased upward by construction, and no amount of careful scoring fixes it. The frame is defined in Phase 0 (P0-AC-15) — random across in-scope types, **including tickets where the agent declined to request a draft and tickets where the system abstained** — and the instrumentation to record those cases was built in Phase 4 (P4-AC-5). This phase executes that frame as written.

**Coverage travels with quality.** A system that abstains heavily can pass ≥80% on what remains while deflecting almost nothing. P0-AC-11 set the band and the co-reporting rule; this phase reports the minor-edit rate and the coverage/abstention rate in the same table, every time.

**Oversight has to be genuine, not nominal.** The compliance constraint is that drafts are never auto-sent. A draft that is technically reviewed but actually rubber-stamped satisfies the letter and defeats the purpose — and it also corrupts the measurement, because a rubber-stamped draft is tagged "minor edits" while being an unreviewed draft. The exit criterion names three checks: blind spot-checks, send-time monitoring, and reopen-rate monitoring. All three are measurements of the reviewer, not of the model.

**The decision at the end is pre-committed.** Widen, hold or roll back is taken against the Phase 4 triggers (P4-AC-10) and, where the bar is missed pre-widening, the Phase 0 failure rule (P0-AC-12). Deciding against the numbers as written is the point; re-reading them favourably at the end is the failure this structure exists to prevent.

## Scope

### In scope

- **Limited live release** to a volunteer agent group, on in-scope question types only, behind the mandatory review queue — every draft lands in the agent's editor and is sent by a human or not at all.
- **The 300-ticket sample**, drawn per the P0-AC-15 frame, over four weeks.
- **Minor-edit rate measurement** against ≥80%, reported with the coverage/abstention rate.
- **Pilot-segment CSAT measurement** against the dated pre-pilot baseline from P0-AC-16, using the identical segmentation rule.
- **Reopen-rate measurement** against the same baseline.
- **Rubber-stamping checks**: blind spot-checks of sent replies by the support lead, send-time monitoring, reopen-rate monitoring.
- **Tagging-compliance monitoring**, against the floor raised in Phase 4 (Open question 4).
- **Live incident readiness**: the P0-AC-13 PII incident rule active, with the purge/re-embed path rehearsed in P1-AC-11 and rollback mechanics timed in P4-AC-11.
- **The widen / hold / roll back decision**, recorded against the pre-committed triggers with the numbers cited.
- **A written result record** naming the system version measured, so Phase 6 can tell whether widening changes the thing that was measured.

### Out of scope

- Widening to more agents or more question types — Phase 6. Widening mid-measurement invalidates the sample.
- Any change to the prompt, retrieval config, or model **during the measurement window**, unless a rollback trigger or incident forces it — in which case the window restarts or the change is recorded as a break in the series (Open question 3).
- Any auto-send capability, in any form.
- Changing the bar, the rubric, the sampling frame, the abstention band, or the rollback triggers.
- Long-term ownership assignment and monitoring/alerting — Phase 6.

## Acceptance criteria

Each criterion is independently testable and traces to the milestone exit criterion or to a named audit fix.

| # | Criterion | How it is tested |
|---|---|---|
| **P5-AC-1** | The 300-ticket sample is drawn per the P0-AC-15 frame — random across in-scope types, including tickets where no draft was requested and where the system abstained — and the draw is reproducible by a third party. *(known gap: sampling design)* | The draw procedure, its inputs and its seed are recorded; re-running reproduces the sample. |
| **P5-AC-2** | The sample composition is reported: counts of drafted-and-tagged, draft-declined, and abstained tickets. | A sample consisting only of drafted-and-tagged tickets fails this criterion. |
| **P5-AC-3** | The minor-edit rate is reported as a single number against ≥80%, scored using the rubric version from P3-AC-3, with the denominator explicitly stated. | The number, the rubric version, and the denominator all appear together. |
| **P5-AC-4** | The coverage/abstention rate is reported in the same table as the minor-edit rate and compared against the P0-AC-11 band. *(known gap: abstention has no cost)* | Both numbers co-located; a rate outside the band is a finding regardless of the edit score. |
| **P5-AC-5** | Pilot-segment CSAT is measured against the dated P0-AC-16 baseline using an identical segmentation rule, and reported as not-below or below. | The segmentation rule used is shown to match the baseline's; a differently-segmented comparison fails. |
| **P5-AC-6** | Reopen rate is measured against the P0-AC-16 baseline over the measurement window. | Number and window stated; comparison is like-for-like. |
| **P5-AC-7** | Blind spot-checks of sent replies have been performed by the support lead across the window, at a recorded cadence and sample size, checking whether the sent reply was genuinely reviewed. | Spot-check records exist, spread across the window rather than clustered. |
| **P5-AC-8** | Send-time monitoring is reported: the distribution of time between draft presentation and send, with implausibly short reviews identified. | Distribution reported, not just a mean; short-tail cases named and followed up. |
| **P5-AC-9** | The three rubber-stamping checks together support a written conclusion on whether review was genuine, with the reasoning shown. | A conclusion that cites all three signals; "no evidence of rubber-stamping" without the underlying numbers fails. |
| **P5-AC-10** | Tagging compliance is reported for the window and compared against the floor set after Phase 4. If below, the degraded measurement path (diff-based proxies plus support-lead sampling) is invoked and labelled as such in the result. | Compliance figure exists; if below floor, the result record says which method produced the headline number. |
| **P5-AC-11** | No draft was auto-sent during the window. *(compliance constraint)* | P2-AC-9 and P2-AC-10 checks pass at the released commit; the platform's send log shows a human actor on every in-scope send. |
| **P5-AC-12** | Redaction remained upstream of the provider call throughout, and no unredacted card fragment or cross-customer content reached a draft. If one did, the P0-AC-13 incident rule was executed and the incident record exists. *(pii constraint, audit fix 3)* | Structural test passing at the released commit, plus either an attestation or an incident record with the response executed. |
| **P5-AC-13** | The widen / hold / roll back decision is recorded, citing the pre-committed triggers from P4-AC-10 (and P0-AC-12 where the bar is missed) with the measured numbers next to the committed thresholds. | The decision record shows measured-versus-committed for each trigger; a decision made without that table fails. |
| **P5-AC-14** | The system version measured is recorded — prompt version, retrieval config, model identifier — and any change during the window is recorded as a break in the series. | Version record exists; if the system changed mid-window, the result states which portion of the sample used which version. |
| **P5-AC-15** | The schedule position is stated against the funded quarter, so the widen/hold decision is taken with the budget picture visible. *(audit fix 1)* | Elapsed time to date recorded against the funded window; this is a reporting requirement, not a gate. |
| **P5-AC-16** | Rollback mechanics remain exercisable: the P4-AC-11 rehearsal is repeated at least once during the window, or the mechanism is confirmed unchanged. | Rehearsal record or a signed confirmation with the reasoning. |

## Dependencies

- **Phase 4 complete**: console, tag capture including the harder frame cases, instrumentation, rollback triggers signed and mechanics timed, macro fallback verified.
- **P0-AC-15 sampling frame** and **P0-AC-16 baseline**, both dated before the pilot started. Neither can be produced now.
- **P0-AC-11 abstention band** and **P0-AC-12 failure rule**, signed.
- **A volunteer agent group** of sufficient size, and **live in-scope ticket volume** sufficient to yield 300 sampled tickets over four weeks. The volume is unquantified (Phase 4, Open question 2) and is the single largest feasibility risk in this phase.
- **Support-lead time across the full four weeks** for blind spot-checks — this is continuous effort, not a task at the end.
- **CSAT survey data flowing during the window**, attributable to ticket type at the same granularity as the baseline.
- **The owner available to take the widen/hold/rollback decision** at the window's end, against the pre-committed triggers.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **The sample is biased upward by self-selection.** Volunteer agents request drafts on tickets they expect drafts to handle; only requested drafts can be tagged. This is the audit's named gap and it inflates the headline number invisibly. | P5-AC-1 and P5-AC-2 execute the P0-AC-15 frame and force the composition to be reported. Tickets where the agent declined and where the system abstained are in the frame, so the number answers "how often does this help across in-scope work" rather than "how good is it when an agent already expected it to be good". |
| **Volunteers are the enthusiasts.** Even with a correct sampling frame, a volunteer group is not the agent population, and the result may not survive widening. | Cannot be fully mitigated in this phase — it is what "limited live release" means. State it as a limitation of the evidence in the result record, and treat Phase 6's re-measurement as the real test of generality rather than a formality. |
| **Rubber-stamping.** Review that is nominal satisfies the constraint on paper and both defeats the oversight requirement and inflates the minor-edit rate. | Three independent signals (P5-AC-7/8/9): the support lead reading sent replies blind, send-time distribution, and reopen rate. Any one alone is weak; a fast send with a good outcome is fine, a fast send with an elevated reopen rate is not. |
| **Four weeks does not yield 300 in-scope sampled tickets** at actual volume. | Quantify volume before the window opens (Phase 4, Open question 2). If 300 is not reachable in four weeks, that is an owner decision — extend the window or accept a smaller sample with the reduced confidence stated — taken before the measurement rather than at its end. |
| **The system is tuned mid-window** in response to early results, and the sample measures two different systems. | P5-AC-14 records version changes as breaks in the series, and prompt/config changes are out of scope during the window. Improvement that cannot wait four weeks is a rollback-and-restart decision, not a quiet edit. |
| **CSAT moves for reasons unrelated to the pilot** — a pricing change, an outage, seasonality. The bar treats CSAT as a guardrail with no control group. | The pilot segment is compared against its own dated baseline (P0-AC-16), and the result record should name any known confounder in the window. A CSAT drop with an obvious external cause is still a stop-and-look, but the record should let the owner distinguish. |
| **A PII incident during live traffic.** The consequence is customer-facing and the response is time-sensitive. | The rule is signed (P0-AC-13), the purge/re-embed path was rehearsed (P1-AC-11), and rollback was timed (P4-AC-11). This phase's contribution is keeping all three live and repeating the rollback rehearsal (P5-AC-16). |
| **The decision at the end is taken on impressions.** A near-miss with visible enthusiasm is the hardest case to decide honestly. | P5-AC-13 requires measured-versus-committed side by side for every trigger. The numbers were fixed before anyone knew the result, which is the only time they could be fixed honestly. |

## Open questions

1. **What is the actual in-scope ticket volume per week?** Unanswered since Phase 4. It determines whether 300 over four weeks is feasible, and it should be answered before the window opens, not discovered in week three.
2. **How large is the volunteer group, and how are volunteers recruited?** Recruitment shapes the sample as much as the frame does — a group drawn from the most senior agents measures something different from a mixed group.
3. **If the system is rolled back mid-window, does the measurement restart?** The exit criterion assumes a clean four weeks. Decide the rule before the window rather than under pressure during it.
4. **Is the CSAT comparison pilot-segment or organisation-wide?** Raised in Phase 0 (Open question 6) and still open. The project bar says CSAT must not drop versus the pre-pilot baseline; this phase's exit says pilot-segment. Confirm which the owner is signing before the window opens.
5. **What counts as CSAT "not below" the baseline** — any decrease, or a decrease beyond normal variation? With survey volumes segmented by ticket type, small-sample noise is likely. A threshold rule set now is honest; one set after seeing the number is not.
6. **What happens to drafts already generated if a rollback fires?** They exist in the store and may sit in agents' editors. The rollback mechanics timed in Phase 4 should cover this case explicitly.

---

*Every duration in this document is a planning estimate, not a commitment. No benchmark, vendor requirement, or ROI figure is asserted. This PRD derives its acceptance criteria from the Phase 5 exit criterion, the project acceptance bar, and the independent audit's stated fixes; it does not introduce a new bar or loosen an existing one.*
