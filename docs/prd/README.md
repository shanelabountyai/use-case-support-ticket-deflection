# PRDs — Support ticket deflection & reply drafting

One PRD per milestone, written from `../prd-pack.md` against `../build-kickoff-package.md` and the audit findings in `../../CLAUDE.md`. Each PRD's acceptance bar is its milestone's exit criterion; none introduces a new bar or loosens an existing one.

| Phase | PRD | Acceptance criteria |
|---|---|---|
| 0 | [Bar, rubric and baseline](phase-0-bar-rubric-and-baseline.md) | P0-AC-1 … 20 |
| 1 | [Corpus, redaction and retrieval](phase-1-corpus-redaction-and-retrieval.md) | P1-AC-1 … 17 |
| 2 | [Thinnest drafting loop](phase-2-thinnest-drafting-loop.md) | P2-AC-1 … 15 |
| 3 | [Offline evaluation and red-teaming](phase-3-offline-evaluation-and-red-teaming.md) | P3-AC-1 … 17 |
| 4 | [Console integration and shadow mode](phase-4-console-integration-and-shadow-mode.md) | P4-AC-1 … 16 |
| 5 | [Limited live release and the measurement](phase-5-limited-live-release-and-measurement.md) | P5-AC-1 … 16 |
| 6 | [Widening and ownership handover](phase-6-widening-and-ownership-handover.md) | P6-AC-1 … 17 |

## Where the audit's demanded fixes landed

The audit verdict was **NEEDS REWORK**. Each demanded fix is carried as an acceptance criterion, not as advice:

- **Schedule versus the funded quarter** — flagged, not resolved. The plan's own per-phase estimates sum to **~17–20 weeks** against a ~13-week funded quarter, and Phase 5 contains a four-week measurement that cannot be compressed without changing the bar. Carried as Phase 0 open question 1, and reported at the decision points: P5-AC-15, P6-AC-17. **This is the owner's budget decision; no scope was silently cut to make the arithmetic work.**
- **Phase 0 circularity** — P0-AC-5 states the calibration artefacts are historical agent replies, not pipeline drafts; P0-AC-6 requires re-validation on real drafts, executed at P2-AC-12 and used at P3-AC-3.
- **Deferred thresholds forced into Phase 0 with a named arbiter** — retrieval P0-AC-8, staleness P0-AC-9, arbiter and deadline P0-AC-10, abstention band P0-AC-11, redaction recall P0-AC-14. Phase 1 consumes them at P1-AC-4, P1-AC-9, P1-AC-13.
- **Pre-release failure path** — P0-AC-12 fixes the materially-short threshold, remediation cycle count, cost ceiling and off-ramp before any score exists; executed at P3-AC-15 and re-used at P6-AC-16. The off-ramp deliverable is the macro quarantine report, produced regardless at P1-AC-15.
- **PII incident path** — P0-AC-13 defines it per location including index purge and re-embed; rehearsed at P1-AC-11; routed into at P3-AC-12; live at P5-AC-12.
- **Abstention has no cost** — band and co-reporting rule at P0-AC-11, enforced at P2-AC-7, P3-AC-4/5, P5-AC-4, P6-AC-3. No quality figure is reported without its coverage figure.
- **Sampling design for the 300 tickets** — frame defined at P0-AC-15 *before* the pilot, instrumented at P4-AC-5 (including tickets where no draft was requested and where the system abstained), executed at P5-AC-1/2.
- **Redaction measured by hand-audit only** — sample size and miss threshold at P0-AC-14; audit, fix-as-bug and re-audit at P1-AC-7/8/9; data-owner sign-off at P1-AC-10; re-audited on new content at P6-AC-13. Redaction is scored on its own criteria, never by the edit-severity rubric.

## Open questions that block, and who closes them

These recur across PRDs and are not for the builder to assume away:

1. **Schedule: ~17–20 weeks of phases against a ~13-week funded quarter** — owner. Changes what Phase 4 and Phase 5 can be expected to deliver.
2. **Golden-set assembly is unowned before Phase 3 needs it** — no milestone builds it; Phase 3's exit requires assembling *and* scoring a few hundred labelled tickets in ~2–3 weeks. Assign an owner and start assembly during Phase 1's labelling pass, or revise the Phase 3 estimate.
3. **Do recoverable "draft/sent pairs" exist in the ticket history at all?** — support lead. If only sent replies are retained, Phase 0's calibration set does not exist in the assumed form.
4. **Which CSAT comparison is the bar — pilot-segment or organisation-wide?** — owner. The project bar and the Phase 5 exit criterion say different things.
5. **Live in-scope ticket volume per week** — support lead. Determines whether shadow mode yields a scoreable sample and whether 300 tickets over four weeks is reachable.
6. **Is indexing redacted resolved-ticket content approved?** — data owner. If refused, house-style grounding weakens and Phase 1's scope changes.
7. **Who arbitrates a threshold if the support lead sets no number?** — owner, per P0-AC-10. If nobody has that authority, the deferral has only moved.
8. **What is the tagging-compliance floor** below which the measurement degrades to diff-based proxies plus support-lead sampling? — support lead, before Phase 5 opens.
9. **Denominator for the ≥80% bar** — whole sample or non-abstained items only? — owner. P0-AC-11's co-reporting contains the damage but does not settle it.
10. **Retention rule for the index and the golden set** — data owner. Both hold customer-derived content for the life of the pilot and beyond.

## Two structural notes

- **Redaction has its own acceptance criteria**, deliberately separate from the drafting quality bar. A redaction miss is a different class of failure from a weak draft and is not measured by the same rubric line.
- **No-auto-send is structural, not configured.** P2-AC-9 requires the send capability to be *absent* rather than disabled, P2-AC-10 verifies the ticketing credential cannot send, and both are re-run at P4-AC-14, P5-AC-11 and P6-AC-12.
