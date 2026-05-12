---
name: checkpoint
description: Use this at any natural break in execution — after completing a brief phase, before starting a new one, when the plan needs to change mid-mission, when a long-running task crosses a milestone, or when the user pings with "how's it going". Also use proactively if the ground truth diverges from the brief and the operator needs to be looped in. Even a 1% chance the user is operating on a stale picture means activate.
---
# CHECKPOINT — Status + Mid-Mission Pivot

## When to Use
- Phase boundary inside a multi-step mission
- Plan changed in flight and user hasn't been told yet
- User asks "status", "where are we", "what's left"
- Long-running task crossed a meaningful milestone
- About to switch from one cluster of work to another

Skip when: nothing has materially changed since the last checkpoint, or the work is small enough that a single end-of-turn summary covers it.

## Protocol
A checkpoint is **bidirectional**: status update going up, optionally a plan change coming down (the FRAGO — Fragmentary Order). Keep it tight; this isn't a log dump.

1. **Position** — Where are we against the original brief? Phase X of Y, on/off track.
2. **Progress** — What was completed since the last checkpoint. Bullets, not prose.
3. **Posture** — Current state: what's running, what's staged, what's blocked.
4. **Pivot (optional)** — If the plan needs to change: what changed in reality, what the new plan is, what the user needs to acknowledge.
5. **Next** — The single next action.

Ack required only when a Pivot is included. Otherwise the checkpoint is fire-and-continue.

## Output Format
```
# CHECKPOINT
**Position**: Phase <n> of <total> — <on track | adjusting | blocked>
**Progress**:
- <item>
- <item>
**Posture**: <current state in one line>
**Pivot** (if any): <what changed → new plan>
**Next**: <single next action>
```

When a Pivot is present, end with: *"Pivot acknowledged? Or hold for direction?"*

## Example
> **Position**: Phase 2 of 4 — adjusting.
>
> **Progress**:
> - `next-themes` provider installed and wired into `_app.tsx`
> - Tailwind config extended with `darkMode: 'class'` and dark color tokens
> - Audited 14 components; 9 use tokens cleanly, 5 have hardcoded hex colors
>
> **Posture**: Branch `feat/dark-mode` is green locally, no commits pushed yet.
>
> **Pivot**: Original plan assumed hardcoded colors would be rare. Found 5 components needing rework, not 1–2. New plan: refactor those 5 to token-based styling before adding the header toggle — adds ~45min.
>
> **Next**: Refactor `Card`, `Modal`, `Toast`, `Sidebar`, `Header` to use `bg-surface` / `text-foreground` tokens.
>
> *"Pivot acknowledged? Or hold for direction?"*

## Gotchas
- ❌ Treating a checkpoint as a transcript of everything tried — it's a snapshot, not a log
- ❌ Hiding a plan change inside **Progress** — if reality diverged, name the Pivot explicitly
- ❌ Skipping the **Next** line — a checkpoint without a forward direction is just a status email
- ❌ Asking for ack when nothing changed — only Pivots need acknowledgment

## References
- `references/doctrine.md` — SITREP and FRAGO origins, why they're merged here
