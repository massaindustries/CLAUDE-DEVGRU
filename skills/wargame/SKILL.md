---
name: wargame
description: Use this before committing to a non-trivial plan — migrations, refactors, new architectures, deployment changes, anything where failure is expensive or hard to undo. Trigger on phrases like "what could go wrong", "is this safe", "before we ship", "let's plan a rollout", or whenever the user expresses uncertainty about an approach. Also use proactively before running irreversible commands. Even a 1% chance the plan has a hidden failure mode means activate.
---
# WARGAME — Pre-Mortem Simulation

## When to Use
- Plan exists and is about to be executed; consequences are non-trivial
- Migration, refactor, schema change, deploy, rollout
- User expresses uncertainty ("is this right?", "could this break?")
- Before any irreversible step (force-push, drop table, prod deploy)

Skip when: the action is trivially reversible (single-line edit on a scratch branch), or a wargame was already run on the same plan within the session.

## Protocol
Run three rounds. Each round names a failure, stress-tests the plan against it, and records the mitigation.

1. **Round 1 — Red moves first**: assume the worst plausible thing goes wrong at the highest-blast step. Name it specifically.
2. **Round 2 — Hidden constraint**: identify one thing the plan assumes but hasn't verified (locking behavior, retry semantics, version skew, partial state on failure).
3. **Round 3 — Detection and rollback**: how does the operator *learn* something broke, and how fast can they undo it?

If any round produces a fatal flaw with no mitigation, halt and surface it. The plan does not survive contact.

## Output Format
```
# WARGAME
**Plan**: <one-line summary of what's about to be executed>

**Round 1 — Worst plausible failure**
- Failure: <specific>
- Mitigation: <specific, or NONE — halt>

**Round 2 — Unverified assumption**
- Assumption: <specific>
- Verification: <how to check before execution>

**Round 3 — Detection & rollback**
- Detection: <log line, metric, smoke test>
- Rollback: <command, time-to-undo>

**Verdict**: PROCEED / PROCEED WITH GUARDRAILS / HALT
```

## Example
> **Plan**: Add `NOT NULL email` column to `users` (50M rows), backfill with default, deploy.
>
> **Round 1 — Worst plausible failure**
> - Failure: `ALTER TABLE ... ADD COLUMN NOT NULL DEFAULT` takes a long ACCESS EXCLUSIVE lock on Postgres < 11, blocking all writes for ~hours.
> - Mitigation: Two-phase — add column nullable, backfill in batches, then add NOT NULL constraint with `NOT VALID` + `VALIDATE`.
>
> **Round 2 — Unverified assumption**
> - Assumption: App writes tolerate a nullable email column between phase 1 and 2.
> - Verification: Grep ORM models for non-null assertions; check API contract; run staging migration first.
>
> **Round 3 — Detection & rollback**
> - Detection: pgbouncer wait time, write-error rate, p99 query latency dashboards.
> - Rollback: Phase 1 reversible (drop column). Phase 3 reversible only if no app code yet depends on NOT NULL — order the deploy accordingly.
>
> **Verdict**: PROCEED WITH GUARDRAILS — split into three deploys, staging first.

## Gotchas
- ❌ Generic failures ("the database might be slow") — name the specific row, table, query, or step
- ❌ Skipping Round 3 because Round 1 looked clean — most outages come from how the team *learned* something broke, not the break itself
- ❌ Treating "PROCEED WITH GUARDRAILS" as PROCEED — guardrails imply the plan changed, return to brief and update it
- ❌ Running the wargame *after* execution started — by then it's an AAR, not a wargame

## References
- `references/doctrine.md` — wargaming history, pre-mortem method, red-cell origins
