# PRD — Phase 3: Offline evaluation and red-teaming

**Milestone:** Phase 3 — Offline evaluation and red-teaming
**Risk owner:** Builder + support lead
**Planned duration:** ~2–3 weeks *(estimate)*
**Milestone exit criterion (this PRD's acceptance bar):** Golden set of a few hundred labelled tickets covering routine, edge and unanswerable cases scored by humans against the rubric, with results trending toward the ≥80% minor-edit bar; failures classified by taxonomy; red-team findings on injection and cross-customer data exposure resolved or accepted in writing and added to the golden set; any LLM-judge used has measured agreement against human ratings.

---

## Context

This is the phase where the build finds out whether it works, offline, before any customer sees anything and before any agent's time is spent in shadow mode. It is also the phase the audit was most concerned about, for two reasons.

**First: this is where the pre-release failure path bites.** Every phase exit criterion in the plan assumes progress toward ≥80%. If offline scores land at, say, 55%, the plan as written has nothing to say. The rule for that case is written and signed in Phase 0 (P0-AC-12) — a number below which the result is materially short, a permitted count of remediation cycles, a cost ceiling, and an off-ramp to delivering the macro-reconciliation report only. This phase's job is to **execute that rule as written**, not to renegotiate it against a score that is nearly there.

**Second: the sensitive-data extraction risk is real and adversarial.** Tickets contain customer names, order history and card fragments. The corpus includes redacted ticket exemplars. A crafted ticket that induces the model to reproduce content from a retrieved exemplar is a cross-customer data exposure, and it is the failure that ends the pilot rather than degrades it. Prompt injection through ticket content is the delivery mechanism — a customer can write anything into a ticket body, and that text reaches the model.

**On the golden set.** The exit criterion requires assembling *and* scoring a few hundred labelled tickets inside a ~2–3 week phase *(estimate)*. No earlier milestone builds it. This has been flagged since Phase 0 (Open question 2) and remains the largest schedule risk in this PRD. Assembly is in scope here because the exit criterion puts it here; the estimate should be revised on evidence rather than absorbed.

**On the rubric.** The rubric used for scoring is the Phase 0 rubric as re-validated on real pipeline drafts in Phase 2 (P2-AC-12). If that re-validation showed material divergence and the rubric was revised, the revised rubric is the one used here — and Phase 0's calibration figures are superseded, not averaged with.

## Scope

### In scope

- **Golden-set assembly**: a few hundred labelled in-scope tickets covering **routine**, **edge**, and **unanswerable** cases, with the composition per class recorded and the drawing method reproducible.
- **Draft generation** over the golden set using the versioned Phase 2 loop, with provenance recorded per draft.
- **Human scoring** of every golden-set draft against the (re-validated) rubric, by agents, with the scoring protocol and scorer count recorded.
- **Reporting the minor-edit rate** against ≥80%, **with the coverage/abstention rate alongside it** per P0-AC-11.
- **Failure taxonomy**: a written classification of how drafts fail, with every scored failure assigned a class and counts per class.
- **Red-teaming — prompt injection**: crafted ticket content attempting to override instructions, extract the prompt, or induce unsupported claims.
- **Red-teaming — cross-customer exposure**: attempts to induce the model to reproduce identifying content from retrieved ticket exemplars, including partial card fragments.
- **Red-team findings resolved or accepted in writing**, with the accepting owner named, and **added to the golden set** so they are re-tested by every later run.
- **LLM-judge agreement, if a judge is used at all**: measured agreement against human ratings on the same items, reported as a number, with the rule for what the judge may and may not be used for.
- **Execution of the P0-AC-12 pre-release failure rule** if the score lands materially short.
- **Abstention correctness on the unanswerable class**, since the golden set contains it by construction.

### Out of scope

- Any console or UI work, diff rendering, or severity-tag capture — Phase 4.
- Shadow mode against live agent replies — Phase 4.
- Any live customer traffic — Phase 5.
- Changing the ≥80% bar, the rubric, the abstention band, or the failure rule in response to the score. Revising the *rubric* on the basis of Phase 2's re-validation is Phase 2's business and precedes this phase.
- Retrieval redesign beyond what the failure taxonomy justifies within the permitted remediation cycles.

## Acceptance criteria

Each criterion is independently testable and traces to the milestone exit criterion or to a named audit fix.

| # | Criterion | How it is tested |
|---|---|---|
| **P3-AC-1** | A golden set of a few hundred labelled in-scope tickets exists, with the count per class — routine, edge, unanswerable — recorded and the drawing method reproducible by a third party. | The set exists; class counts are stated; re-running the method on the same population reproduces the selection. |
| **P3-AC-2** | Every golden-set item has a draft (or a recorded abstention) produced by the versioned Phase 2 loop, with provenance per P2-AC-13. | No item is missing an outcome; provenance resolves for a random sample. |
| **P3-AC-3** | Every draft is scored by humans against the rubric **as re-validated on pipeline drafts in P2-AC-12**, using a recorded scoring protocol with a recorded scorer count. *(audit fix 2)* | Score sheets exist; the rubric version used is named; the protocol names how items were presented. |
| **P3-AC-4** | The minor-edit rate is reported as a single number against ≥80%, **with the coverage/abstention rate reported in the same table**. *(known gap: abstention has no cost)* | Both numbers present; a quality figure appearing without its coverage figure fails this criterion. |
| **P3-AC-5** | The abstention rate on the golden set is compared against the P0-AC-11 acceptable band, and a rate outside the band is treated as a finding regardless of the minor-edit score. | Explicit pass/fail against the recorded band. |
| **P3-AC-6** | Abstention fires correctly on the unanswerable class: the rate is reported, and drafts produced for unanswerable items are counted as failures in the taxonomy. | Per-class breakdown; unanswerable items answered confidently are a named failure class. |
| **P3-AC-7** | A written failure taxonomy exists, and every scored failure is assigned exactly one class, with counts per class. | No failure is unclassified; classes are distinguishable enough that two people classify the same failure identically. |
| **P3-AC-8** | Prompt-injection red-teaming has been performed against ticket content, with the attempts recorded verbatim and the outcomes recorded. | Attempt log exists and names specific inputs, not categories. |
| **P3-AC-9** | Cross-customer exposure red-teaming has been performed, including attempts to induce reproduction of identifying content and card fragments from retrieved exemplars. *(pii constraint, audit fix 3)* | Attempt log exists; each attempt names the target content class it tried to extract. |
| **P3-AC-10** | Every red-team finding is either **resolved** (with the fix and a regression test) or **accepted in writing by a named owner**, with the reasoning. | No finding is left in an open state at phase exit; accepted findings name an individual. |
| **P3-AC-11** | Every red-team finding is added to the golden set, so later runs re-test it. | The findings appear as golden-set items; re-running the set exercises them. |
| **P3-AC-12** | Any exposure of unredacted card fragments or cross-customer content found during red-teaming triggers the P0-AC-13 incident rule, including index purge and re-embed where the corpus is implicated. *(audit fix 3)* | If triggered: an incident record exists with the response executed and the elapsed time. If not triggered: an attestation that no such exposure was found. |
| **P3-AC-13** | If an LLM-judge is used for any scoring, its agreement with human ratings is measured on a shared subset and reported as a number, and the written rule states what the judge may be used for and what it may not. | Agreement figure exists with the subset size; the rule is explicit about whether the judge can contribute to the bar itself. |
| **P3-AC-14** | If no LLM-judge is used, that is stated explicitly rather than left ambiguous. | A one-line statement in the phase record. |
| **P3-AC-15** | If the minor-edit rate lands below the materially-short threshold recorded in P0-AC-12, the pre-committed rule is executed as written: remediation cycles counted against the permitted number, spend tracked against the ceiling, and the off-ramp taken if the rule says so. *(audit fix 3)* | The decision record cites P0-AC-12's numbers and shows the count and spend; the rule was not renegotiated mid-phase. |
| **P3-AC-16** | The phase result is recorded with a date, the config and prompt versions scored, and the model identifier — so Phase 4 and Phase 5 can tell whether they are measuring the same system. | Record exists; versions resolve in git. |
| **P3-AC-17** | No real customer ticket content is present in test fixtures or the local test database; golden-set tickets are handled under the same redaction pipeline as the corpus. *(project constraint)* | Fixtures synthetic; golden-set handling documented and consistent with Phase 1. |

## Dependencies

- **Phase 2 complete and versioned** — the loop, the abstention path, citation verification, and the rubric re-validation (P2-AC-12).
- **Phase 0's failure rule (P0-AC-12), abstention band (P0-AC-11), and incident rule (P0-AC-13)**, all signed. Executing an unsigned failure rule under pressure is the failure mode the rule exists to prevent.
- **Agent time for scoring several hundred drafts.** This is the phase's critical path *(estimate)*, and it is the same small group of agents used in Phase 0 and Phase 2.
- **Someone to assemble the golden set** — currently unassigned (Phase 0, Open question 2). Assembly and scoring in one ~2–3 week phase is optimistic *(estimate)*.
- **Support-lead availability** to co-own the result and, if the score is short, to be present for the P0-AC-12 decision.
- **A named owner with authority to accept a red-team finding in writing** (P3-AC-10).

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **The score lands close to but below the bar** — say 74% — and the failure rule gets reinterpreted rather than executed. This is the single most likely governance failure in the build. | P0-AC-12 fixes the materially-short threshold, the cycle count and the ceiling *before* any score exists, and P3-AC-15 requires the decision record to cite those numbers. A change to them after the score is visible is an amendment with the owner's signature, not a judgement call. |
| **Golden-set assembly consumes the phase** and scoring is rushed. | Raised since Phase 0 as an unowned dependency. Mitigation is to start assembly during Phase 1's labelling pass; if that did not happen, the honest response is to revise this phase's estimate on evidence rather than to shrink the set. A set of a few hundred is what the exit criterion asks for. |
| **Scorer fatigue and drift.** Several hundred drafts scored by three people over two weeks; late scores are not the same instrument as early ones. | Record the scoring order; interleave items from all three classes rather than scoring class-by-class; re-score a small held-back subset at the end and compare to the original scores as a drift check. |
| **Scorers are not independent of the outcome.** The agents scoring drafts are the intended beneficiaries and have seen the drafts' predecessors since Phase 0. | This is a known limitation of a small support team, not something the design can fully remove. State it in the phase record. The Phase 4 shadow-mode comparison, scored by the support lead against what agents actually sent, is the partly-independent check. |
| **Red-teaming is performed by the person who built the prompt**, who tests the attacks they already defended. | Have at least one red-team pass designed by someone who did not write the prompt. Findings are logged verbatim (P3-AC-8) so a third party can judge coverage rather than take a summary on trust. |
| **A cross-customer exposure is found and the response is a prompt patch.** Patching the prompt does not remove the content from the index. | P3-AC-12 routes exposures into the P0-AC-13 incident rule, which includes purge and re-embed. A prompt fix without a corpus fix leaves the material retrievable. |
| **An LLM-judge is quietly used to expand the scored set** because human scoring is expensive, and its ratings flow into the headline number. | P3-AC-13 requires measured agreement and an explicit rule about what the judge may be used for. P3-AC-14 forbids ambiguity in the other direction. The bar is a human-scored number unless the owner decides otherwise in writing. |
| **The failure taxonomy is written after the failures**, shaped to make the counts look tidy. | Draft the taxonomy from Phase 2's observed failure shapes before scoring begins, then extend it when scoring reveals classes it missed. Extending is expected; rewriting to fit is not. |

## Open questions

1. **Who assembles the golden set, and did assembly start in Phase 1?** Unresolved since Phase 0. If the answer is still "nobody", this phase's estimate is wrong and the owner should be told before the phase starts rather than at its end.
2. **What is the class composition of the golden set?** "Routine, edge and unanswerable" has no split. The split determines the headline number — a set weighted toward routine will score higher. Fix the proportions before assembly, and record them under P3-AC-1.
3. **Does the ≥80% bar apply to the whole golden set or to non-abstained items only?** These are materially different numbers. The project bar says "drafts sent with only minor edits", which implies drafts that exist — but reporting only on drafts produced is precisely the abstention loophole the audit named. P0-AC-11's co-reporting rule contains the damage; the owner should still state which denominator is the bar.
4. **What counts as "trending toward" ≥80%?** The exit criterion says results should trend toward the bar without saying what suffices. P0-AC-12's materially-short threshold is the lower edge; the space between it and 80% is undefined. Ask the owner to state what passes this phase.
5. **Is the red-team scope limited to injection and cross-customer exposure**, or does it include the agent-facing surface (a draft crafted to look verified when it is not)? The exit criterion names two; the third is cheap to test and matters at Phase 4.
6. **Where do golden-set tickets live, and under what retention?** They are real customer tickets held for the life of the pilot and beyond, in a set explicitly designed to be re-run. The retention question raised in Phase 1 applies here with more force.

---

*Every duration in this document is a planning estimate, not a commitment. No benchmark, vendor requirement, or ROI figure is asserted. This PRD derives its acceptance criteria from the Phase 3 exit criterion, the project acceptance bar, and the independent audit's stated fixes; it does not introduce a new bar or loosen an existing one.*
