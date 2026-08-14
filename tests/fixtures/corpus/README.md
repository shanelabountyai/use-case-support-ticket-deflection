# Synthetic corpus — machinery proof only

**Every record here is invented.** No customer, order, card fragment, ticket or
article in this directory corresponds to a real person or a real system. The
names are deliberately implausible and every file carries a `SYNTHETIC` marker.

## Why it exists

There is no Zendesk access for this build yet. This corpus exists so the
*pipeline* can be run and tested end to end — redaction upstream of embedding,
staleness filtering, retrieval, citation verification, abstention, and the
absence of any send path. It proves the machinery works.

## What it cannot prove

It does not satisfy any Phase 1 or Phase 3 acceptance criterion, because those
criteria say **real** tickets:

- **P1-AC-7** — the redaction hand-audit is on real material by a human.
- **P1-AC-12/13** — the labelled retrieval set is real in-scope tickets, and the
  measured number is compared against the threshold Phase 0 records (P0-AC-8).
- **P3-AC-1** — the golden set is a few hundred labelled real tickets.

A green test run here means the code does what it says. It does not mean the
≥80% bar is met, or that redaction recall is acceptable on real ticket prose.
Real tickets contain PII shapes nobody anticipated; that is exactly why
P1-AC-7's audit is a human reading real material rather than a test suite.

## Planted material

`tickets.json` deliberately contains the PII shapes redaction must catch —
customer names, email addresses, phone numbers, order identifiers, postal
addresses, and card-last-four in several written forms. `help-centre.json`
contains three deliberately stale articles, and `macros.json` contains macros
that are superseded by, or directly contradict, a current article.

Fixtures never reach production, and production ticket data never reaches a
laptop — see "Project boundaries" in `CLAUDE.md`.
