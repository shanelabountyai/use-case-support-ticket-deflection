# PRD — Phase 2: Thinnest drafting loop

**Milestone:** Phase 2 — Thinnest drafting loop
**Risk owner:** Builder
**Planned duration:** ~3 weeks *(estimate)*
**Milestone exit criterion (this PRD's acceptance bar):** End-to-end draft produced for the top recurring question types with verifiable citations; abstention fires correctly on held-out tickets the help centre does not answer; prompts and retrieval config versioned in the repo; no send capability present in the service.

---

## Context

This is the first phase that calls a model. It is deliberately the thinnest thing that can produce a scoreable draft: retrieve over the Phase 1 index, one prompted generation, a cited reply, and an abstention path. No console, no polish, no ranking experiments, no scope beyond the core loop.

Two properties are load-bearing and are enforced structurally rather than by intent:

**No send capability exists in the service.** The compliance constraint is that drafts must never be auto-sent. The strongest form of that is a service with no code path that can send and a ticketing credential that could not send if one existed. This phase's job is to make sure the capability is absent, not disabled — a disabled feature can be re-enabled by a config change; an absent one cannot.

**Redaction stays upstream.** The Phase 1 pipeline redacts before embedding. The incoming ticket at draft time is a second, separate path to the model provider and must be redacted on the way in too. This is the path that did not exist in Phase 1 and is easy to miss.

**Citations must be verifiable, not merely present.** A model asked to cite will cite. The failure mode that damages CSAT is a fluent draft carrying a citation that does not support the claim, or that points at material the retrieval set never returned. Verification here is mechanical — the cited source must be one of the passages actually retrieved for this draft — and is a precondition for Phase 3's human scoring being about anything.

**Abstention needs a cost.** The audit's known gap: a system that abstains on most tickets could pass ≥80% minor edits on the remainder while delivering almost nothing. The abstention band and the co-reporting rule are set in Phase 0 (P0-AC-11); this phase implements abstention and reports the rate alongside every quality number from here onward.

This phase also carries the audit's demanded **re-validation of the Phase 0 rubric on real drafts** (P0-AC-6). The rubric was calibrated on historical agent replies; these are the first pipeline drafts it can be applied to.

## Scope

### In scope

- **Retrieval call** against the Phase 1 index using the versioned config, with the Phase 0 staleness rule applied.
- **One prompted generation step** over the retrieved passages producing a reply draft. One step — no multi-pass refinement, no agentic loop.
- **Inbound redaction** of the incoming ticket before it reaches retrieval or the model provider.
- **Citation emission**: each substantive claim in the draft attributed to a retrieved passage, at whatever granularity the design actually supports, stated honestly.
- **Citation verification**: a mechanical check that every emitted citation resolves to a passage in the retrieved set for that draft, and that the cited passage exists in the index at the recorded version.
- **Abstention behaviour**: the system declines to draft when the retrieved material does not support an answer, returning an explicit abstention rather than a hedged draft.
- **Held-out unanswerable set**: tickets the help centre does not answer, used to test that abstention fires.
- **Coverage/abstention reporting** alongside every quality figure, per P0-AC-11.
- **Prompt and retrieval config versioned in the repo**, with the version recorded on every draft produced.
- **Rubric re-validation on real drafts** (P0-AC-6): agents tag a set of pipeline drafts using the Phase 0 rubric, and agreement is re-measured.
- **Draft provenance record**: for each draft, the ticket, the retrieved passage identifiers, the prompt version, the config version, and the model identifier.
- **Structural absence of send.** No send endpoint, no send client method, no ticketing scope that permits a send.

### Out of scope

- Any console, sidebar, or UI — Phase 4. Drafts are produced through a service interface and inspected as data.
- Diff rendering and one-click severity tagging — Phase 4.
- Scoring the loop against the golden set — Phase 3.
- Red-teaming for injection and cross-customer exposure — Phase 3.
- Any LLM-judge. If one is introduced later, Phase 3 owns measuring its agreement against human ratings.
- Retrieval improvements beyond what Phase 1 delivered, unless a Phase 1 per-type failure (P1-AC-14) makes a question type undraftable — in which case the type is excluded and named, not silently attempted.
- Any change to the acceptance bar, the rubric, or the Phase 0 thresholds.

## Acceptance criteria

Each criterion is independently testable and traces to the milestone exit criterion or to a named audit fix.

| # | Criterion | How it is tested |
|---|---|---|
| **P2-AC-1** | An end-to-end draft is produced for each of the top recurring question types identified in P0-AC-17, excluding any type formally excluded under P2-AC-14. | One draft per type exists, with its provenance record. |
| **P2-AC-2** | Every citation in a draft resolves to a passage that was in the retrieved set for that draft; a citation that does not resolve fails the draft. | Automated check over a batch of drafts; the failure count is zero, and the check itself is tested with a deliberately broken citation. |
| **P2-AC-3** | The citation granularity actually delivered is stated in writing — per claim, per paragraph, or per draft — and matches what the implementation does. | The statement is checkable against a produced draft; no overclaim of finer granularity than exists. |
| **P2-AC-4** | Every cited passage resolves to an item present in the index at the recorded config version. | Provenance lookup per P1-AC-16 succeeds for every citation in a sampled batch. |
| **P2-AC-5** | Abstention fires on the held-out set of tickets the help centre does not answer, at a rate recorded and compared against the P0-AC-11 band. | Run against the held-out set; the abstention count and rate are reported. |
| **P2-AC-6** | Abstention returns an explicit, distinguishable abstention rather than a low-confidence draft. | A caller can tell abstention from a draft without parsing prose. |
| **P2-AC-7** | The abstention/coverage rate is reported alongside every quality figure this phase produces, per P0-AC-11. | No quality number appears in a phase report without its coverage number next to it. |
| **P2-AC-8** | The incoming ticket is redacted before retrieval and before any model-provider call, enforced structurally. *(pii constraint)* | A test asserts the provider call path rejects un-redacted ticket input; removing the redaction step fails the test. |
| **P2-AC-9** | The service contains **no send capability**: no endpoint, client method, or code path that transmits a reply to a customer or to the ticketing platform as a public comment. *(compliance constraint)* | Code search for send paths returns nothing; a test asserts the ticketing client exposes no send method. |
| **P2-AC-10** | The ticketing credential in use cannot send, verified against the platform rather than assumed from configuration. *(compliance constraint)* | A recorded attempt to send with that credential is rejected by the platform. |
| **P2-AC-11** | Prompt text and retrieval config are versioned in the repo, and every draft records the versions used. | Given a draft's provenance record, the exact prompt and config can be recovered from git. |
| **P2-AC-12** | The Phase 0 rubric has been re-applied by agents to a set of **real pipeline drafts**, and inter-rater agreement re-measured and recorded against the P0-AC-4 floor. *(audit fix 2)* | Second agreement figure exists, dated, on pipeline drafts rather than historical replies; any divergence from the Phase 0 figure is discussed rather than noted. |
| **P2-AC-13** | Each draft carries a provenance record: ticket identifier, retrieved passage identifiers, prompt version, config version, model identifier. | Pick three drafts at random; all five fields resolve. |
| **P2-AC-14** | Any question type excluded from drafting because Phase 1 retrieval failed for it (P1-AC-14) is named in writing, with the reason. | Exclusion list exists; the excluded types are not silently attempted or silently dropped from the type count. |
| **P2-AC-15** | No real customer ticket content is present in test fixtures or the local test database. *(project constraint)* | Fixtures are synthetic; the suite runs against local Postgres. |

## Dependencies

- **Phase 1 complete**: index, metadata filters, staleness rule, redaction pipeline, and the per-type retrieval report (P1-AC-14) which determines what is draftable.
- **Phase 0 rubric and abstention band** — P0-AC-1 for the re-validation, P0-AC-11 for the abstention numbers.
- **Held-out unanswerable tickets.** Nobody has been assigned to collect these (Phase 1, Open question 2). Without them P2-AC-5 cannot be tested.
- **Agent time for rubric re-validation** (P2-AC-12) — a second tagging pass, smaller than Phase 0's but on the same people.
- **Model provider access with confirmed onward data-handling terms**, and its own key per the project's separation rule.
- **Read-only ticketing credential** for P2-AC-10.

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| **Fluent-but-wrong drafts.** The model writes well, the agent skims, and a stale fact reaches a customer. This is the CSAT risk named in the plan. | Citation verification (P2-AC-2) makes the source checkable rather than decorative; the Phase 0 staleness rule filters the material; Phase 3 red-teams it; Phase 4's citation inspection makes checking cheap for the agent. Phase 2's contribution is that every claim has a resolvable source. |
| **Citations are emitted at a coarser granularity than they appear to have.** A per-draft citation list reads like per-claim attribution and is not. | P2-AC-3 forces the granularity to be stated in writing and checked against the implementation. Overclaiming here would make Phase 3's scoring measure the wrong thing. |
| **Abstention is tuned to look good.** Abstain more, and the drafts that remain score better. | P0-AC-11's band bounds it in both directions and P2-AC-7 forces coverage to travel with every quality number, so a quality gain bought with abstention is visible in the same table. |
| **Abstention never fires** because the retrieval always returns *something*. Retrieval returning passages is not evidence that the passages answer the question. | P2-AC-5 tests against a held-out set that is known-unanswerable. If abstention never fires there, the abstention design is not working regardless of what the aggregate rate says. |
| **The rubric behaves differently on model output than on human replies.** The Phase 0 calibration may not transfer — model drafts fail in different shapes (confident omissions, plausible fabrications) than human drafts. | P2-AC-12 is exactly this test, and it is the audit's demanded fix. If agreement drops materially, the rubric is revised before Phase 3 scores anything with it — revising it after seeing Phase 3 scores would be unfalsifiable. |
| **"No send" becomes "send disabled".** A feature flag, a commented-out route, a scope that could be widened. | P2-AC-9 requires structural absence and P2-AC-10 verifies it at the credential, so re-enabling would require two deliberate changes in two systems rather than one config edit. |
| **The incoming-ticket redaction path is forgotten** because Phase 1's corpus redaction feels like the redaction work is done. | Called out as a separate criterion (P2-AC-8) with its own structural test. This is a different code path with the same consequence. |
| **Prompt iteration outruns versioning**, and a good result cannot be reproduced. | P2-AC-11 records versions on every draft; a result that cannot be traced to a prompt version is not a result. |

## Open questions

1. **What is the intended citation granularity?** Per claim, per paragraph, or a source list per draft? This determines what Phase 3 can verify and what Phase 4 can render for inspection. Decide before building, then state it under P2-AC-3.
2. **Who collects the held-out unanswerable tickets, and when?** Still unassigned (raised in Phase 1). P2-AC-5 is untestable without them, and they are cheapest to collect during Phase 1's labelling pass.
3. **What triggers abstention mechanically?** A retrieval score floor, a model-expressed inability, or both? The plan does not say, and the choice determines whether abstention is tunable and how it is reported. Not a bar change — an implementation decision that must be recorded because Phase 3 tests it.
4. **What does the system do for a ticket type excluded under P2-AC-14** — abstain, or is the type simply out of the pilot's frame? These are different in the Phase 5 sampling frame, which per P0-AC-15 includes tickets where the system abstained.
5. **Does the draft need to handle multi-question tickets?** Real tickets frequently ask two things. The plan's "~40 recurring question types" framing assumes one type per ticket. If mixed tickets are common, both retrieval and abstention behave differently and this should surface here rather than at shadow mode.
6. **Which model, and is the choice recorded as a version?** P2-AC-13 requires the model identifier on every draft; a silently-updated provider model would change results between Phase 3 and Phase 5 with no visible cause.

---

*Every duration in this document is a planning estimate, not a commitment. No benchmark, vendor requirement, or ROI figure is asserted. This PRD derives its acceptance criteria from the Phase 2 exit criterion, the project acceptance bar, and the independent audit's stated fixes; it does not introduce a new bar or loosen an existing one.*
