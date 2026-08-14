/**
 * End-to-end drafting demo against the synthetic corpus and a real model call.
 *
 *   npm run demo:draft            # every fixture ticket
 *   npm run demo:draft tkt-0006   # one ticket
 *
 * Needs ANTHROPIC_API_KEY in .env.local. This build has its own key so that
 * rotating or revoking one build's credential never touches another's
 * (SETUP.md §6) — do not inherit a key from a parent folder or a sibling build.
 *
 * What this demonstrates: redaction upstream of the provider call, retrieval
 * over staleness-filtered material, one prompted generation, mechanical
 * citation verification, abstention, and no send path. What it does NOT
 * demonstrate: the ≥80% minor-edit bar, or redaction recall on real ticket
 * prose. Both need real tickets.
 */
import { readFileSync } from "node:fs";
import { buildCorpus, claudeGenerator, draftReply, type Article, type Macro, type RetrievalConfig } from "@deflection/core";

const fixture = (n: string) => JSON.parse(readFileSync(new URL(`../tests/fixtures/corpus/${n}`, import.meta.url), "utf8"));

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is empty or unset. Put this build's own key in .env.local.");
  process.exit(1);
}

// PLACEHOLDER thresholds — not agreed numbers. See P0-AC-8/9/10/11.
const config: RetrievalConfig = { stalenessMaxAgeDays: 540, topK: 4, abstainBelowScore: 0.02, asOf: "2026-08-14" };
const corpus = buildCorpus(fixture("help-centre.json").articles as Article[], fixture("macros.json").macros as Macro[], config);
const generate = claudeGenerator();

const wanted = process.argv.slice(2);
const tickets = (fixture("tickets.json").tickets as { id: string; questionType: string; body: string }[]).filter(
  (t) => wanted.length === 0 || wanted.includes(t.id),
);

for (const ticket of tickets) {
  console.log(`\n${"─".repeat(78)}\n${ticket.id}  (${ticket.questionType})`);
  console.log(`ticket:  ${ticket.body.replace(/\s+/g, " ").slice(0, 160)}…`);

  const result = await draftReply(corpus, ticket.body, generate);

  if (result.status === "abstained") {
    console.log(`\nABSTAINED — ${result.reason}`);
  } else if (result.status === "citation-failed") {
    console.log(`\nCITATION FAILED — unresolved: ${result.unresolved.join(", ")}`);
  } else {
    console.log(`\ndraft:\n${result.text}`);
    console.log(`\ncited:`);
    for (const c of result.citations) console.log(`  ${c.passageId}  ${c.title}  (updated ${c.lastUpdated})  ${c.url ?? ""}`);
  }
  console.log(`retrieved: ${result.retrieved.join(", ") || "—"}`);
}

console.log(`\n${"─".repeat(78)}\nNothing above was sent. There is no code path in this project that can send.`);
