// Inter-rater agreement for the edit-severity rubric calibration (P0-AC-3).
//
// Fleiss' kappa, not raw agreement. With six tiers and a distribution skewed
// toward the low ones — which is what a working drafting assistant produces —
// raw agreement is high even when taggers are barely discriminating, because
// two people who both default to "cosmetic" agree by construction. Kappa
// subtracts the agreement expected from the marginal distribution alone, so it
// answers the question the rubric actually needs answered: do these people mean
// the same thing by tier 2?
//
// Report both. Raw agreement is what people intuitively expect and will ask
// for; kappa is what the floor is set against.

export interface AgreementResult {
  /** Fleiss' kappa. 1 is perfect; 0 is chance; negative is worse than chance. */
  kappa: number;
  /** Mean proportion of agreeing rater pairs per item. */
  rawAgreement: number;
  /** Proportion of items where every rater gave the same tier. */
  unanimousRate: number;
  items: number;
  raters: number;
  /** Share of all ratings falling in each category, in category order. */
  marginals: { category: string; share: number }[];
}

/**
 * @param ratings one entry per item, listing each rater's category for it.
 *                Every item must carry the same number of ratings.
 */
export function fleissKappa(ratings: string[][], categories?: string[]): AgreementResult {
  if (ratings.length === 0) throw new Error("no items to score");

  const raters = ratings[0].length;
  if (raters < 2) throw new Error("agreement needs at least two raters");
  const ragged = ratings.findIndex((r) => r.length !== raters);
  if (ragged !== -1) {
    throw new Error(
      `item ${ragged + 1} has ${ratings[ragged].length} ratings but the first has ${raters} — ` +
        "every item must be tagged by every rater, or agreement is computed over a different sample per item",
    );
  }

  const cats = categories ?? [...new Set(ratings.flat())].sort();
  const counts = ratings.map((row) => cats.map((c) => row.filter((v) => v === c).length));

  // Per-item agreement: the proportion of rater pairs that concur.
  const perItem = counts.map((row) => (row.reduce((a, n) => a + n * n, 0) - raters) / (raters * (raters - 1)));
  const rawAgreement = perItem.reduce((a, b) => a + b, 0) / ratings.length;

  // Expected agreement from the marginal distribution alone.
  const totals = cats.map((_, j) => counts.reduce((a, row) => a + row[j], 0));
  const shares = totals.map((t) => t / (ratings.length * raters));
  const expected = shares.reduce((a, p) => a + p * p, 0);

  // Every rater used exactly one category throughout: agreement is total and
  // chance agreement is also total, so kappa is 0/0. Report 1 — the raters do
  // agree — and let the discrimination check in the rubric catch the fact that
  // a constant tagging carries no information.
  const kappa = expected === 1 ? 1 : (rawAgreement - expected) / (1 - expected);

  return {
    kappa,
    rawAgreement,
    unanimousRate: counts.filter((row) => row.some((n) => n === raters)).length / ratings.length,
    items: ratings.length,
    raters,
    marginals: cats.map((category, j) => ({ category, share: shares[j] })),
  };
}

/** Landis & Koch's conventional bands, for orientation only — the floor is the number in thresholds.md. */
export function kappaLabel(kappa: number): string {
  if (kappa < 0) return "worse than chance";
  if (kappa < 0.21) return "slight";
  if (kappa < 0.41) return "fair";
  if (kappa < 0.61) return "moderate";
  if (kappa < 0.81) return "substantial";
  return "almost perfect";
}
