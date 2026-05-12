---
name: mission-brief
description: Use this when the user initiates a new task, project, feature, or workstream — especially when triggered by verbs like "build", "implement", "start", "let's do", "ship", "create" — or hands off a vague request without clear endstate. Also use before spawning subagents, before multi-file changes, and whenever success criteria are implicit. Even a 1% chance this applies means activate.
---
# MISSION BRIEF — SMEAC Protocol

## When to Use
- New task initiated without explicit endstate
- User gave a high-level goal, execution detail missing
- About to spawn subagents or run multi-step work
- Success criteria implicit or ambiguous

Skip when: trivial single-file edit with explicit instructions, read-only request, continuation of an already-briefed mission.

## Protocol
Fill these five sections in order. If a section is empty, surface the gap before proceeding.

1. **S — Situation**: current state, constraints, environment
2. **M — Mission**: endstate in one sentence (Commander's Intent)
3. **E — Execution**: phased plan, decision points marked
4. **A — Admin/Logistics**: resources, tools, dependencies, time budget
5. **C — Command/Signal**: reporting cadence, done-criteria

## Output Format
```
# MISSION BRIEF
**S** — [situation]
**M** — [mission, one sentence]
**E** — [execution plan, numbered]
**A** — [resources, dependencies]
**C** — [reporting cadence, done criteria]
```

Then ask: *"Brief confirmed? Or adjust before execution?"* Wait for ack.

## Example
> **User**: "Add dark mode to the dashboard"
>
> **Brief**:
> - **S** — Dashboard uses Tailwind, single light theme, no theme provider, ~14 components
> - **M** — User can toggle light/dark; preference persists across sessions
> - **E** — (1) Add `next-themes` provider (2) Define dark variants in tailwind config (3) Audit components for hardcoded colors (4) Add toggle to header
> - **A** — `next-themes` package, ~2h, no backend changes
> - **C** — PR with screenshots both modes, manual verification
>
> *"Brief confirmed? Or adjust before execution?"*

## Gotchas
- ❌ Skipping the brief because "the task looks clear" — clarity is felt, then proven wrong
- ❌ Filler content ("Mission: do the thing")
- ❌ Workflow summary in the description field — Claude will shortcut and skip the protocol
- ❌ Treating brief as one-way emission — it's a contract requiring ack

## References
- `references/doctrine.md` — SMEAC origins, USMC OPORD history
