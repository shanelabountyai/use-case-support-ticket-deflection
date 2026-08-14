// Corpus indexing and retrieval.
//
// Every threshold this file needs is a REQUIRED config field with no default.
// That is deliberate: the retrieval-quality, staleness-age and abstention
// numbers are recorded in Phase 0 with a named arbiter (P0-AC-8, P0-AC-9,
// P0-AC-10, P0-AC-11). A default here would quietly become the agreed number,
// which is exactly the deferral the audit flagged. If it isn't in CLAUDE.md or
// docs/, it's an open question, not a default to fill in.

import { redact, type RedactedText } from "./redact.js";

export interface RetrievalConfig {
  /** Reference material older than this is excluded. Number set by P0-AC-9. */
  stalenessMaxAgeDays: number;
  /** Size of the retrieved set the P0-AC-8 threshold is measured against. */
  topK: number;
  /**
   * Coverage (0–1) below which the system abstains without spending a model
   * call. A cheap pre-filter, not the abstention mechanism — see `draftReply`.
   * The acceptable abstention band is set by P0-AC-11.
   */
  abstainBelowScore: number;
  /** Evaluation date, so staleness is reproducible rather than wall-clock dependent. */
  asOf: string;
}

export interface Article {
  id: string;
  title: string;
  url: string;
  category: string;
  questionType: string;
  lastUpdated: string;
  status: "current" | "archived";
  body: string;
}

export interface Macro {
  id: string;
  title: string;
  questionType: string;
  lastUpdated: string;
  body: string;
}

export interface Passage {
  id: string;
  source: "help-centre" | "macro";
  title: string;
  url?: string;
  questionType: string;
  lastUpdated: string;
  /** Redacted at ingestion — nothing un-redacted is ever indexed. */
  content: RedactedText;
}

export type QuarantineReason = "stale" | "orphaned" | "archived";

export interface QuarantineEntry {
  id: string;
  title: string;
  source: "help-centre" | "macro";
  reasons: QuarantineReason[];
  lastUpdated: string;
  ageDays: number;
}

export interface Corpus {
  passages: Passage[];
  /** The macro quarantine report and the staleness exclusions — P1-AC-15. */
  quarantined: QuarantineEntry[];
  /** Per-passage provenance for targeted purge and re-embed — P1-AC-11, P1-AC-16. */
  provenance: Map<string, { sourceId: string; ingestedAt: string; redactionVersion: string }>;
  config: RetrievalConfig;
}

export const REDACTION_VERSION = "redact-1";

const DAY_MS = 86_400_000;

function ageDays(lastUpdated: string, asOf: string): number {
  return Math.round((Date.parse(asOf) - Date.parse(lastUpdated)) / DAY_MS);
}

/**
 * Build the index. Help-centre articles and macros are redacted, staleness-
 * filtered and triaged; anything excluded lands in the quarantine report with
 * its reason rather than disappearing.
 *
 * Triage here is date- and orphan-based only. A macro that *contradicts* a
 * current article while being recently edited is not detectable this way —
 * that is a human or model judgement, and Phase 1's risk section says so. The
 * quarantine report is the input to that review, not a substitute for it.
 */
export function buildCorpus(
  articles: Article[],
  macros: Macro[],
  config: RetrievalConfig,
): Corpus {
  const passages: Passage[] = [];
  const quarantined: QuarantineEntry[] = [];
  const provenance = new Map<string, { sourceId: string; ingestedAt: string; redactionVersion: string }>();

  const currentTypes = new Set(
    articles
      .filter((a) => a.status === "current" && ageDays(a.lastUpdated, config.asOf) <= config.stalenessMaxAgeDays)
      .map((a) => a.questionType),
  );

  for (const a of articles) {
    const age = ageDays(a.lastUpdated, config.asOf);
    const reasons: QuarantineReason[] = [];
    if (a.status === "archived") reasons.push("archived");
    if (age > config.stalenessMaxAgeDays) reasons.push("stale");
    if (reasons.length > 0) {
      quarantined.push({ id: a.id, title: a.title, source: "help-centre", reasons, lastUpdated: a.lastUpdated, ageDays: age });
      continue;
    }
    passages.push({
      id: a.id,
      source: "help-centre",
      title: a.title,
      url: a.url,
      questionType: a.questionType,
      lastUpdated: a.lastUpdated,
      content: redact(`${a.title}\n${a.body}`),
    });
    provenance.set(a.id, { sourceId: a.id, ingestedAt: config.asOf, redactionVersion: REDACTION_VERSION });
  }

  for (const m of macros) {
    const age = ageDays(m.lastUpdated, config.asOf);
    const reasons: QuarantineReason[] = [];
    if (age > config.stalenessMaxAgeDays) reasons.push("stale");
    if (!currentTypes.has(m.questionType)) reasons.push("orphaned");
    if (reasons.length > 0) {
      quarantined.push({ id: m.id, title: m.title, source: "macro", reasons, lastUpdated: m.lastUpdated, ageDays: age });
      continue;
    }
    passages.push({
      id: m.id,
      source: "macro",
      title: m.title,
      questionType: m.questionType,
      lastUpdated: m.lastUpdated,
      content: redact(`${m.title}\n${m.body}`),
    });
    provenance.set(m.id, { sourceId: m.id, ingestedAt: config.asOf, redactionVersion: REDACTION_VERSION });
  }

  return { passages, quarantined, provenance, config };
}

/** Remove one source item and everything derived from it — the purge half of P0-AC-13. */
export function purge(corpus: Corpus, sourceId: string): number {
  const before = corpus.passages.length;
  corpus.passages = corpus.passages.filter((p) => p.id !== sourceId);
  corpus.provenance.delete(sourceId);
  return before - corpus.passages.length;
}

const STOPWORDS = new Set(
  ("a an the and or but if is are was were be been being do does did to of in on at for with from by " +
    "i you it my your me we us they them this that these those can could will would have has had not no " +
    "as it's im just please thanks hi hello about back out up so what when where how why any").split(" "),
);

/**
 * ponytail: suffix-stripping, not a real stemmer. It exists to merge
 * order/orders/ordering and ship/shipped/shipping, which is most of what
 * lexical retrieval loses on this corpus. Upgrade path is embeddings, not a
 * better stemmer — see `retrieve`.
 */
function stem(word: string): string {
  if (word.length <= 4) return word;
  for (const suffix of ["ings", "ing", "ies", "ed", "es", "s"]) {
    if (word.endsWith(suffix) && word.length - suffix.length >= 3) {
      const base = word.slice(0, -suffix.length);
      return suffix === "ies" ? `${base}y` : base;
    }
  }
  return word;
}

function terms(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/\[[a-z_]+\]/g, " ") // placeholders carry no retrieval signal
    .split(/[^a-z0-9']+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
    .map(stem);
}

export interface Scored {
  passage: Passage;
  /** Evidence weight, for ranking. Unbounded above. */
  score: number;
  /** Fraction of the query's information this passage explains, 0–1. */
  coverage: number;
}

/**
 * Score passages against a redacted query.
 *
 * Two numbers, because ranking and answerability are two different questions
 * and one figure cannot serve both. `score` is evidence weight — how much of
 * the query this passage explains, used to order results. `coverage` is that
 * same mass as a fraction of everything the query asked about, used to decide
 * whether to draft at all. Conflating them was a real bug during the build: a
 * ticket about steel tensile ratings outranked a genuine refund question,
 * because a couple of incidentally rare shared words outweighed a topical match
 * on common ones.
 *
 * The coverage denominator counts every query term, including ones absent from
 * the corpus entirely. That is what makes abstention work: a question whose
 * meaning lives in words the corpus has never seen scores near zero.
 *
 * The title is weighted more heavily than the body — an article's title is the
 * question it answers, which is exactly what a ticket is.
 *
 * ponytail: distinct-term overlap weighted by inverse document frequency. Not
 * BM25, no embeddings, no reranking — over a corpus this size they would be
 * ceremony. The ceiling is synonymy: a ticket that says "money back" and an
 * article that says "refund" score zero against each other, and no amount of
 * stemming fixes that. Move to embeddings when the labelled retrieval set
 * (P1-AC-12) shows lexical retrieval missing the P0-AC-8 threshold — which is
 * a Phase 1 decision taken on real tickets, not a guess made here.
 */
const TITLE_WEIGHT = 2;

export function retrieve(corpus: Corpus, query: RedactedText): Scored[] {
  const docs = corpus.passages.map((p) => {
    const [title = "", ...body] = p.content.text.split("\n");
    const weights = new Map<string, number>();
    for (const t of terms(body.join("\n"))) weights.set(t, Math.max(weights.get(t) ?? 0, 1));
    for (const t of terms(title)) weights.set(t, TITLE_WEIGHT);
    return { passage: p, weights };
  });
  const n = docs.length || 1;
  const queryTerms = [...new Set(terms(query.text))];

  const idf = new Map(
    queryTerms.map((t) => {
      const df = docs.filter((d) => d.weights.has(t)).length;
      return [t, Math.log(1 + n / (df || 1))];
    }),
  );
  const total = [...idf.values()].reduce((a, b) => a + b, 0) || 1;

  return docs
    .map(({ passage, weights }) => {
      let score = 0;
      for (const t of queryTerms) {
        const w = weights.get(t);
        if (w) score += idf.get(t)! * w;
      }
      return { passage, score, coverage: score / (total * TITLE_WEIGHT) };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || a.passage.id.localeCompare(b.passage.id))
    .slice(0, corpus.config.topK);
}
