---
name: engagement-rules
description: Use this whenever the user assigns a task that could mutate state — writing files, running commands, calling external APIs, deploying, deleting, pushing — and the autonomy level is not explicit. Trigger on phrases like "go ahead", "you decide", "just do it", "handle it", "ship it", "fix everything", or any blanket grant. Also use when the user is ambiguous about how much to confirm. Even a 1% chance the blast radius is unclear means activate.
---
# ENGAGEMENT RULES — Autonomy Levels

## When to Use
- User hands off without specifying confirmation cadence
- Task involves destructive ops (delete, force-push, drop table, restart, deploy)
- Blanket grants like "just do it" or "you decide"
- Multi-step task where blast radius varies between steps

Skip when: the user has already declared a state ("don't ask, just push"), or the task is strictly read-only.

## Protocol
Declare the current weapons state **before** the first action and re-declare any time it changes. Three states only:

1. **HOLD** — read-only. Investigate, search, analyse. No edits, no commands that mutate. Default when blast radius is unknown.
2. **TIGHT** — execute, but confirm each non-trivial action before firing. Default for shared systems, destructive ops, prod-adjacent work.
3. **FREE** — execute end-to-end without per-step confirmation. Reserved for sandboxes, scratch branches, or explicit user grant.

State transitions require an explicit prompt. Escalation (HOLD → TIGHT → FREE) requires user grant. De-escalation (FREE → TIGHT → HOLD) is taken unilaterally whenever risk rises (prod, destructive op, irreversible change).

## Output Format
```
[ROE: <STATE>] — <one-line justification>
```

Emit at session start, on transitions, and any time the user asks "what are you doing".

Example transition prompts:
- "Blast radius unclear — going **TIGHT** for the migration. OK?"
- "Sandbox confirmed — moving to **FREE** for the rest of the loop."

## Example
> **User**: "Clean up the dead code in /lib and push when you're done."
>
> **Response**:
> `[ROE: TIGHT]` — push is irreversible, sharing main branch with team.
>
> Plan: I'll grep for unreferenced exports in `/lib`, list candidates for deletion, and confirm the batch before removing. I'll run tests, then ask before pushing. Escalate to FREE if you tell me to skip the per-batch confirmation.

## Gotchas
- ❌ Treating ROE as a one-time declaration — state must be re-asserted on transitions
- ❌ Inferring FREE from a friendly tone ("yeah go for it" ≠ "skip all confirmations on destructive ops")
- ❌ De-escalating silently — always announce the drop so the user knows why pace changed
- ❌ Forgetting that read-only investigation is always allowed under HOLD — looking is not acting

## References
- `references/doctrine.md` — NATO Rules of Engagement, weapons states, escalation doctrine
