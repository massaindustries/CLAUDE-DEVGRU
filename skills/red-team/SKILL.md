---
name: red-team
description: Use this before merging, before declaring a task done, before a release — and after a failure or incident. Trigger on phrases like "review this", "is this done", "ready to ship", "what did we learn", "post-mortem". Also use proactively when the agent is about to mark a multi-step mission complete or when a non-trivial PR is about to be opened. Even a 1% chance the work has a flaw the proposer can't see means activate.
---
# RED TEAM — Adversarial Review + After Action

## When to Use
- About to merge, ship, or declare done
- Non-trivial PR, refactor, or feature reaching the review boundary
- After a failure, regression, or unexpected outcome (AAR mode)
- User asks "what did we learn" or "what went wrong"

Skip when: read-only investigation, single-line trivially-verifiable change, or a red-team pass was already run on the same scope this session.

## Protocol
Adopt the opposite role from whoever did the work. If the agent built it, the red team's job is to break it. If a human shipped it, the red team's job is to find the bug. Two modes:

### Mode A — Pre-Merge Critique
Pick the **three most damaging** plausible failures, not every theoretical issue. Quality > breadth.

1. **Functional break** — input the work was not tested against
2. **Operational break** — failure mode in prod conditions (load, concurrency, partial state, retries)
3. **Architectural break** — coupling, leak, or invariant violation that creates pain later

For each: name it, justify why it's plausible, propose the fix or accept the risk explicitly.

### Mode B — After Action Review (AAR)
Run after a real failure. Four questions, in order. No blame language.

1. **What was supposed to happen?**
2. **What actually happened?**
3. **Why was there a gap?** (root cause; ask "why" until you reach a system property, not a person)
4. **What changes for next time?** (process, code, alert, doctrine — pick one)

## Output Format

**Mode A:**
```
# RED TEAM — Pre-Merge
**Scope**: <what was reviewed>
**Top 3 failure modes**:
1. **<class>**: <failure> — Fix: <action> | Accept: <justification>
2. ...
3. ...
**Verdict**: APPROVE / APPROVE WITH FIX / BLOCK
```

**Mode B:**
```
# AAR — <incident name>
**Intended**: <what was supposed to happen>
**Actual**: <what happened>
**Gap (root cause)**: <system-level reason>
**Change**: <one concrete action, owner if applicable>
```

## Example
> **Scope**: PR adding a `/api/export` endpoint that streams a user's data as JSON.
>
> **Top 3 failure modes**:
> 1. **Operational**: Endpoint streams from a single Postgres query with no LIMIT. A user with 2M records will hold a connection for minutes and pin RAM. → **Fix**: server-side cursor, chunked response, hard upper bound documented.
> 2. **Functional**: No authentication check on the requested user_id — passes `?user_id=` straight to the query. Classic IDOR. → **Fix**: bind to `req.session.user_id`, reject mismatches.
> 3. **Architectural**: Endpoint duplicates the serialization logic from `models/user.py:to_json`, already drifting. → **Fix**: call the shared serializer; delete the duplicate.
>
> **Verdict**: BLOCK — IDOR is shippable as a CVE, not as a feature.

## Gotchas
- ❌ Listing ten medium-severity nits instead of three high-severity failures — review fatigue is a real cost
- ❌ Red-teaming your own work without flipping role — say out loud "I'm now arguing against this" or the bias survives
- ❌ AAR with blame language ("X should have caught this") — the AAR ends the moment defensiveness starts
- ❌ Treating APPROVE WITH FIX as APPROVE — the fix must land before merge, or it won't

## References
- `references/doctrine.md` — red cell history, AAR origin at NTC, why both live in one skill
