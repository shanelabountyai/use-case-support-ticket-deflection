/**
 * Per-question-type retrieval report over the synthetic corpus.
 *
 * P1-AC-14 requires retrieval quality to be reported per question type, not
 * only in aggregate: an aggregate that passes while several types fail is a
 * finding Phase 2 has to carry, not a pass to be reported flatly. This script
 * is that report, run against fixtures.
 *
 *   npm run report:retrieval
 *
 * The numbers it prints are measured on SYNTHETIC tickets and satisfy no
 * acceptance criterion. P1-AC-12/13 want a labelled set of real in-scope
 * tickets, measured against the threshold Phase 0 records (P0-AC-8).
 */
import { readFileSync } from "node:fs";
import { buildCorpus, redact, retrieve, type Article, type Macro, type RetrievalConfig } from "@deflection/core";

const fixture = (n: string) => JSON.parse(readFileSync(new URL(`../tests/fixtures/corpus/${n}`, import.meta.url), "utf8"));

// PLACEHOLDER thresholds — not agreed numbers. See P0-AC-8/9/10/11.
const config: RetrievalConfig = { stalenessMaxAgeDays: 540, topK: 4, abstainBelowScore: 0.18, asOf: "2026-08-14" };

const corpus = buildCorpus(fixture("help-centre.json").articles as Article[], fixture("macros.json").macros as Macro[], config);
const tickets = fixture("tickets.json").tickets as { id: string; questionType: string; expectedSupport: string | null; body: string }[];

console.log(`corpus: ${corpus.passages.length} passages indexed, ${corpus.quarantined.length} quarantined`);
console.log(`config: staleness ${config.stalenessMaxAgeDays}d · topK ${config.topK} · abstain below ${config.abstainBelowScore}\n`);

const byType = new Map<string, { hit: number; total: number; ids: string[] }>();
const coverages: { id: string; answerable: boolean; coverage: number }[] = [];

for (const t of tickets) {
  const results = retrieve(corpus, redact(t.body));
  const top = results[0]?.coverage ?? 0;
  const abstains = top < config.abstainBelowScore;
  coverages.push({ id: t.id, answerable: t.expectedSupport !== null, coverage: top });
  const hit = t.expectedSupport ? results.some((r) => r.passage.id === t.expectedSupport) : null;

  if (t.expectedSupport) {
    const row = byType.get(t.questionType) ?? { hit: 0, total: 0, ids: [] };
    row.total += 1;
    if (hit) row.hit += 1;
    else row.ids.push(t.id);
    byType.set(t.questionType, row);
  }

  const verdict = t.expectedSupport ? (hit ? "hit " : "MISS") : abstains ? "abst" : "ANSW";
  console.log(
    `${t.id}  ${verdict}  coverage=${top.toFixed(3)}  ${t.questionType.padEnd(17)} ` +
      `got: ${results.map((r) => `${r.passage.id}(${r.score.toFixed(2)})`).join(" ") || "—"}`,
  );
}

console.log("\nrecall@%d by question type:", config.topK);
for (const [type, row] of [...byType].sort()) {
  const pct = ((row.hit / row.total) * 100).toFixed(0);
  console.log(`  ${type.padEnd(17)} ${row.hit}/${row.total}  ${pct.padStart(3)}%${row.ids.length ? `   misses: ${row.ids.join(", ")}` : ""}`);
}

const totals = [...byType.values()].reduce((a, r) => ({ hit: a.hit + r.hit, total: a.total + r.total }), { hit: 0, total: 0 });
console.log(`  ${"AGGREGATE".padEnd(17)} ${totals.hit}/${totals.total}  ${((totals.hit / totals.total) * 100).toFixed(0).padStart(3)}%`);

const answerableCov = coverages.filter((c) => c.answerable).map((c) => c.coverage);
const unanswerableCov = coverages.filter((c) => !c.answerable).map((c) => c.coverage);
const worstAnswerable = Math.min(...answerableCov);
const bestUnanswerable = Math.max(...unanswerableCov);
console.log(
  `\ncoverage range — answerable ${worstAnswerable.toFixed(3)}\u2013${Math.max(...answerableCov).toFixed(3)} \u00b7 ` +
    `unanswerable ${Math.min(...unanswerableCov).toFixed(3)}\u2013${bestUnanswerable.toFixed(3)}`,
);
console.log(
  worstAnswerable < bestUnanswerable
    ? "  the ranges OVERLAP — no coverage floor separates answerable from unanswerable, so abstention\n" +
        "  cannot rely on the retrieval score. This is the finding, not a tuning problem: the upgrade\n" +
        "  path is embeddings, decided in Phase 1 against real tickets and the P0-AC-8 threshold."
    : `  the ranges SEPARATE — a coverage floor between ${bestUnanswerable.toFixed(3)} and ${worstAnswerable.toFixed(3)} would work.`,
);
console.log("\nquarantine report:");
for (const q of corpus.quarantined) console.log(`  ${q.id.padEnd(26)} ${q.source.padEnd(12)} ${q.reasons.join("+").padEnd(16)} ${q.ageDays}d old`);
