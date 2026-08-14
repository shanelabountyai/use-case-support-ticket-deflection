import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { redact, assertRedacted, redactionCount } from "@deflection/core";

/* Redaction is scored on its own terms, never by the drafting quality rubric.
 * A redaction miss is a different class of failure from a weak draft — see
 * docs/prd/phase-1-corpus-redaction-and-retrieval.md.
 *
 * These tests run against SYNTHETIC fixtures. Passing them is evidence the
 * pipeline does what it claims; it is NOT P1-AC-7, which is a human hand-audit
 * of a recorded sample of REAL material at the size P0-AC-14 sets.
 */

const fixture = (name: string) =>
  JSON.parse(readFileSync(fileURLToPath(new URL(`./fixtures/corpus/${name}`, import.meta.url)), "utf8"));

const tickets = fixture("tickets.json").tickets as {
  id: string;
  body: string;
  plantedPii: string[];
}[];

describe("redaction — the shapes the compliance constraint names", () => {
  it("removes a full card number", () => {
    const r = redact("Full card number was 4111 1111 1111 1234 if that helps.");
    expect(r.text).not.toMatch(/4111/);
    expect(r.text).toContain("[CARD]");
  });

  it.each([
    ["ending in 4242", "4242"],
    ["the one ending 5544", "5544"],
    ["paid with **** **** **** 9310", "9310"],
    ["the card with last four 1881", "1881"],
    ["put it on the 0042 card", "0042"],
  ])("removes card-last-four written as %j", (input, digits) => {
    const r = redact(input);
    expect(r.text, `"${input}" leaked ${digits}`).not.toContain(digits);
  });

  it("removes order identifiers, emails, phone numbers and postcodes", () => {
    const r = redact(
      "Order ORD-884211 for kai.oyelaran-fitch@example-synthetic.test, call 07700 900412, at 14 Threlfall Row, Kirkmichael Bay, KB7 2QL.",
    );
    expect(r.text).not.toMatch(/ORD-884211|@example-synthetic|900412|KB7 2QL/);
    expect(r.removed.order).toBeGreaterThan(0);
    expect(r.removed.email).toBeGreaterThan(0);
  });

  it("leaves stable placeholders so a draft can still say 'your order' coherently", () => {
    const r = redact("Where is order ORD-773190?");
    expect(r.text).toBe("Where is order [ORDER_ID]?");
  });

  it("records what it removed, so recall is measurable rather than assumed", () => {
    const r = redact("ORD-1 and ORD-2 for a@b.test");
    expect(redactionCount(r)).toBe(3);
  });
});

describe("redaction — no card fragment survives any fixture ticket", () => {
  // The highest-consequence check in the suite. Every four-digit run planted as
  // a card fragment must be gone from the redacted text.
  const CARD_DIGITS = ["4242", "5544", "9310", "1881", "1234", "4111"];

  it.each(tickets.map((t) => [t.id, t.body] as const))("%s", (_id, body) => {
    const r = redact(body);
    for (const digits of CARD_DIGITS) {
      if (!body.includes(digits)) continue;
      expect(r.text, `card fragment ${digits} survived redaction`).not.toContain(digits);
    }
  });
});

describe("redaction runs upstream, structurally", () => {
  it("refuses un-redacted content at the gate", () => {
    // A caller who skips redact() and hands a bare string to an embedding or
    // provider call gets a throw, not a silent leak (P1-AC-6, P2-AC-8).
    expect(() => assertRedacted("Order ORD-884211 for Sam")).toThrow(/un-redacted/);
    expect(() => assertRedacted({ text: "spoofed" })).toThrow(/un-redacted/);
    expect(() => assertRedacted(redact("Order ORD-884211"))).not.toThrow();
  });
});

describe("known ceiling — recorded, not hidden", () => {
  it("misses an ordinary two-token name in running prose", () => {
    // The name rule is a heuristic, not NER. This test exists so the gap is a
    // recorded fact with a failing example rather than a surprise during
    // P1-AC-7's hand-audit. Replace the rule with a real NER pass before that
    // audit; when this test starts failing, the gap has been closed — update it.
    const r = redact("I spoke to Anna Bell yesterday about it.");
    expect(r.text).toContain("Anna Bell");
  });
});
