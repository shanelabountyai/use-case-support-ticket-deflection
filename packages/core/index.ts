// Pure domain logic for Support ticket deflection & reply drafting.
//
// Keep this side-effect free: no I/O, no Prisma calls, no fetch. It is where
// the logic worth unit-testing lives, which is why the vitest suite can run
// against a local Postgres in under a second rather than a network round trip.
export {};
