---
name: ooda
description: Use this when conditions are changing faster than the original plan can absorb — tests keep failing in new ways, an integration behaves differently than docs promised, the agent has been in a debug loop for more than a couple iterations, or a wargame round revealed the plan was based on wrong premises. Trigger on signs of thrash, repeated rework, or "I keep trying things and nothing works". Even a 1% chance the agent is operating on stale assumptions means activate.
---
# OODA — Observe • Orient • Decide • Act

## When to Use
- Debug loop has gone past two failed iterations without new information
- Plan's assumptions no longer match observed reality
- Multiple competing hypotheses with no clear discriminator
- Fast-moving incident where waiting to "plan properly" is a worse option than iterating

Skip when: the original mission brief is still accurate and execution is going as designed. OODA is for uncertainty, not for routine work.

## Protocol
One pass per iteration. Resist skipping straight to Act — that's how loops thrash.

1. **Observe** — Collect raw signal. What did the system actually do? Logs, errors, return values, diff between expected and actual. No interpretation yet.
2. **Orient** — Interpret. What does the signal mean given the model? If the signal contradicts the model, the model is wrong — update it before deciding.
3. **Decide** — Pick the single highest-information-value action. Not "the fix" — the action that, regardless of outcome, tells you the most about which hypothesis is right.
4. **Act** — Execute the chosen action. Capture the result for the next Observe.

When the loop closes (problem solved or hypothesis confirmed), exit OODA and return to the mission brief. If three iterations pass without converging, halt and surface — you're outside the skill's effective range.

## Output Format
Per iteration:
```
## OODA #<n>
**Observe**: <raw signal, no interpretation>
**Orient**: <interpretation; flag if model contradicted>
**Decide**: <single next action and the question it answers>
**Act**: <command/edit executed>
**Result**: <observed outcome>
```

## Example
> **Context**: Tests pass locally but fail in CI with "connection refused" on port 5432.
>
> **OODA #1**
> - **Observe**: CI logs show `psycopg2.OperationalError: could not connect to server: Connection refused` at test setup, line 14 of `conftest.py`.
> - **Orient**: Local uses Docker compose with `postgres` service; CI uses `services:` block in workflow. Hypothesis: hostname differs.
> - **Decide**: Inspect CI workflow `services` config — answers whether the hostname is `postgres` or `localhost`.
> - **Act**: `cat .github/workflows/ci.yml`
> - **Result**: CI exposes Postgres on `localhost`, but `conftest.py` hardcodes `postgres`. Confirmed.
>
> **OODA #2**
> - **Observe**: Single hardcoded hostname at `conftest.py:9`.
> - **Orient**: Plain config bug. Env var override is the cleanest fix; CI and local agree on env vars already.
> - **Decide**: Read env var with local-default fallback.
> - **Act**: Edit `conftest.py:9` to use `os.getenv("PG_HOST", "postgres")`.
> - **Result**: Push, CI green.
>
> Loop closed in two iterations. Returning to mission brief.

## Gotchas
- ❌ Skipping **Observe** because the signal "is obviously X" — your obvious interpretation IS the bias OODA exists to break
- ❌ Picking the "fix" in **Decide** when you don't yet know what's broken — pick the highest-information action, not the highest-confidence action
- ❌ Running OODA forever — three iterations max before halting and escalating
- ❌ Treating OODA as a planning ritual on routine work — it's for high-uncertainty conditions, not every task

## References
- `references/doctrine.md` — Boyd's loop, F-86 vs MiG-15 origin, why "tempo" beats "perfection"
