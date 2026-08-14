// Redaction. Runs UPSTREAM of embedding and upstream of any model-provider
// call — never downstream. See CLAUDE.md ("Oversight is required and
// sensitivity is pii") and PRD acceptance criteria P1-AC-6 and P2-AC-8.
//
// The structural enforcement is the `RedactedText` wrapper below: nothing in
// this package accepts a bare string where redacted content is required, so
// deleting the redaction step is a type error and a runtime throw rather than
// a silent leak. That is the whole point of the wrapper — do not "simplify" it
// back to a string.

export type PiiKind = "card" | "order" | "email" | "phone" | "address" | "name";

/** Redacted content. The only way to obtain one is to call `redact()`. */
export interface RedactedText {
  readonly __redacted: true;
  readonly text: string;
  /** Count of each PII kind removed, so redaction recall is measurable rather than assumed. */
  readonly removed: Readonly<Partial<Record<PiiKind, number>>>;
}

interface Rule {
  kind: PiiKind;
  pattern: RegExp;
  /** Replaces the whole match unless `group` names a capture to replace instead. */
  group?: number;
}

// Phrases that look like names to the heuristic but are product or UI surface.
const NOT_NAMES = new Set([
  "Your Orders",
  "Request refund",
  "Track parcel",
  "Forgot password",
  "Kirkmichael Bay",
  "Store Credit",
]);

// Order matters: card patterns run before phone, or a 16-digit PAN is eaten as
// a phone number and the card fragment survives into the index.
const RULES: Rule[] = [
  // Full card number, spaced or hyphenated. Never indexed, never sent.
  { kind: "card", pattern: /\b(?:\d[ -]?){12,18}\d\b/g },
  // Card last four, in the forms customers actually write.
  // "ends 7788" was a miss found by the purge rehearsal, not by design — the
  // exact shape P1-AC-8 says to treat as a pipeline bug with a regression test.
  { kind: "card", pattern: /\b(?:ending|ends|end)(?:\s+(?:in|with))?\s+\d{4}\b/gi },
  { kind: "card", pattern: /\b(?:last\s+four|last\s+4)\s+(?:digits\s+)?(?:are\s+|is\s+)?\d{4}\b/gi },
  { kind: "card", pattern: /(?:\*{4}[\s-]?){1,3}\d{4}\b/g },
  { kind: "card", pattern: /\bcard\s+(?:with\s+)?\d{4}\b/gi },
  { kind: "card", pattern: /\bthe\s+\d{4}\s+card\b/gi },

  { kind: "order", pattern: /\bORD-\d+\b/gi },
  { kind: "order", pattern: /#\d{5,}\b/g },

  { kind: "email", pattern: /\b[\w.+-]+@[\w-]+(?:\.[\w-]+)+\b/g },

  { kind: "phone", pattern: /(?:\+\d{1,3}\s?)?\b0?\d{3,4}\s?\d{6,7}\b/g },

  // Street line through to a UK-shaped postcode, then any bare postcode.
  {
    kind: "address",
    pattern: /\b\d+[A-Za-z]?\s+(?:[A-Z][\w'-]*\s+){1,5}[A-Z][\w'-]*(?:,\s*(?:[A-Z][\w'-]*\s*){1,3})*,?\s*[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}\b/g,
  },
  { kind: "address", pattern: /\b[A-Z]{1,2}\d{1,2}[A-Z]?\s\d[A-Z]{2}\b/g },

  // ponytail: name detection is a heuristic, not NER. It catches double-barrelled
  // surnames and sign-off-anchored names, which is what the synthetic corpus
  // contains — it will miss ordinary two-token names in running prose. The
  // kickoff package specifies "named-entity plus pattern-based detection";
  // swap this rule for a real NER pass before P1-AC-7's hand-audit, and treat
  // every miss the audit finds as a pipeline bug (P1-AC-8).
  { kind: "name", pattern: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?\s+[A-Z][a-z]+-[A-Z][a-z]+\b/g },
  {
    kind: "name",
    pattern:
      /(?:^|[.—\-,]\s*)(?:Signed|Regards|Thanks|Cheers|From|Coach|This is)[,:]?\s+([A-Z][a-z]+(?:\s+[A-Z][\w'-]+){1,2})/gm,
    group: 1,
  },
];

const PLACEHOLDER: Record<PiiKind, string> = {
  card: "[CARD]",
  order: "[ORDER_ID]",
  email: "[EMAIL]",
  phone: "[PHONE]",
  address: "[ADDRESS]",
  name: "[CUSTOMER_NAME]",
};

/**
 * Replace PII with stable placeholders, so a draft can still say "your order"
 * coherently while the identifier itself never reaches the index or the model.
 */
export function redact(raw: string): RedactedText {
  const removed: Partial<Record<PiiKind, number>> = {};
  let text = raw;

  for (const rule of RULES) {
    text = text.replace(rule.pattern, (match, ...rest) => {
      const token = PLACEHOLDER[rule.kind];
      if (rule.group === undefined) {
        if (match.includes("[")) return match; // already redacted by an earlier rule
        removed[rule.kind] = (removed[rule.kind] ?? 0) + 1;
        return token;
      }
      const captured = rest[rule.group - 1] as string;
      if (NOT_NAMES.has(captured) || captured.includes("[")) return match;
      removed[rule.kind] = (removed[rule.kind] ?? 0) + 1;
      return match.replace(captured, token);
    });
  }

  return { __redacted: true, text, removed };
}

/**
 * Gate for every path that leaves this process with customer-derived content —
 * embedding and model-provider calls. Throws rather than returning false so a
 * caller cannot ignore it.
 */
export function assertRedacted(value: unknown): asserts value is RedactedText {
  if (
    typeof value !== "object" ||
    value === null ||
    (value as RedactedText).__redacted !== true ||
    typeof (value as RedactedText).text !== "string"
  ) {
    throw new TypeError(
      "un-redacted content reached a path that requires redaction — redaction runs upstream of embedding and of any model call (P1-AC-6, P2-AC-8)",
    );
  }
}

/** Total PII items removed, for the redaction record kept per document/request. */
export function redactionCount(r: RedactedText): number {
  return Object.values(r.removed).reduce((a, b) => a + b, 0);
}
