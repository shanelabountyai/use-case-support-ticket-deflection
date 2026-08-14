# PRD — Phase 0: Bar, rubric and baseline

**Milestone:** Phase 0 — Bar, rubric and baseline
**Risk owner:** Support lead (with builder)
**Planned duration:** ~1–2 weeks *(estimate)*
**Milestone exit criterion (this PRD's acceptance bar):** Rubric written and validated by three agents independently tagging the same ~40 historical draft/sent pairs with acceptable agreement; support lead has signed off the definition of 'minor edits'; segmented pre-pilot CSAT and reopen-rate baseline recorded and dated.

---

## Context

The project acceptance bar is **≥80% of drafts sent with only minor edits, measured on 300 sampled tickets over four weeks, with CSAT not dropping versus the pre-pilot baseline.** Today neither half can be evaluated. "Minor edits" is a phrase, not a rubric. The pre-pilot CSAT baseline has not been captured, and once the pilot starts it cannot be captured retrospectively without contamination — the comparison population no longer exists in an unaided state.

Phase 0 exists to convert the bar into something scoreable, and to write down every number that later phases treat as a gate. Nothing is built in this phase. No corpus is ingested, no model is called.

The independent audit (verdict: **NEEDS REWORK**) named three fixes, and two of them land here specifically. This PRD carries them as acceptance criteria rather than as advice:

1. **The Phase 0 circularity.** The plan's exit criterion asks three agents to tag "draft/sent pairs" — but in Phase 0 no pipeline drafts exist. The artefacts that exist pre-build are **historical agent replies**: what an agent started from (a macro, a prior similar reply, or blank) and what they actually sent. The rubric is calibrated on those. It is a proxy, and the PRD says so; the rubric must be **re-validated on real pipeline drafts in Phase 2/3** before it is used to judge the bar. (P0-AC-1, P0-AC-5, P0-AC-6.)
2. **Deferred thresholds with no fallback.** Phase 1's exit is "at a level the support lead accepts" and freshness filtering uses "an agreed age threshold". Both are gates and neither is a number. Phase 1 is unimplementable until they exist. They are written down here, with a **named arbiter** for the case where agreement fails. (P0-AC-7, P0-AC-8, P0-AC-9, P0-AC-10.)
3. **No pre-release failure path and no PII incident path.** Every phase exit assumes progress toward ≥80%. There is no pre-committed rule for what happens if Phase 3 lands materially short, and no defined response to an unredacted card fragment reaching the index. Both are written and signed here, before there is any incentive to write them leniently. (P0-AC-11, P0-AC-12, P0-AC-13.)

The audit's third demanded fix — reconciling the schedule with the funded quarter — is an owner budget decision, not a builder decision, and is carried as **Open question 1** with the arithmetic attached.

These are tightenings of the exit criterion. None introduces a new bar and none loosens the ≥80% / CSAT bar.

## Scope

### In scope

- **Edit-severity rubric.** A written rubric with named severity tiers, an explicit statement of which tiers count as **minor**, worked examples per tier, and tie-break rules for a reply that carries edits of two different severities. Drafted *with* the agents who will apply it, not for them.
- **Rubric calibration on pre-build artefacts.** Three agents independently tag the same ~40 historical starting-point/sent pairs. The record states plainly that these are historical agent replies, not pipeline drafts.
- **Agreement measurement and floor.** An inter-rater agreement statistic computed on the calibration set, a written floor, and a documented procedure for what happens when agreement lands below it.
- **Support-lead sign-off** on the definition of "minor edits", named and dated.
- **Segmented pre-pilot baseline.** CSAT and reopen rate for the in-scope ticket types, recorded, dated, and with the segmentation rule written down so it can be reproduced identically after the pilot.
- **In-scope ticket-type enumeration.** The list of recurring question types the pilot covers, since it defines the baseline segmentation, the retrieval-set sampling frame and the Phase 5 sampling frame.
- **The deferred numbers, written down**: retrieval quality threshold, reference-material staleness age threshold, abstention-rate acceptable band, redaction-recall bar and its audit sample size. Each with a metric, a number, and the named person who arbitrates if agreement fails.
- **Pre-release failure rule.** What happens if Phase 3 offline scores land materially short of ≥80%: how many remediation cycles, the cost ceiling, and the off-ramp.
- **PII incident rule.** The defined response to an unredacted card fragment or cross-customer content found in the corpus, the index, or a draft — including index purge and re-embed.
- **Phase 5 sampling frame**, defined now rather than at Phase 5 when the incentive is to define it favourably.
- **Console surface feasibility check.** Confirm the ticketing platform can render a draft into the agent's editor and capture a one-click severity tag. The plan lists this as an assumption; if it is false, the measurement design needs rework here, not in Phase 4.
- **Naming.** Every role the plan relies on mapped to a named individual.

### Out of scope

- Any ingestion, redaction, chunking, embedding or indexing — Phase 1, and deliberately gated behind the thresholds recorded here.
- Any prompting, retrieval or draft generation — Phase 2.
- Assembling the golden set. Phase 0 defines the rubric the golden set is scored *with*; assembly is Phase 3's exit criterion (see Open question 2 — nothing before Phase 3 builds it).
- Changing the acceptance bar. Phase 0 makes it operational; it does not renegotiate it.
- Any model-provider call carrying ticket content. Nothing in Phase 0 requires one.

## Acceptance criteria

Each criterion is independently testable and traces to the milestone exit criterion or to a named audit fix.

| # | Criterion | How it is tested |
|---|---|---|
| **P0-AC-1** | An edit-severity rubric document exists with named tiers, a worked example per tier, an explicit statement of which tiers count as "minor", and a tie-break rule for mixed-severity edits. | A reader who was not present can tag a reply pair using it without asking a clarifying question. |
| **P0-AC-2** | Three agents have independently tagged the same set of ~40 historical pairs using the rubric, without conferring, and their tag sheets are retained. | Three separate sheets exist covering the same items; tagging order or presentation is recorded. |
| **P0-AC-3** | An inter-rater agreement statistic is computed over P0-AC-2 and recorded, with the statistic named. | The number and the method are both written down. |
| **P0-AC-4** | An agreement floor is stated as a number, and the procedure when agreement falls below it is written down (revise and re-tag; how many rounds; who decides to stop). | The floor is numeric, not "acceptable"; the procedure names a decision-maker. |
| **P0-AC-5** | The calibration record states explicitly that the ~40 pairs are **historical agent replies, not pipeline drafts**, and names the proxy limitation. *(audit fix 2)* | The sentence is present in the rubric document, not only in this PRD. |
| **P0-AC-6** | The rubric document carries a re-validation requirement: it is re-applied to real pipeline drafts in Phase 2/3 and the agreement re-measured before the rubric is used to judge the ≥80% bar. *(audit fix 2)* | A named criterion in the rubric pointing at P3-AC-3; Phase 3 cannot pass without it. |
| **P0-AC-7** | The support lead has signed off the definition of "minor edits", with name and date. | Sign-off block names an individual, not a role. |
| **P0-AC-8** | A retrieval quality threshold is recorded as a number: the metric, the value, the retrieved-set size it applies to, and the labelled-set size it is measured on. *(audit fix 2)* | Phase 1 can be passed or failed against it by a third party with no further conversation. |
| **P0-AC-9** | A reference-material staleness age threshold is recorded as a number, with the rule for what happens to material older than it (excluded, down-ranked, or flagged in the draft) and how per-source exceptions are recorded. *(audit fix 2)* | The rule is implementable as written; no "agreed age threshold" language remains. |
| **P0-AC-10** | A named arbiter is recorded for each deferred threshold, empowered to set the number if agreement between support lead and builder fails, with a date by which the number must exist. *(audit fix 2)* | Role-to-name mapping with no blanks; each threshold has an arbiter and a deadline. |
| **P0-AC-11** | An abstention acceptance band is recorded: the abstention rate that is acceptable, the rate above which the system is judged to be under-delivering regardless of edit-severity scores, and a requirement that **coverage/abstention rate is reported alongside the minor-edit rate wherever the bar is reported**. *(known gap: abstention has no acceptance criterion)* | Two numbers plus the co-reporting rule; Phase 3 and Phase 5 reports can be checked against it. |
| **P0-AC-12** | A pre-release failure rule is recorded and signed by the owner: the score below which Phase 3 is judged materially short, the number of remediation cycles permitted, the cost ceiling for those cycles, and the off-ramp (stop and deliver the macro-reconciliation by-product only). *(audit fix 3)* | Each of the four elements is present; the score and cycle count are numbers; the off-ramp names a concrete deliverable. |
| **P0-AC-13** | A PII incident rule is recorded and signed: what counts as an incident (unredacted card fragment, cross-customer content) in each location it can appear — corpus, index, draft, log — and the response for each, explicitly including **index purge and re-embed**, who is notified, and within what time. *(audit fix 3)* | Each location has a named response; purge/re-embed is named for the index case; a notification target and time exist. |
| **P0-AC-14** | A redaction-recall bar is recorded: the hand-audit sample size, the acceptable-miss threshold, and the statement that a miss is a pipeline bug rather than an accepted rate. *(known gap: redaction measured by hand-audit only)* | Sample size and threshold are numbers; Phase 1 can be failed against them. |
| **P0-AC-15** | The Phase 5 sampling frame is defined in writing: random across in-scope ticket types, **including tickets where the agent declined to request a draft and tickets where the system abstained**, with the draw procedure reproducible by a third party. *(known gap: sampling design unspecified)* | The procedure would produce the same sample given the same ticket population and seed. |
| **P0-AC-16** | Segmented pre-pilot CSAT and reopen rate are recorded and dated for the in-scope ticket types, with the segmentation rule written down so the post-pilot comparison uses an identical definition. | Numbers, a date, a window length, and a rule a third party could re-run. |
| **P0-AC-17** | The list of in-scope recurring question types is written down and signed by the support lead. | An enumerated list, not "the ~40 types"; used as the sampling frame in P0-AC-15 and P0-AC-16. |
| **P0-AC-18** | The ticketing platform's ability to render a draft into the agent's editor and capture a one-click severity tag has been confirmed against the actual platform, with the finding recorded. If it cannot, the measurement design rework is raised to the owner before Phase 1 starts. | A written finding referencing the specific surface, not a vendor claim. |
| **P0-AC-19** | Every role the plan relies on is mapped to a named individual: bar owner, support lead, data owner (redaction sign-off), builder, threshold arbiter, and the Phase 6 long-term corpus owner. | Role-to-name table with no blanks. |
| **P0-AC-20** | No ticket content has been transmitted to an external model provider during Phase 0. | Builder attestation; no such call exists in the repo history for this phase. |

## Dependencies

- **Three agents' time** for independent tagging (P0-AC-2). This is the phase's critical path; if the agents cannot commit hours, Phase 0 does not complete.
- **Support lead availability** for sign-off on the rubric, the in-scope type list, and the thresholds.
- **Access to historical starting-point/sent pairs** — this requires that the ticketing system retains enough history to reconstruct what the agent started from, not only what they sent. If it does not, P0-AC-2's artefacts do not exist in the assumed form (see Open question 3).
- **Access to historical CSAT survey data**, segmentable by ticket type. The plan lists this as an assumption; P0-AC-16 is where it is confirmed or falsified.
- **A named arbiter with authority** to set thresholds unilaterally (P0-AC-10). Without one, the deferral simply moves.
- **The owner's authority to sign a cost ceiling and an off-ramp** (P0-AC-12). This is likely to sit above the support lead.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **The rubric is written loosely enough that ≥80% is unfalsifiable.** A rubric where almost every edit is "minor" measures nothing. | Calibration on ~40 historical pairs (P0-AC-2) will include replies that were substantially rewritten. If the rubric tags those as minor, it is not discriminating and must be revised before sign-off. The agreement floor (P0-AC-4) catches the opposite failure — tiers so fine-grained that nobody agrees. |
| **The proxy gap.** Historical agent replies are not pipeline drafts. A rubric calibrated on human starting points may behave differently on model output — different error shapes, different failure modes. | Stated as a limitation (P0-AC-5) rather than hidden, and re-validated on real drafts before the rubric is used to judge the bar (P0-AC-6). This is the audit's demanded fix and the mitigation is the fix. |
| **Thresholds get set by whoever is in the room, at a level that is easy to pass.** | Each threshold is written before the thing it gates exists (P0-AC-8/9/11/14), and each has an arbiter and a deadline (P0-AC-10). Setting them after Phase 1 results are visible is the failure mode this phase exists to prevent. |
| **The pre-pilot CSAT baseline cannot be reconstructed** — survey volume too low per segment, or the survey is not attributable to ticket type. | Discovered here rather than at Phase 5. If the segment is too thin to compare, the owner decides now whether the CSAT half of the bar is measured differently (e.g. reopen rate as the primary proxy, stated as such) or whether the pilot's comparison population changes. Do not silently substitute an unsegmented baseline. |
| **The console surface assumption is false** and the platform cannot capture a one-click severity tag. | P0-AC-18 checks it in week 1 rather than in Phase 4. If false, the tagging half of the measurement degrades to diff-based proxies plus support-lead sampling — a change the owner must accept explicitly, because it changes what ≥80% means. |
| **Naming individuals surfaces that no one owns the corpus long-term.** | Better surfaced now. If Phase 6's ownership slot has no name, that is a Phase 6 blocker with a Phase 0 warning rather than a discovery at handover. |
| **Writing an off-ramp early reads as planning to fail** and gets soft-pedalled. | The off-ramp names a real deliverable — the macro-reconciliation report, which Phase 1 produces regardless. That makes the off-ramp a partial success rather than a write-off, and makes it easier to sign honestly. |

## Open questions

These are unresolved and must not be filled in by assumption.

1. **Schedule versus the funded quarter.** The phase durations sum to **~17–20 weeks** *(estimate, from the plan's own per-phase estimates: 1–2 + 3 + 3 + 2–3 + 2 + 4–5 + 2)*. Phase 5 alone contains a four-week measurement that cannot be compressed without changing the bar. The audit required this be reconciled: either compress to ~13 weeks and state explicitly what is dropped, or flag the overrun as a budget decision. **This PRD flags it — it is the owner's call, not the builder's, and it is not resolved by assuming the resourcing is enough.** It changes what Phase 4 and Phase 5 can be expected to deliver.
2. **Golden-set assembly is unowned before it is needed.** Phase 3's exit criterion requires a golden set of a few hundred labelled tickets *and* scoring it, in a ~2–3 week phase *(estimate)*. No earlier milestone builds it. Either assembly starts during Phase 1/2 alongside the labelled retrieval set, or Phase 3's estimate is wrong. Assign an owner and a start point before Phase 1 ends.
3. **Do "draft/sent pairs" exist in the history at all?** The exit criterion assumes a recoverable starting point per ticket. If the ticketing system retains only the sent reply, the calibration set is 40 *sent replies* with no baseline to diff against, and the rubric must be calibrated differently (e.g. pairs of a macro's current text against what was actually sent). Confirm before tagging starts.
4. **What is the response if agreement is below the floor after revision?** Proceed with a coarser rubric, add a fourth tagger, or hold the phase? Decide before Phase 1, not during Phase 3.
5. **Who arbitrates the retrieval threshold if the support lead sets no number?** P0-AC-10 requires a name. If the honest answer is "nobody has that authority", that is an escalation to the owner in week 1.
6. **Is the CSAT half of the bar measured on the pilot segment only, or organisation-wide?** The bar says "CSAT must not drop versus the pre-pilot baseline"; Phase 5's exit says "pilot-segment CSAT". These are different tests with different sensitivity. Confirm which one the owner is signing.
7. **Does the data owner approve indexing redacted resolved-ticket content for style exemplars?** The plan lists this as an assumption. If only help-centre content is permitted, house-style grounding weakens and Phase 1's scope changes. Get the answer before Phase 1 begins, not during ingestion.

---

*Every duration in this document is a planning estimate, not a commitment. No benchmark, vendor requirement, or ROI figure is asserted. This PRD derives its acceptance criteria from the Phase 0 exit criterion, the project acceptance bar, and the independent audit's stated fixes; it does not introduce a new bar or loosen an existing one.*
