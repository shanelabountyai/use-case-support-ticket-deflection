import { describe, it, expect } from "vitest";
import { fleissKappa, kappaLabel } from "@deflection/core";

/* The agreement statistic decides whether Phase 0's rubric is usable, so it is
 * worth being sure it does not flatter. The cases below are the ones that
 * matter: perfect, chance-level, and the trap the rubric is most likely to hit.
 */

describe("Fleiss' kappa", () => {
  it("is 1 when every rater agrees on every item, across several tiers", () => {
    const r = fleissKappa([
      ["0", "0", "0"],
      ["2", "2", "2"],
      ["4", "4", "4"],
    ]);
    expect(r.kappa).toBeCloseTo(1, 10);
    expect(r.rawAgreement).toBeCloseTo(1, 10);
    expect(r.unanimousRate).toBeCloseTo(1, 10);
  });

  it("is zero when raters agree exactly as much as their marginals predict", () => {
    // One unanimous item and three split 2–1, with balanced marginals: observed
    // agreement lands precisely on chance.
    const r = fleissKappa([
      ["0", "0", "0"],
      ["0", "1", "1"],
      ["0", "1", "1"],
      ["0", "1", "1"],
    ]);
    expect(r.kappa).toBeCloseTo(0, 10);
    expect(r.rawAgreement).toBeCloseTo(0.5, 10);
  });

  it("goes negative when every item splits, which is worse than chance", () => {
    // Every item 2–1 with balanced marginals. Raters never agree unanimously,
    // which is *less* concordance than random tagging would produce — a real
    // signal that they are reading the tiers differently, and one raw agreement
    // (66.7% here) does not surface at all.
    const r = fleissKappa([
      ["0", "0", "1"],
      ["1", "1", "0"],
      ["0", "1", "1"],
      ["1", "0", "0"],
    ]);
    expect(r.kappa).toBeLessThan(0);
    expect(r.rawAgreement).toBeGreaterThan(0.3);
    expect(kappaLabel(r.kappa)).toBe("worse than chance");
  });

  it("EXPOSES THE TRAP: high raw agreement, no discrimination", () => {
    // Twenty pairs. Every tagger says "cosmetic" almost every time, because a
    // drafting assistant's output skews that way. Raw agreement looks superb.
    // Kappa says they have demonstrated nothing about whether they mean the
    // same thing by a tier — which is the whole reason the floor is set on
    // kappa and not on raw agreement.
    const ratings = [
      ...Array.from({ length: 18 }, () => ["1", "1", "1"]),
      ["1", "1", "2"],
      ["1", "2", "1"],
    ];
    const r = fleissKappa(ratings);
    expect(r.rawAgreement).toBeGreaterThan(0.9);
    expect(r.kappa).toBeLessThan(0.2);
  });

  it("refuses a ragged set rather than silently scoring a different sample per item", () => {
    expect(() => fleissKappa([["0", "0", "0"], ["1", "1"]])).toThrow(/every item must be tagged by every rater/);
  });

  it("rejects a single rater", () => {
    expect(() => fleissKappa([["0"], ["1"]])).toThrow(/at least two raters/);
  });

  it("reports the tier distribution, so a non-discriminating sample is visible", () => {
    const r = fleissKappa([
      ["0", "0", "1"],
      ["0", "0", "0"],
    ]);
    const byCat = Object.fromEntries(r.marginals.map((m) => [m.category, m.share]));
    expect(byCat["0"]).toBeCloseTo(5 / 6, 10);
    expect(byCat["1"]).toBeCloseTo(1 / 6, 10);
  });

  it("handles the degenerate case where every rating is the same tier", () => {
    const r = fleissKappa([
      ["1", "1", "1"],
      ["1", "1", "1"],
    ]);
    expect(r.kappa).toBe(1);
  });

  it("labels bands for orientation", () => {
    expect(kappaLabel(-0.1)).toBe("worse than chance");
    expect(kappaLabel(0.5)).toBe("moderate");
    expect(kappaLabel(0.9)).toBe("almost perfect");
  });
});
