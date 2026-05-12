---
name: mission-brief
description: Use when the user initiates a new task, feature, project, or workstream without an explicit endstate; when verbs like "build", "implement", "ship", "create", "let's do", or "start" appear without success criteria; before spawning subagents; before any multi-file change; whenever the user hands off a vague request. Emits a five-section operational brief in SMEAC form, runs a self-review against doctrinal checks, and waits for an explicit ACK before execution.
when_to_use: Trigger on new tasks with implicit endstate, multi-file or destructive work ahead, subagent dispatch, or any handoff where success criteria are not already pinned down. Skip on trivial single-file edits with explicit instructions, read-only inspection requests, and continuations of an already-briefed mission.
argument-hint: "[topic or rough task description]"
---
# Mission Brief

## Overview
A mission brief is the contract between intent and execution. It surfaces what's true now, what success looks like, how the work decomposes, and what must hold for the plan to survive contact — *before* tools fire. Without it, every later step compounds an uncalibrated assumption.

## Announce at Start
When this skill activates, emit verbatim as the first line of the response:

> *Using mission-brief skill — drafting an operational brief before execution.*

## When to Use
- New task initiated without explicit endstate
- High-level goal handed off; execution detail missing
- About to spawn subagents or run multi-step / multi-file work
- About to run destructive or irreversible commands
- Success criteria implicit, ambiguous, or assumed

## Skip When
- Trivial single-file edit with explicit, unambiguous instructions
- Read-only inspection or question
- Continuation of an already-briefed mission, no scope change

## Scope Check
Before drafting, check whether the request spans **multiple independent subsystems** (e.g. "build a SaaS with auth, billing, and admin"). If yes, **refuse a single brief**. Instead emit a decomposition list, one bullet per subsystem, and tell the user the brief will be issued per subsystem. A single brief over multiple subsystems flattens phasing and destroys main-effort designation.

## Protocol
Fill the five sections in order. Doctrinal sub-machinery per section is mandatory, not decorative. If a sub-bucket is empty, surface it as `GAP: <what's missing>` — never silently omit.

### S — Situation
Mission analysis output in five buckets:
- **Specified tasks** — what the user explicitly stated
- **Implied tasks** — logically required but unstated
- **Essential tasks** — the subset that *must* be done to accomplish the mission
- **Constraints / Restrictions** — must do / must not do
- **Assumptions** — each tagged with an explicit **ABORT TRIGGER** (the condition that, if violated mid-execution, halts work and re-briefs)

### M — Mission
A single sentence in the doctrinal 5W form:

> `[AGENT/UNIT] [TASK] [OBJECT] [TIME] [LOCATION] in order to [PURPOSE]`

The "in order to" clause is required. The mission line is the only sentence the user/commander writes personally.

### E — Execution
Three blocks, in order:

1. **Commander's Intent** — three components:
   - **Expanded Purpose** (the *why behind the why*)
   - **Key Tasks** (activities the force must perform as a whole — non-negotiable even if the COA changes)
   - **End State** (observable conditions when the operation is complete)
2. **Tasks** — numbered, each in task + purpose form (`do X in order to Y`)
3. **Actions On / Branches** — each contingency as a `trigger → who decides → action` triple. Contingency text without trigger and decision authority is decoration.

Also answer the **Commander's Three Questions** explicitly:
- **What can kill us?** (the single highest-blast failure)
- **What can we not control?** (the dependencies outside our authority)
- **What is our abort trigger?** (the condition that ends the mission early)

### A — Admin / Logistics
- **Time / token budget** — applying the **1/3 – 2/3 rule**: no more than ⅓ of available context/time spent on the brief and planning; ≥ ⅔ reserved for execution, verification, and recovery
- **Resources** — packages, tools, MCPs, credentials, branches
- **Dependencies** — what must be true upstream before we can start

### C — Command / Signal
- **Reporting cadence** — phase boundaries, checkpoint triggers
- **Done criteria** — observable, verifiable
- **PACE plan for every critical capability** (not just comms):
  - **Primary** — first-choice path
  - **Alternate** — different bearer, same failure-mode-independent
  - **Contingency** — works but with significant limits
  - **Emergency** — last-resort, assumes degraded operations

Generalize PACE to: **model choice, tool choice, subagent dispatch, user-escalation.** *If it must work, it owes you four independent paths.*

## Output Format
Emit the brief in this exact code-fenced template, filling every slot or marking it `GAP:`:

```
# MISSION BRIEF — <one-line topic>

## S — Situation
- Specified: <…>
- Implied: <…>
- Essential: <…>
- Constraints / Restrictions: <…>
- Assumptions:
  - <assumption> | ABORT TRIGGER: <condition that halts>

## M — Mission
<AGENT> <TASK> <OBJECT> <TIME> <LOCATION> in order to <PURPOSE>.

## E — Execution
**Commander's Intent**
- Expanded Purpose: <…>
- Key Tasks: <…>
- End State: <…>

**Tasks**
1. <task> in order to <purpose>
2. …

**Actions On / Branches**
- <trigger> → <who decides> → <action>
- …

**Commander's Three Questions**
- What can kill us: <…>
- What we can't control: <…>
- Abort trigger: <…>

## A — Admin / Logistics
- Time / token budget (1/3-2/3 rule): <…>
- Resources: <…>
- Dependencies: <…>

## C — Command / Signal
- Reporting cadence: <…>
- Done criteria: <…>
- PACE (<capability>): P=<…> A=<…> C=<…> E=<…>
```

## Self-Review
Before emitting the brief, the skill runs this checklist against its own draft. Any failure = revise, then emit.

- [ ] Mission line ≤ 25 words and contains "in order to"
- [ ] Every Assumption has an ABORT TRIGGER
- [ ] Every Branch has a trigger AND a decision authority
- [ ] PACE filled for at least one critical capability
- [ ] Commander's three questions answered (not "n/a")
- [ ] No `GAP:` left over a slot that the user clearly provided
- [ ] Each Task in `do X in order to Y` form, not bare verbs

## Ack Gate
After emitting the brief, end with this line verbatim:

> *Reply `ACK` to execute, or list edits.*

If the user replies without addressing the brief's contents (e.g., "yes", "go", "ok"), re-prompt **once**: *"Confirm ACK on the brief above, or name the section to revise."* Only then proceed.

## Example
> **User**: "Add dark mode to the dashboard."
>
> ```
> # MISSION BRIEF — Dashboard dark mode
>
> ## S — Situation
> - Specified: add dark mode to the dashboard
> - Implied: theme switcher UI, persistence across sessions, audit of hardcoded colors
> - Essential: a working light/dark toggle persisting per-user
> - Constraints: no design-system rewrite; ship behind no flag
> - Assumptions:
>   - Tailwind config supports `darkMode: 'class'` | ABORT TRIGGER: project uses a non-Tailwind theming engine
>   - ≤ 20 components contain hardcoded colors | ABORT TRIGGER: audit finds > 50
>
> ## M — Mission
> Frontend team adds light/dark theme toggle to the dashboard by EOW in repo `app/`, in order to ship user-requested dark mode without a design-system rewrite.
>
> ## E — Execution
> **Commander's Intent**
> - Expanded Purpose: reduce eye-strain complaints and match competitor UX
> - Key Tasks: toggle UI, per-user persistence, color-token audit
> - End State: every page renders correctly in both themes; preference survives reload
>
> **Tasks**
> 1. Install `next-themes` and wire provider in `_app.tsx` in order to manage theme state
> 2. Extend Tailwind config with dark variants in order to enable utility-class switching
> 3. Audit components; refactor hardcoded colors to tokens in order to remove drift
> 4. Add header toggle in order to expose the feature
>
> **Actions On / Branches**
> - Audit finds > 50 hardcoded components → tech lead → re-scope, propose phased rollout
> - `next-themes` SSR hydration mismatch → me → fall back to client-only theme load + warning
>
> **Commander's Three Questions**
> - What can kill us: SSR hydration mismatch causing a flash of wrong theme on every page
> - What we can't control: existing component library uses inline styles in three places
> - Abort trigger: > 50 hardcoded-color components → re-scope before continuing
>
> ## A — Admin / Logistics
> - Time / token budget (1/3-2/3): ~30 min brief + planning; ~2h execution + verification
> - Resources: `next-themes`, Tailwind, dashboard repo
> - Dependencies: design-token names agreed with design team
>
> ## C — Command / Signal
> - Reporting cadence: checkpoint at end of audit phase
> - Done criteria: PR with screenshots both modes, manual verification on 3 representative pages, persistence verified via reload
> - PACE (theme provider): P=`next-themes` A=manual `useEffect`+`localStorage` C=cookie-based SSR-resolved theme E=hard-coded light, ship toggle disabled
> ```
>
> *Reply `ACK` to execute, or list edits.*

## Anti-Example
A **vacuous brief** — the failure mode this skill exists to prevent:

```
# MISSION BRIEF — Dark mode

S — Dashboard needs dark mode.
M — Add dark mode.
E — Implement it.
A — Standard tools.
C — When done.
```

Failures: no analysis buckets, no "in order to", no commander's intent, no branches, no triggers, no PACE, no done-criterion. SMEAC headings without doctrinal substance is **decorative SMEAC** — the form without the function.

## Common Mistakes
- ❌ Skipping the brief because "the task looks clear" — clarity is felt, then proven wrong
- ❌ Assumptions without abort triggers — assumptions are debts; triggers are when they come due
- ❌ Branches without `trigger → who decides → action` triples — contingency prose without decision authority is decoration
- ❌ PACE applied only to comms — every must-work capability owes four paths
- ❌ Soft "Brief confirmed?" without an explicit ACK token — soft confirmation is no confirmation
- ❌ Workflow leakage in the `description` field — descriptions are triggers, not protocols
- ❌ Single brief over multiple independent subsystems — decompose first; one brief per subsystem
- ❌ Treating self-review as optional — the checklist is the skill, the prose is just scaffolding

## References
- `references/doctrine.md` — full doctrinal lineage, sub-paragraph canon, three-checkpoint verification chain, Tier-1 SOF additions, real-world case studies, AI-agent worked example
- FM 6-0, *Commander and Staff Organization and Operations* — Annex A (OPORD format), Chapter 12 (Rehearsals), Annex H (Signal / PACE)
- MCWP 5-10, *Marine Corps Planning Process*
- NWP 3-05.2, *Naval Special Warfare SEAL Tactics*
- ADP 5-0 / ADP 6-0 — Commander's Intent and Mission Command doctrine
