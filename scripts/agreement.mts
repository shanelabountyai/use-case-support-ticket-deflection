/**
 * Inter-rater agreement over the Phase 0 calibration tagging (P0-AC-3).
 *
 *   npm run agreement -- docs/phase-0/calibration/tagger-*.csv
 *
 * Each file is one tagger: `pair_id,tier,note`, header row required. Every
 * tagger must have tagged every pair — a tagger who skipped items would
 * otherwise have their agreement computed over a different, easier sample.
 *
 * Record the kappa in the calibration record in
 * docs/phase-0/edit-severity-rubric.md, against the floor in
 * docs/phase-0/thresholds.md.
 */
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { fleissKappa, kappaLabel } from "@deflection/core";

const files = process.argv.slice(2).filter((a) => a.endsWith(".csv"));
if (files.length < 2) {
  console.error("usage: npm run agreement -- <tagger-a.csv> <tagger-b.csv> [tagger-c.csv ...]");
  process.exit(1);
}

/** pair_id -> tier, per tagger. */
const byTagger = files.map((file) => {
  const rows = readFileSync(file, "utf8")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"));
  const header = rows.shift()!.split(",").map((h) => h.trim());
  const idCol = header.indexOf("pair_id");
  const tierCol = header.indexOf("tier");
  if (idCol === -1 || tierCol === -1) throw new Error(`${file}: header must contain pair_id and tier`);

  const tiers = new Map<string, string>();
  for (const row of rows) {
    const cells = row.split(",");
    const id = cells[idCol]?.trim();
    const tier = cells[tierCol]?.trim();
    if (!id) continue;
    if (!tier) throw new Error(`${file}: pair ${id} has no tier`);
    if (tiers.has(id)) throw new Error(`${file}: pair ${id} appears twice`);
    tiers.set(id, tier);
  }
  return { name: basename(file, ".csv"), tiers };
});

const allIds = [...new Set(byTagger.flatMap((t) => [...t.tiers.keys()]))].sort();
const incomplete = allIds.filter((id) => byTagger.some((t) => !t.tiers.has(id)));
if (incomplete.length > 0) {
  console.error(
    `not every tagger tagged every pair. Missing: ${incomplete
      .slice(0, 10)
      .map((id) => `${id} (${byTagger.filter((t) => !t.tiers.has(id)).map((t) => t.name).join(", ")})`)
      .join("; ")}${incomplete.length > 10 ? ` …and ${incomplete.length - 10} more` : ""}`,
  );
  process.exit(1);
}

const result = fleissKappa(allIds.map((id) => byTagger.map((t) => t.tiers.get(id)!)));

console.log(`taggers : ${byTagger.map((t) => t.name).join(", ")}`);
console.log(`pairs   : ${result.items}\n`);
console.log(`Fleiss' kappa   ${result.kappa.toFixed(3)}   (${kappaLabel(result.kappa)})`);
console.log(`raw agreement   ${(result.rawAgreement * 100).toFixed(1)}%   ← do not set the floor against this`);
console.log(`unanimous       ${(result.unanimousRate * 100).toFixed(1)}% of pairs\n`);

console.log("tier distribution across all ratings:");
for (const { category, share } of result.marginals) {
  const bar = "█".repeat(Math.round(share * 40));
  console.log(`  tier ${category}  ${(share * 100).toFixed(1).padStart(5)}%  ${bar}`);
}

const observedTiers = new Set(result.marginals.filter((m) => m.share > 0).map((m) => m.category));
if (![...observedTiers].some((t) => Number(t) >= 3)) {
  console.log(
    "\nDISCRIMINATION WARNING: no pair was tagged 3 or above by anyone.\n" +
      "  The calibration sample was not drawn across the real range, so a high kappa here\n" +
      "  says the taggers agree on easy cases, not that the rubric discriminates. Redraw\n" +
      "  the sample to include replies that were heavily rewritten (rubric, calibration record).",
  );
}

console.log(
  "\nRecord this figure in docs/phase-0/edit-severity-rubric.md and compare it against\n" +
    "the floor in docs/phase-0/thresholds.md. The floor is set before tagging, not after.",
);
