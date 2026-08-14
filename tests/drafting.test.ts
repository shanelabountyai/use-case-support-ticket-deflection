import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {
  buildCorpus,
  draftReply,
  purge,
  redact,
  retrieve,
  type Article,
  type Generator,
  type Macro,
  type RetrievalConfig,
} from "@deflection/core";

const fixture = (name: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`./fixtures/corpus/${name}`, import.meta.url)), "utf8"));

const articles = fixture("help-centre.json").articles as Article[];
const macros = fixture("macros.json").macros as (Macro & { expectedTriage: string })[];
const tickets = fixture("tickets.json").tickets as {
  id: string;
  questionType: string;
  expectedSupport: string | null;
  body: string;
}[];

/* PLACEHOLDER THRESHOLDS.
 *
 * These are NOT agreed numbers. The retrieval-quality, staleness-age and
 * abstention figures are recorded in Phase 0 with a named arbiter (P0-AC-8,
 * P0-AC-9, P0-AC-10, P0-AC-11). Nothing in this file may be cited as the
 * agreed value, and no phase passes on the strength of it.
 */
const CONFIG: RetrievalConfig = {
  stalenessMaxAgeDays: 540,
  topK: 4,
  // Near-zero on purpose. Measured on this corpus the coverage floor does not
  // separate answerable from unanswerable tickets (see the test below), so it
  // is left as a guard against the empty-retrieval case only, and the model's
  // own abstention carries the work.
  abstainBelowScore: 0.02,
  asOf: "2026-08-14",
};

const corpus = () => buildCorpus(articles, macros, CONFIG);

describe("ingestion — nothing un-redacted is indexed", () => {
  it("every indexed passage is redacted content", () => {
    for (const p of corpus().passages) {
      expect(p.content.__redacted).toBe(true);
    }
  });

  it("records provenance for every passage, so a targeted purge is possible", () => {
    const c = corpus();
    for (const p of c.passages) {
      const prov = c.provenance.get(p.id);
      expect(prov, `${p.id} has no provenance`).toBeDefined();
      expect(prov!.redactionVersion).toBeTruthy();
    }
  });
});

describe("staleness filtering and macro triage", () => {
  const c = corpus();

  it("excludes archived and out-of-date help-centre articles", () => {
    const ids = c.passages.map((p) => p.id);
    expect(ids).not.toContain("hc-refund-window-2023");
    expect(ids).not.toContain("hc-loyalty-tiers-2022");
    expect(ids).not.toContain("hc-gift-receipt-2023");
    expect(ids).toContain("hc-refund-window");
  });

  it("quarantines every macro the fixture marks as not current, with a reason", () => {
    const quarantinedIds = new Set(c.quarantined.map((q) => q.id));
    for (const m of macros) {
      const shouldQuarantine = m.expectedTriage !== "current";
      expect(quarantinedIds.has(m.id), `${m.id} (${m.expectedTriage})`).toBe(shouldQuarantine);
    }
    for (const q of c.quarantined) expect(q.reasons.length).toBeGreaterThan(0);
  });

  it("keeps no quarantined macro reachable from retrieval", () => {
    const quarantined = new Set(c.quarantined.map((q) => q.id));
    for (const p of c.passages) expect(quarantined.has(p.id)).toBe(false);
  });
});

describe("retrieval", () => {
  const c = corpus();
  const answerable = tickets.filter((t) => t.expectedSupport !== null);

  it("reports recall per question type, and names the types that miss", () => {
    const misses = answerable.filter(
      (t) => !retrieve(c, redact(t.body)).some((s) => s.passage.id === t.expectedSupport),
    );
    // Reported, not silently averaged — an aggregate that passes while
    // individual types fail is a finding Phase 2 must carry (P1-AC-14).
    // `npm run report:retrieval` prints the per-type breakdown.
    if (misses.length > 0) {
      console.warn(
        `retrieval missed the labelled article for: ${misses.map((m) => `${m.id} (${m.questionType})`).join(", ")}`,
      );
    }
    // Deliberately loose. This is not the P0-AC-8 threshold and must never be
    // cited as one; it is a regression guard so a change that halves recall
    // fails loudly.
    expect(misses.length / answerable.length).toBeLessThan(0.5);
  });

  it("RECORDED FINDING: coverage does not separate answerable from unanswerable", () => {
    // The main technical risk the plan names is retrieval, and this is what it
    // looks like measured. On the synthetic corpus the worst answerable ticket
    // scores BELOW the best unanswerable one, so no coverage floor can split
    // them — which is why the drafting loop leans on model-side abstention
    // instead. The upgrade path is embeddings, decided in Phase 1 on real
    // tickets against the P0-AC-8 threshold.
    //
    // When this test starts failing, retrieval has improved enough to separate
    // them. That is good news: re-derive the floor and update this test.
    const cov = (t: { body: string }) => retrieve(c, redact(t.body))[0]?.coverage ?? 0;
    const worstAnswerable = Math.min(...answerable.map(cov));
    const bestUnanswerable = Math.max(...tickets.filter((t) => t.expectedSupport === null).map(cov));
    expect(worstAnswerable).toBeLessThan(bestUnanswerable);
  });
});

/* A stub generator keeps the loop deterministic and lets the suite run with no
 * API key and no network. `claudeGenerator()` is the real one; swapping it in
 * changes nothing about the checks below, which are all about the loop's
 * contract rather than the prose it produces.
 */
const stub =
  (over: Partial<Awaited<ReturnType<Generator>>> = {}): Generator =>
  async (_system, user) => {
    const firstId = user.match(/<passage id="([^"]+)"/)?.[1] ?? "";
    return {
      abstain: false,
      reason: "",
      reply: "Thanks for getting in touch — you can request a refund from Your Orders.",
      citations: [firstId],
      ...over,
    };
  };

describe("the drafting loop", () => {
  const c = corpus();
  const refundTicket = tickets.find((t) => t.id === "tkt-0001")!.body;

  it("produces a cited draft for a recurring question type", async () => {
    const r = await draftReply(c, refundTicket, stub());
    expect(r.status).toBe("drafted");
    if (r.status !== "drafted") return;
    expect(r.citations.length).toBeGreaterThan(0);
    expect(r.citations[0].passageId).toBe(r.retrieved[0]);
  });

  it("never lets the raw ticket reach the model", async () => {
    let seen = "";
    await draftReply(c, refundTicket, async (_s, u) => {
      seen = u;
      return { abstain: false, reason: "", reply: "x", citations: [u.match(/id="([^"]+)"/)![1]] };
    });
    expect(seen).not.toMatch(/ORD-884211|@example-synthetic|900412/);
    expect(seen).toContain("[ORDER_ID]");
  });

  it("fails a draft whose citation does not resolve to a retrieved passage", async () => {
    const r = await draftReply(c, refundTicket, stub({ citations: ["hc-invented-article"] }));
    expect(r.status).toBe("citation-failed");
    if (r.status !== "citation-failed") return;
    expect(r.unresolved).toContain("hc-invented-article");
  });

  it("fails a draft that cites nothing at all", async () => {
    const r = await draftReply(c, refundTicket, stub({ citations: [] }));
    expect(r.status).toBe("citation-failed");
  });

  it("abstains before spending a model call when coverage is below the floor", async () => {
    // The floor mechanism, exercised with a config that actually engages it.
    // The demo config sets it near zero on purpose — see the recorded finding
    // above — so this test supplies its own.
    const strict = buildCorpus(articles, macros, { ...CONFIG, abstainBelowScore: 0.9 });
    let called = false;
    const r = await draftReply(strict, refundTicket, async () => {
      called = true;
      return { abstain: false, reason: "", reply: "sure", citations: [] };
    });
    expect(r.status).toBe("abstained");
    expect(called, "abstention should not spend a model call").toBe(false);
  });

  it("honours a model-side abstention", async () => {
    const r = await draftReply(c, refundTicket, stub({ abstain: true, reason: "passages do not cover final sale" }));
    expect(r.status).toBe("abstained");
    if (r.status !== "abstained") return;
    expect(r.reason).toMatch(/final sale/);
  });
});

describe("PII incident path — purge and re-embed is executable", () => {
  it("removes an identified item and everything derived from it", () => {
    // Rehearsal of the response P0-AC-13 defines, demonstrated once on a
    // planted item rather than described (P1-AC-11).
    const planted: Article = {
      id: "hc-planted-leak",
      title: "Planted leak",
      url: "https://help.example-synthetic.test/planted",
      category: "refunds",
      questionType: "refund-window",
      lastUpdated: "2026-08-01",
      status: "current",
      body: "Refund enquiries from the cardholder whose card ends 7788 are handled by the escalations desk.",
    };

    const c = buildCorpus([...articles, planted], macros, CONFIG);
    const indexed = c.passages.find((p) => p.id === "hc-planted-leak")!;
    // Redaction already caught the fragment on the way in.
    expect(indexed.content.text).not.toContain("7788");

    expect(purge(c, "hc-planted-leak")).toBe(1);
    expect(c.passages.some((p) => p.id === "hc-planted-leak")).toBe(false);
    expect(c.provenance.has("hc-planted-leak")).toBe(false);
  });
});

describe("no send capability exists", () => {
  // The constraint is that drafts are never auto-sent. This asserts absence,
  // not configuration: there is no code path to disable and re-enable
  // (P2-AC-9). The credential half (P2-AC-10) is verified against the
  // ticketing platform, not here.
  // Comments are stripped first: the check is about code, not prose. Without
  // this, draft.ts's own "there is no code that can send" comment fails it.
  const sources = ["redact.ts", "corpus.ts", "draft.ts", "index.ts"].map((f) =>
    readFileSync(fileURLToPath(new URL(`../packages/core/${f}`, import.meta.url)), "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "")
      .replace(/`(?:[^`\\]|\\.)*`/g, "``"), // prompt strings are text, not call sites
  );

  it.each([/\bsendReply\b/, /\bsend\s*\(/, /\bpostComment\b/, /public_comment/, /\.tickets\.update\b/])(
    "no %s anywhere in packages/core",
    (pattern) => {
      for (const src of sources) expect(src).not.toMatch(pattern);
    },
  );

  it("exports nothing whose name suggests sending", async () => {
    const mod = await import("@deflection/core");
    const senders = Object.keys(mod).filter((k) => /send|submit|publish|reply(?!\w)/i.test(k) && k !== "draftReply");
    expect(senders).toEqual([]);
  });
});
