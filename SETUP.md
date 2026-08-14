# Setup — Support ticket deflection & reply drafting

This project is self-contained. Every resource below belongs to **this build
only** — nothing is shared with the Use Case Studio that scoped it or with the
sibling builds. The repo can be moved anywhere on disk, or handed to someone
else, without breaking a reference.

Sensitivity is **pii**; oversight is **required**. See "Project boundaries" in
[CLAUDE.md](CLAUDE.md) for why separation is load-bearing rather than tidy.

---

## 1. Source control — done

`shanelabountyai/support-ticket-deflection`, private. Its own history, issues
and access list.

```bash
git remote -v          # origin → shanelabountyai/support-ticket-deflection
```

## 2. Database

**Do this per project.** Create a Neon project named `support-ticket-deflection`
for dev and production. This build holds customer names, order history and
occasional card-last-four; it needs one database with one access list and its
own redaction pipeline. Sharing with the regulated or internal builds spreads
PII into projects that have no reason to hold it and no redaction path for it.

```bash
# Local Postgres for tests — never a cloud database, and never real tickets.
brew install postgresql@17 && brew services start postgresql@17
createdb ticket_deflection_test

# .env.test overrides ONLY the database; everything else comes from .env.local
printf 'DATABASE_URL=postgresql://%s@localhost:5432/ticket_deflection_test\nDIRECT_URL=postgresql://%s@localhost:5432/ticket_deflection_test\n' \
  "$(whoami)" "$(whoami)" > .env.test
```

Point the test scripts at both files, **first file wins**:

```jsonc
"test":     "dotenv -e .env.test -e .env.local -- vitest run",
"test:e2e": "dotenv -e .env.test -e .env.local -- playwright test",
"dev:test": "dotenv -e .env.test -e .env.local -- npm run dev"
```

Why local: a remote test database turns a 0.75s integration test into ~113s,
and makes infrastructure strain look exactly like flaky tests. It also keeps
real customer tickets out of the test path — redaction bugs should surface
against synthetic fixtures, not against someone's order history.

Two traps worth knowing before you hit them:

- **Playwright's `webServer` needs the same env**, or the app under test talks
  to the cloud while the specs talk to localhost.
- **Migrations no longer reach the cloud dev branch as a side effect** of
  running tests. Keep a `db:migrate:all`, or dev drifts silently.

## 3. Environment

```bash
cp .env.example .env.local     # fill in; never commit
```

`.gitignore` already covers `.env` and `.env*.local`. Before any new file's
first push, confirm nothing secret is tracked:

```bash
git ls-files | grep -iE "\.env|secret|credential|\.pem$|\.key$"   # expect no output
```

**The ticketing credential should be read-only.** Drafts must never be
auto-sent; a token that permits a send makes that a policy rather than a
property of the system.

## 4. Deploy and CI

Its own Vercel project and its own workflow — not a directory inside another
project's deployment.

## 5. Model provider

Its own key, so rotating or revoking one build's credential never touches
another's. Confirm what onward data handling the provider performs before
ticket content is processed through it, and keep redaction upstream of the
provider call rather than downstream.

---

## Not yet decided

The application stack is an **open question**, deliberately. The plan names
capabilities, not products, and per this project's working rules that makes it
an open question rather than an assumption to fill in. Decide it when the first
build phase needs somewhere to run, and record the decision here.
