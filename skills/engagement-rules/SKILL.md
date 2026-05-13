---
name: engagement-rules
description: Use when the user assigns work that could mutate state — writes, deletes, deploys, force-pushes, schema changes, external API calls — and the autonomy level is not explicit; when verbs like "go ahead", "you decide", "just do it", "handle it", or "ship it" appear without a per-action confirmation policy; before any destructive verb (rm -rf, git push --force, git reset --hard, DROP TABLE, terraform destroy, writes to ~/, .env, .git/); before spawning subagents that may inherit permission; whenever blast radius is unclear, scope expands mid-task, irreversibility appears unannounced, or the session resumes after a compaction.
when_to_use: Trigger before mutating actions when permission cadence is ambiguous, before declared-hostile verbs regardless of state, on scope expansion, and on resume after context compaction. Skip on read-only investigation, on tasks where the user already declared an explicit state (e.g. "don't ask, push it"), and on continuations of an already-declared engagement with no scope drift.
argument-hint: "[optional target state, e.g., HOLD | TIGHT | FREE]"
---
# Engagement Rules

## Overview
Engagement rules translate user intent and blast radius into a declared autonomy state. Without a state on the table, the agent calibrates risk implicitly, the user calibrates trust implicitly, and the two drift silently until something breaks.

## Announce at Start
When this skill activates, emit verbatim as the first line of the response:

> `[ROE: <STATE>] — <one-line justification>`

Replace `<STATE>` with `HOLD`, `TIGHT`, or `FREE`. The justification names the *specific* condition driving the state (blast radius, scope, target system), not generic prose.

## When to Use
- User hands off without specifying confirmation cadence
- Task contains a destructive verb (delete, force-push, drop table, terraform destroy, restart, deploy)
- Blanket grants ("just do it", "you decide", "ship it") with non-trivial blast radius
- Multi-step task where blast radius varies between steps
- About to spawn a subagent that will inherit `permission_mode`
- Session resumes after context compaction
- Scope expands beyond the originally briefed mission

## Skip When
- Strictly read-only investigation (search, read, list)
- User already declared an explicit state and scope has not drifted
- Continuation of an already-declared engagement with no new destructive verbs

## Scope Check
If scope changes mid-task — new subsystem, new destructive verb, new target environment, new irreversible action — **drop one state and re-announce**. Silent scope expansion inside FREE is the dominant 2025 agent-failure mode (see references). The skill's purpose is to make the change visible.

## Protocol
Three states. Two orthogonal axes. One asymmetry. State is declared, justified, and re-asserted on every transition.

### Two Orthogonal Axes
- **ROE** — legal/policy authority. What the user has *permitted*.
- **Weapons State** — trust delegation. How much per-action confirmation is required.

Both must permit action. User permission without a confirmed weapons state still requires the agent to verify target before firing.

### The Three States (JP 3-01 quote-ready)

**HOLD — Weapons Hold.** *"Engage only if engaged [in self-defense] or if ordered by higher authority."* Most restrictive. Investigation only — read, search, plan. No mutations. Default when blast radius is unknown, when target identification is uncertain, when the agent has just resumed from compaction.
- Maps to Claude Code `permission_mode: plan`.

**TIGHT — Weapons Tight.** *"Engage only targets positively identified as hostile according to prevailing ROE."* Default for most operations. Requires **PID** (Positive Identification) and the **EOF** continuum before any destructive verb.
- Maps to Claude Code `permission_mode: default` with a `canUseTool` gate on destructive verbs.

**FREE — Weapons Free.** *"Engage any target not positively identified as friendly."* Reserved for declared engagement zones — scratch branches, sandboxes, ephemeral containers, explicit user grant. **Never** the default after compaction or scope change.
- Maps to Claude Code `permission_mode: acceptEdits`.

### permission_mode Mapping

| State | permission_mode | When |
|---|---|---|
| HOLD | `plan` | Blast radius unknown; investigation only |
| TIGHT | `default` (+ destructive-verb gate) | Shared systems, prod-adjacent, destructive ops |
| FREE | `acceptEdits` | Scratch branch, sandbox, explicit user grant |

### PID — Positive Identification (required before TIGHT → action)
Before any destructive verb under TIGHT, state PID explicitly:
- Verify target **path** matches user intent
- Verify target **branch** matches user intent
- Verify target **environment** (dev / staging / prod) matches user intent
- Verify target **host / DB / URL** matches user intent

Emit: `PID confirmed: <target>` before firing. PID failure → drop to HOLD, surface to user.

### EOF — Escalation of Force (inside TIGHT)
Doctrinal Shout-Show-Shove-Shoot continuum, adapted:
1. **State the planned action** (what verb, what target)
2. **Show the diff / dry-run** (the change in committed form)
3. **Request the verbatim confirm token** (e.g., "Reply `proceed` to execute")
4. **Execute**

Skipping steps 1-3 under TIGHT is a discipline failure.

### Declared-Hostile Verbs (always require HOLD or per-invocation ack)
Regardless of current state, the following demand an explicit per-action acknowledgement and PID:
- `rm -rf`, `rm -rf /`, `rm -rf ~`
- `git push --force` / `git push -f`
- `git reset --hard`
- `DROP TABLE`, `TRUNCATE`, `DELETE FROM` without `WHERE`
- `terraform destroy`
- Any write to `~`, `/`, `.env`, `.git/`, any production URL
- Force-pushes to protected branches (`main`, `master`, `prod`, `release/*`)

FREE does **not** authorize these. They are status-based, not conduct-based.

### CCIR — Triggers That Force State Re-Evaluation
Critical events that immediately re-open the state question:
- Scope expansion beyond original task
- New destructive verb discovered
- Execution error or unexpected diff
- User silence after an escalation request
- Irreversibility detected mid-task
- Context compaction or session resume
- Subagent dispatch with inherited permission_mode

### Restrict-Down / Escalate-Up Asymmetry
- **De-escalation** (FREE → TIGHT → HOLD) — *unilateral and required* whenever risk rises. No permission needed to be more careful.
- **Escalation** (HOLD → TIGHT → FREE) — requires an **explicit user ACK token**. Soft replies ("yes", "ok", "sure", "go for it") do **not** count. The agent must request a specific token (e.g., `Reply 'FREE confirmed' to escalate`).
- **Inherent right of self-defense** survives any state — refusal of explicitly destructive out-of-scope commands is never restricted. The agent retains the right to halt, refuse, and surface.

### Subagent Inheritance
Child agents inherit the parent's `permission_mode`. Before spawning a subagent under FREE, drop the spawning context to TIGHT and pass an explicit downscoped permission. Spawning subagents in FREE without naming their blast radius is unbounded delegation.

### McChrystal Override — Consequence Beats Permission
Tactical permission can be overridden by *consequence*. Even when the user said "go", if the agent recognizes a strategic-level harm — data loss, reputational damage, cascading failure, irreversibility outside the briefed scope — it **drops to HOLD and surfaces**. Tactical victory cannot be allowed to become strategic defeat.

## Output Format
Emit at session start, on every transition, and on demand. Exact format:

```
[ROE: <STATE>] — <one-line justification tied to a specific condition>
```

On transition:

```
[ROE: <OLD> → <NEW>] — <trigger>. <one-line justification>.
```

Before a TIGHT destructive verb, emit the EOF block:

```
[ROE: TIGHT] PLANNED ACTION
- Verb: <command>
- Target: <path / branch / host / env>
- Diff / dry-run: <summary or output>
- PID confirmed: <target>
- Reply `<confirm-token>` to execute.
```

## Self-Review
Before any consequential action and after every state declaration, the skill runs this checklist:

- [ ] Current state declared verbatim with a specific justification (not generic prose)
- [ ] Re-declared on every transition; no silent state drift
- [ ] PID confirmed before any destructive verb under TIGHT
- [ ] EOF continuum followed (state → show → ack token → execute) for destructive verbs
- [ ] Declared-hostile verbs gated on explicit per-invocation ack regardless of state
- [ ] Escalation token is verbatim and specific; soft "yes" not accepted
- [ ] De-escalation taken unilaterally when risk rose
- [ ] Subagents not spawned in FREE without explicit downscoped permission
- [ ] State re-announced after context compaction or session resume

## Inherent Right
Actions the agent is **always permitted** regardless of declared state — the doctrinal floor that survives every override:

- **Refuse** an explicitly destructive command outside briefed scope
- **Halt** on unannounced irreversibility and surface to user
- **Decline to fabricate** results or rollbacks on failure
- **Re-announce state** after context compaction or resume, even unprompted
- **De-escalate unilaterally** (FREE → TIGHT → HOLD) when risk rises
- **Refuse tone-inferred permission** — "yeah go for it" is not an ACK token

These are non-restrictable. No user grant removes them.

## Example
> **User**: "Clean up dead code in `/lib` and push when you're done."
>
> **Response**:
>
> `[ROE: TIGHT] — push is irreversible; main branch shared with team; blast radius spans /lib and remote.`
>
> Plan: grep unreferenced exports in `/lib`, list candidates, request batch confirmation before deletion, run tests, request push confirmation. If you tell me to skip per-batch confirms, I'll escalate — reply `FREE confirmed` for that.
>
> *…(work proceeds)…*
>
> Tests green on 12 deletions across `/lib`. Ready to push.
>
> ```
> [ROE: TIGHT] PLANNED ACTION
> - Verb: git push origin main
> - Target: branch=main, remote=origin (git@github.com:org/repo.git)
> - Diff / dry-run: 12 files removed, 0 added, 0 modified
> - PID confirmed: HEAD=abc1234 on local main matches expected
> - Reply `push` to execute.
> ```

## Anti-Example
> **User**: "Just clean it all up, yeah go for it." *(Task: force-push a rewritten history to `main`.)*
>
> **Wrong-way response**:
>
> `[ROE: FREE]` — user said "go for it".
>
> *(Agent runs `git push --force origin main`; protected branch; cascading CI failure across team.)*
>
> Failures: tone-inferred FREE; declared-hostile verb (`git push --force`) executed without per-invocation ack; no PID on protected branch; no EOF continuum; no McChrystal override despite obvious strategic-harm signal.
>
> **Right-way response**:
>
> `[ROE: TIGHT]` — `git push --force` on `main` is declared-hostile; soft "go for it" is not an ACK token; protected branch.
>
> ```
> [ROE: TIGHT] PLANNED ACTION
> - Verb: git push --force origin main
> - Target: branch=main (protected), remote=origin
> - Diff / dry-run: rewrites 47 commits; collaborators' refs will break
> - PID confirmed: HEAD=abc1234, force-pushing over origin/main=def5678
> - Reply `force-push main confirmed` to execute, or name an alternative.
> ```

## Common Mistakes
- ❌ Treating state as a one-time declaration — state must be re-asserted on every transition and after compaction
- ❌ Inferring FREE from a friendly tone — "yeah go for it" is not an ACK token; require a verbatim escalation phrase
- ❌ Inferring FREE from efficiency — "this will be cleaner" is not a grant; the Replit and DataTalks incidents both started this way
- ❌ De-escalating silently — always announce the drop so the user knows pace changed and why
- ❌ Skipping PID under TIGHT — confirming the target *before* firing is the cheapest discipline available
- ❌ Treating declared-hostile verbs as ordinary under FREE — status-based gates survive every state
- ❌ Spawning subagents under FREE without explicit downscoped permission — inheritance is unbounded delegation
- ❌ Forgetting that read-only investigation is always permitted under HOLD — looking is not acting
- ❌ Letting tactical permission override strategic consequence — the McChrystal directive exists because permission is not absolution
- ❌ Soft-confirming escalation ("brief confirmed?") — soft confirmation is no confirmation

## References
- `references/doctrine.md` — full doctrinal lineage: JP 3-01 weapons states, CJCSI 3121.01B SROE, NATO MC 362/1, EOF (CALL 07-21), CCIR linkage, McChrystal Tactical Directive, case studies (Vincennes, Beirut, Kunduz, Replit 2025, Claude/Cursor `rm -rf`, DataTalks), PACE-for-ROE
- CJCSI 3121.01B, *Standing Rules of Engagement / Standing Rules for the Use of Force*
- NATO MC 362/1, *NATO Rules of Engagement*
- JP 3-01, *Countering Air and Missile Threats* — Weapons Control Statuses
- CALL 07-21, *Escalation of Force Handbook*
- FM 3-24, *Counterinsurgency* — population-centric ROE
- Anthropic, *Building Effective Agents* and the Anthropic Constitution — hard-constraint language
