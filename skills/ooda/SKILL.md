---
name: ooda
description: Use when conditions change faster than the plan absorbs, when a debug loop has gone past two iterations without new information, before shipping/merging/declaring-done, before any non-trivial or irreversible plan executes, on open-ended codebase questions ("how does X work", "where is Y", "trace the flow"), when the user pings for status, when reality has diverged from the brief, or after a failure (AAR). Runs one Boyd-loop iteration — Observe (read-only recon), Orient (adversarial framing + pre-mortem), Decide (operational brief with ACK), Act (status + pivot) — and emits PROCEED/HALT, APPROVE/BLOCK, and ACK verdicts where they apply.
when_to_use: Trigger on uncertainty, plan-vs-reality drift, debug thrash, pre-merge review, pre-execution wargame, a new task without an explicit endstate, phase boundaries, and post-failure AAR. Skip on trivial single-file edits with an explicit unambiguous target, on continuations of an in-flight iteration that hasn't diverged, and on routine work where the original brief still holds.
argument-hint: "[task, question, or phase — e.g. 'observe auth module', 'wargame the migration', 'brief dark mode', 'checkpoint']"
---
# OODA — The Loop

## Overview
OODA is Boyd's decision cycle — Observe, Orient, Decide, Act — run as one disciplined iteration instead of reflexive action. Orient is the asymmetric phase: whoever orients faster to reality wins. This skill folds reconnaissance, adversarial review, pre-mortem, operational briefing, and status reporting into the four phases, so the agent checks before it changes.

## Announce at Start
When this skill activates, emit verbatim as the first line of the response:

> *Using ooda skill — running the loop: Observe → Orient → Decide → Act.*

## When to Use
- Conditions are changing faster than the plan can absorb; reality diverged from the brief
- A debug loop has gone past two iterations with no new information
- About to ship, merge, or declare a task done
- Before any non-trivial or irreversible plan executes
- Open-ended codebase questions ("how does X work", "where is Y defined", "trace the flow")
- A new task with no explicit endstate; the user pings for status; after a failure (AAR)

## Skip When
- Trivial single-file edit with an explicit, unambiguous target
- Continuation of an in-flight iteration that has not diverged
- Routine work where the original brief is still accurate

## The Four Phases
| Phase | Question it answers | Absorbed discipline |
|---|---|---|
| **Observe** | What is actually true? | read-only recon, `path:line` |
| **Orient** | What could break this? | adversarial framing + pre-mortem |
| **Decide** | What is the one best move? | operational brief + ACK |
| **Act** | What happened, and did it drift? | execute + status/pivot |

**Orient is mandatory whenever any phase runs** — it is where bias breaks. Skipping it is the failure this skill exists to prevent.

## Phase 1 — Observe (read-only)
No edits, no commits, no mutations. Look, don't touch.
- **Restate the tasking** in one line, then state what *would count as an answer* (a falsifiable criterion).
- **Three recon questions**: What does the operator actually need (not what they typed)? What is the cheapest evidence? What would change the answer?
- **Cite everything** — every claim is followed by `path:line`. Signatures before bodies; ≤ 10 lines per excerpt.
- **Negative space** — state what you searched for and did *not* find. Absence is intel.
- **Budget**: quick (≤ 5 tool calls) / medium (≤ 15) / deep (≤ 40). Declare which.

## Phase 2 — Orient
The asymmetric phase. First update the model to match the signal — **when evidence contradicts your prior, the prior is wrong.** Then stress the plan with whichever mode fits:

**Adversarial review** (before declaring done / merging) — find the **three** most damaging plausible failures, not twenty:
1. Functional break (untested input)
2. Operational break (load, concurrency, partial state, retries)
3. Architectural break (coupling, leaked invariant)

→ Verdict: `APPROVE` / `APPROVE WITH FIX` / `BLOCK`

**Pre-mortem** (before a non-trivial plan executes) — three rounds:
- **R1** — Worst plausible failure at the highest-blast step → mitigation, or `NONE` = halt
- **R2** — The hidden unverified assumption (locking, retry semantics, version skew) → how to verify it first
- **R3** — Detection & rollback: how you would learn it broke, and how fast you could undo it

→ Verdict: `PROCEED` / `PROCEED WITH GUARDRAILS` / `HALT`

A fatal flaw with no mitigation halts the loop and surfaces to the user.

## Phase 3 — Decide
Choose the **highest-information-value** action, not the highest-confidence one. Two classes:

**Single-action** (small, reversible): name the one move and the question it answers, then proceed.

**Mission-brief** (multi-file, destructive, or a new workstream): emit a compact SMEAC —
- **S — Situation**: specified / implied / essential tasks; constraints; assumptions, *each tagged with an ABORT TRIGGER*
- **M — Mission**: one sentence — `<AGENT> <TASK> <OBJECT> <TIME> <LOCATION> in order to <PURPOSE>` (≤ 25 words; "in order to" is required)
- **E — Execution**: intent (purpose / key tasks / end state); branches as `trigger → who decides → action`; the three questions — *What can kill us? What can't we control? What's our abort trigger?*
- **A — Admin**: time/token budget (≤ ⅓ planning, ≥ ⅔ execution); dependencies
- **C — Command/Signal**: done criteria; PACE for each must-work capability (Primary / Alternate / Contingency / Emergency)

Close with: *Reply `ACK` to execute, or list edits.* A soft "yes / ok / go for it" is **not** an ACK.

## Phase 4 — Act
Execute **one** action, capture the result, feed it back to Observe. At a phase boundary or when reality diverged, emit a SITREP:
- **Position**: phase N of M — on track / adjusting / blocked
- **Progress**: bullets of what's done since the last checkpoint
- **Posture**: what's running, staged, or blocked, in one line
- **Pivot** (only if the plan changed): what changed → new plan — *Pivot acknowledged? Or hold for direction?*
- **Next**: the single next action

No Pivot → fire and continue. Pivot present → wait for the ack.

## Loop Control
- One Observe→Orient→Decide→Act is **one iteration**. Count them.
- **Three iterations** on the same unresolved problem without convergence → halt and surface. Do not start a fourth.
- The counter resets when a new mission brief is ACK'd.
- **Phase-skip**: phases skip downward, never upward; Orient never skips. Permitted patterns: Observe-only (pure recon), Orient→Decide→Act (plan already exists), Orient→Act (trivial known edit).
- Exit when the problem is solved or the hypothesis confirmed.

## Output Format
Emit one block per iteration. A skipped phase collapses to a single line (e.g. `## Decide: (skipped — pure recon)`).

```
# OODA #<n>
**Mode**: O-only | O→A | O→D→A | full O→O→D→A

## Observe
Tasking: <one-line> | Would count as an answer: <criterion>
- <finding> — `path:line`
Negative space: <searched but NOT found, or n/a>
Budget: <N>/<cap> tool calls

## Orient
Model update: <signal vs prior; flag if contradicted>
Pre-mortem (if engaged): R1 <failure→mitigation> | R2 <assumption→check> | R3 <detect/rollback>
  Verdict: PROCEED | PROCEED WITH GUARDRAILS | HALT
Red-team (if engaged): 1.<fn> 2.<ops> 3.<arch>
  Verdict: APPROVE | APPROVE WITH FIX | BLOCK

## Decide
Class: single-action | mission-brief
<one move + the question it answers>   —or—   <SMEAC block>
[if brief] Reply `ACK` to execute, or list edits.

## Act
Action: <one move> | Result: <outcome>
SITREP: Position / Progress / Posture / Pivot? / Next

---
Loop status: continuing | converged → exit | halted at iteration cap
```

## Self-Review
Before emitting, confirm:
- [ ] Observe ran no mutating commands; every claim carries `path:line`
- [ ] Orient happened — the model was checked against the signal, not skipped
- [ ] A verdict token was emitted wherever a pre-mortem or pre-merge review applied
- [ ] Multi-file or destructive work got a brief, not a single-action
- [ ] Each assumption in a brief has an ABORT TRIGGER
- [ ] The ACK gate is a hard token; a soft "yes" was not accepted as one
- [ ] Iteration count tracked; not starting a 4th loop on the same problem

## Anti-Example
A **decorative loop** — the failure this skill prevents:

```
# OODA
Looked at the code, seems fine. Going to refactor the auth module now.
```

Failures: no Observe citations, no Orient (no failure modes, no verdict), no Decide brief for a multi-file change, no abort trigger, no SITREP. This is reflexive action wearing OODA's label.

## Common Mistakes
- ❌ Skipping Orient — acting on the first read. This is the #1 agent failure mode.
- ❌ Observe that paraphrases instead of citing `path:line`
- ❌ Twenty findings instead of the three most damaging (review fatigue)
- ❌ A pre-mortem with no rollback plan in R3
- ❌ Full SMEAC for a one-line edit, or a single-action for a destructive migration
- ❌ Treating a soft "go for it" as an ACK
- ❌ Looping past three iterations hoping the next one converges
- ❌ Silent pivot — re-architecting the plan without surfacing it in a SITREP

## References
- Boyd, *Patterns of Conflict* — the original OODA loop and the primacy of Orient
- FM 6-0, *Commander and Staff Organization and Operations* — SMEAC, FRAGO, SITREP
- ATP 2-01.3, *Intelligence Preparation of the Battlefield* — the Observe / recon discipline
- Klein, *Sources of Power* (pre-mortem); U.S. Army NTC After-Action Review doctrine (adversarial review)
