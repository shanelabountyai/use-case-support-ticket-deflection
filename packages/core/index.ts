// Pure domain logic for Support ticket deflection & reply drafting.
//
// Keep this side-effect free: no I/O, no Prisma calls, no fetch. It is where
// the logic worth unit-testing lives, which is why the vitest suite can run
// against a local Postgres in under a second rather than a network round trip.
//
// One deliberate omission: nothing here sends. Drafts are handed to an agent's
// editor and a human sends them, or nobody does — see draft.ts.

export * from "./redact.js";
export * from "./corpus.js";
export * from "./draft.js";
