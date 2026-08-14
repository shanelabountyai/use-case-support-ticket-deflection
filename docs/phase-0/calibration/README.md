# Calibration tagging

One CSV per tagger, named `tagger-<name>.csv`. Three taggers, tagging the same
~40 historical pairs **independently and without conferring** (P0-AC-2).

Copy `tagger-template.csv`, fill the `tier` column, leave `note` for anything
that made the call hard — those notes are the raw material for revising the
rubric if agreement lands below the floor.

```
npm run agreement -- docs/phase-0/calibration/tagger-*.csv
```

Every tagger must tag every pair. The script refuses a ragged set rather than
computing agreement over a different sample per item.

**These files contain judgements about real customer tickets.** They are
gitignored for the same reason production ticket data never reaches a laptop —
keep them where the ticket data itself is allowed to live, and record only the
resulting statistic in the rubric's calibration record.
