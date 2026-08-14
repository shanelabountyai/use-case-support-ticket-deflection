# PRD — Phase 1: Corpus, redaction and retrieval

**Milestone:** Phase 1 — Corpus, redaction and retrieval
**Risk owner:** Builder (data owner signs off redaction)
**Planned duration:** ~3 weeks *(estimate)*
**Milestone exit criterion (this PRD's acceptance bar):** Help centre, filtered ticket exemplars and triaged macros indexed with metadata filters; redaction hand-audited on a sample with misses treated as bugs and fixed; a labelled retrieval set of real tickets shows the correct supporting article present in the retrieved set at a level the support lead accepts; macro quarantine report delivered.

---

## Context

The main technical risk in this build is not generation quality. It is **retrieval over stale reference material** — a confident, fluent draft citing an out-of-date help-centre article is the failure mode that damages CSAT, and it damages it in a way the agent reviewing the draft may not catch, because the draft looks right. Phase 1 exists to prove retrieval works before any drafting work is built on top of it.

Three source sets go in: the public help centre, resolved Zendesk ticket exemplars, and the current macro library. The macro library is the one the agents already do not trust — it has drifted, and indexing it wholesale would inject the exact stale content the pilot is meant to replace. It is triaged, not ingested.

Sensitivity is **pii**: tickets carry customer names, order history and occasional card-last-four. **Redaction runs upstream of any model-provider or embedding call, not downstream of it.** Once unredacted content reaches an index or a provider, the remedy is purge and re-embed, which is why the ordering is a property of the pipeline rather than a step in a checklist.

Two things this phase depends on and does not decide: the **retrieval quality threshold** and the **staleness age threshold** are numbers written down in Phase 0 (P0-AC-8, P0-AC-9) with a named arbiter. Without them this phase has no exit criterion and stale filtering is unimplementable. Phase 1 does not start until they exist.

**Redaction is measured on its own terms.** A redaction miss is a different class of failure from a weak draft and is not scored by the edit-severity rubric. P1-AC-6 through P1-AC-10 stand apart from the retrieval criteria for that reason.

## Scope

### In scope

- **Ingestion of the help centre**: article text, title, URL, publication and last-updated dates, category, and current-versus-archived status.
- **Ticket exemplar selection and ingestion**: resolved tickets filtered to the in-scope question types agreed in Phase 0 (P0-AC-17), selected for house-style grounding rather than volume.
- **Redaction pipeline**, positioned upstream of embedding and upstream of any model-provider call. Covers at minimum: customer names, addresses, order identifiers where they are customer-identifying, email addresses, phone numbers, and card fragments including last-four.
- **Redaction hand-audit** at the sample size and against the acceptable-miss threshold recorded in Phase 0 (P0-AC-14), with every miss fixed as a pipeline bug and the audit re-run.
- **Macro-library triage**: each macro classified as current, superseded, or contradicted-by-help-centre, with the evidence for the classification. Only the surviving macros are indexed.
- **Macro quarantine report** — the deliverable naming what was quarantined and why. This is also the pre-release off-ramp deliverable named in P0-AC-12, so it is written to stand alone.
- **Index and metadata filters**: source type, last-updated date, category/question type, and current-versus-archived, sufficient to implement the Phase 0 staleness rule.
- **Staleness rule implementation** per P0-AC-9 — exclusion, down-ranking or flagging as decided, with per-source exceptions recorded.
- **Labelled retrieval set**: real in-scope tickets, each labelled with the reference material that actually supports the correct answer, drawn across the in-scope question types rather than the convenient ones.
- **Retrieval evaluation** against the Phase 0 threshold, reported per question type as well as in aggregate.
- **Chunking and embedding configuration versioned in the repo**, so a retrieval result can be reproduced.
- **Corpus provenance record**: for each indexed item, where it came from, when it was ingested, and which redaction pipeline version processed it — the minimum needed to execute a targeted purge under the P0-AC-13 incident rule.

### Out of scope

- Any draft generation, prompting, or model call over retrieved passages — Phase 2. This phase proves retrieval alone.
- Any console or UI work — Phase 4.
- Golden-set assembly for evaluation scoring — Phase 3's exit criterion (but see Open question 1; the labelled retrieval set built here is a different, smaller artefact and should not be confused with it).
- Rewriting or updating help-centre articles. Staleness is filtered and reported; fixing the source content is the content owner's work, not this pilot's.
- Rewriting quarantined macros. They are classified and reported, not repaired.
- Any change to the retrieval or staleness thresholds set in Phase 0.

## Acceptance criteria

Each criterion is independently testable and traces to the milestone exit criterion or to a named audit fix.

| # | Criterion | How it is tested |
|---|---|---|
| **P1-AC-1** | Help-centre content is indexed with, per item, at least: source type, title, URL, last-updated date, category, and current/archived status. | Query the index for a known article; every field is populated or explicitly null with a recorded reason. |
| **P1-AC-2** | Ticket exemplars are indexed, restricted to the in-scope question types from P0-AC-17, with the selection rule written down and reproducible. | Re-running the selection rule against the same ticket population yields the same set. |
| **P1-AC-3** | Surviving macros are indexed with their triage classification carried as metadata. | No macro classified superseded or contradicted appears in a retrieval result. |
| **P1-AC-4** | Metadata filters are sufficient to implement the Phase 0 staleness rule, and the rule is implemented as decided (exclude / down-rank / flag). | A query against material older than the P0-AC-9 threshold behaves as the rule specifies, demonstrated on a fixture. |
| **P1-AC-5** | Chunking, embedding and retrieval configuration are versioned in the repo, and a retrieval result is reproducible from a recorded config version. | Re-running a recorded query at a recorded config version returns the same retrieved set. |
| **P1-AC-6** | Redaction runs **before** embedding and before any model-provider call, enforced structurally rather than by convention. *(pii constraint)* | A test asserts that the embedding and provider call paths reject un-redacted input; removing the redaction step fails the test rather than silently succeeding. |
| **P1-AC-7** | The redaction hand-audit has been performed at the sample size recorded in P0-AC-14, by a human, with the results written down. | Audit record exists, names the sample size and the drawing method, and lists every item inspected. |
| **P1-AC-8** | Every miss found in the audit is fixed in the pipeline as a bug, the fix is covered by a test using synthetic fixtures, and the audit is re-run on a fresh sample after the fix. | One test per miss class; a second dated audit record exists post-fix. |
| **P1-AC-9** | The post-fix audit meets the acceptable-miss threshold recorded in P0-AC-14. | Measured miss count compared against the recorded number; this is a pass/fail, not a trend. |
| **P1-AC-10** | The data owner has signed off the redaction pipeline, named and dated, against the audit records rather than against a description. | Sign-off block references the specific audit record identifiers. |
| **P1-AC-11** | The PII incident rule from P0-AC-13 is executable against this corpus: a targeted purge-and-re-embed can be performed for an identified item, and it has been demonstrated once on a synthetic planted fragment. *(audit fix 3)* | A rehearsal record showing the fragment planted, detected, purged, and the index re-embedded, with elapsed time noted. |
| **P1-AC-12** | A labelled retrieval set of real in-scope tickets exists, covering the in-scope question types from P0-AC-17, each labelled with the reference material that supports the correct answer, at the set size recorded in P0-AC-8. | Set exists; coverage per question type is reported; labelling was done by someone who knows the correct answer, and by whom is recorded. |
| **P1-AC-13** | Measured retrieval quality on P1-AC-12 meets the numeric threshold recorded in P0-AC-8, for the retrieved-set size that threshold specifies. | Single reported number against the recorded threshold; pass/fail. |
| **P1-AC-14** | Retrieval quality is **also reported per question type**, and question types falling below the threshold are named. | Per-type table. An aggregate that passes while several types fail is a finding Phase 2 must carry, not a pass to be reported flatly. |
| **P1-AC-15** | A macro quarantine report is delivered, listing every macro with its classification, the evidence, and the count per class. | Report exists, covers the full macro library with no unclassified remainder, and is readable by the support lead without the builder present. |
| **P1-AC-16** | The corpus provenance record supports targeted removal: for any indexed chunk, its source item, ingestion date and redaction pipeline version can be retrieved. | Pick three chunks at random; all three resolve. |
| **P1-AC-17** | No real ticket content is present in the test fixtures or in any local test database. *(project constraint)* | Fixtures are synthetic; the test suite runs against local Postgres per the repo's database rule. |

## Dependencies

- **Phase 0 thresholds must exist first** — P0-AC-8 (retrieval), P0-AC-9 (staleness), P0-AC-14 (redaction recall). Phase 1 has no exit criterion without them. This is a hard sequencing dependency, not a preference.
- **P0-AC-17's in-scope question type list**, which defines what gets ingested and what the retrieval set covers.
- **Data owner approval to index redacted resolved-ticket content** for style exemplars. The plan lists this as an assumption; if only help-centre content is permitted, house-style grounding weakens and this phase's scope changes materially (Open question 3).
- **Read access to the help centre, the ticket archive, and the macro library** in their authoritative locations.
- **Support-lead time** to label the retrieval set (P1-AC-12) and to receive the quarantine report — labelling is the phase's likely critical path *(estimate)*.
- **A model-provider decision with confirmed onward data-handling terms**, if embeddings are generated by an external provider. Redacted content is still customer-derived.
- **Read-only ticketing credential.** Per the project setup: a credential that cannot send makes the no-auto-send constraint a property of the system rather than a policy.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **Redaction misses card-last-four in an unanticipated format** — spoken-word digits, split across lines, embedded in a pasted receipt. This is the highest-consequence failure in the build. | The audit (P1-AC-7) is on real material, misses are bugs with regression tests (P1-AC-8), and the incident path is rehearsed rather than described (P1-AC-11). The audit is re-run post-fix on a *fresh* sample, because re-running on the same sample only proves the fix fits the examples. |
| **Aggregate retrieval passes while several question types fail badly.** A mean hides a bimodal distribution, and the failing types are likely the ones the help centre covers poorly. | P1-AC-14 forces per-type reporting. Types below threshold are named and carried into Phase 2's scope decision rather than averaged away. |
| **Stale help-centre content is not detectable from metadata** — a last-updated date that reflects a cosmetic edit rather than a factual one. | The staleness rule (P0-AC-9) is date-based and therefore imperfect; state that limitation in the phase record. Macro triage (P1-AC-15) provides a second, content-based signal where a macro contradicts an article — those contradictions are worth surfacing to the content owner as findings. |
| **Macro triage becomes a content-rewriting project.** The library is large and drifted; the temptation is to fix it. | Explicitly out of scope. Triage classifies and reports; repair belongs to whoever owns the macros. The quarantine report is the deliverable. |
| **The labelled retrieval set is drawn from easy tickets**, making retrieval look better than it is. | P1-AC-12 requires coverage across the in-scope types from P0-AC-17, and the drawing method is recorded. The same self-selection bias the audit flagged for Phase 5 applies here. |
| **Ticket exemplars leak cross-customer content into a draft** — a retrieved exemplar carrying another customer's order details. | Redaction is upstream (P1-AC-6), so exemplars are redacted before they can be retrieved. Cross-customer exposure is red-teamed adversarially in Phase 3; this phase removes the material, Phase 3 tests whether removal held. |
| **Ingestion is estimated at ~3 weeks against unknown corpus condition.** | The estimate assumes the sources are machine-readable and reasonably tagged. If hand inspection shows otherwise — image-only articles, untagged tickets — the estimate is revised on evidence and the revision recorded, not absorbed. |

## Open questions

1. **Does anything build the golden set before Phase 3 needs it?** The labelled retrieval set built here (P1-AC-12) is smaller and answers a different question. Phase 3's exit requires a few hundred labelled tickets covering routine, edge and unanswerable cases, assembled *and* scored inside a ~2–3 week phase *(estimate)*. If assembly does not start alongside this phase's labelling work, Phase 3's estimate does not hold. Raised in Phase 0 as Open question 2 and still open.
2. **How are "unanswerable" tickets identified for later held-out testing?** Phase 2 needs held-out tickets the help centre does not answer, and Phase 3 needs them in the golden set. Nobody has been asked to collect them. Collecting them is cheapest during this phase's labelling pass, while a human is already reading tickets and consulting the help centre.
3. **Is indexing redacted ticket content approved?** If refused, house-style grounding comes from the help centre and surviving macros alone, and the Phase 2 prompt has a weaker style signal. This is a scope change, not a detail.
4. **What is the retention rule for the index?** Redacted, customer-derived content still has a retention question, and the answer affects the purge mechanism in P1-AC-11. Unanswered in the plan.
5. **Who is the content owner for the help centre**, and do they want the staleness and contradiction findings? The quarantine report and the staleness findings are useful to them regardless of whether this pilot proceeds — which is what makes the off-ramp in P0-AC-12 a real deliverable rather than a consolation prize.
6. **Does the embedding provider's onward data-handling permit customer-derived content**, even redacted? Confirm before ingestion rather than after, because the remedy afterwards is a full re-embed.

---

*Every duration in this document is a planning estimate, not a commitment. No benchmark, vendor requirement, or ROI figure is asserted. This PRD derives its acceptance criteria from the Phase 1 exit criterion, the project acceptance bar, and the independent audit's stated fixes; it does not introduce a new bar or loosen an existing one.*
