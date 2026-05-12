---
name: devgru
description: Use this whenever the work calls for more than one agent — parallel subagents, an Explore/Plan/Implement split, a research swarm, an investigator paired with a builder, or any task where one agent dispatches others. Trigger on phrases like "in parallel", "spawn", "swarm", "delegate", "multi-agent", or any plan that exceeds a single operator's context budget. Even a 1% chance the next step is multi-agent means activate.
---
# DEVGRU — Flat-Team Multi-Agent Doctrine

## When to Use
- Plan calls for parallel subagents (Explore × N, research fan-out, parallel review)
- Workload exceeds a single context window's effective budget
- Task naturally splits into independent sub-missions (recon + plan + build + review)
- Multiple competing approaches worth running in parallel and comparing

Skip when: the work is sequential and fits one operator. A flat team of one is just an operator.

## Protocol
DEVGRU operates as a small flat team — no hierarchy, every operator briefed against the same Commander's Intent, results converge to a single integrator. Borrows the structure of a SEAL Team Six element: small, autonomous, lethal, accountable.

1. **Mission Intent** — One sentence the whole team can recite. Owned by the integrator (the main agent).
2. **Element Composition** — Name each operator (subagent), assign role and scope. Three to five operators is the sweet spot; beyond that, coordination cost dominates.
3. **Sectors of Fire** — Explicit non-overlap. Each operator owns a sector; if two operators could legitimately do the same work, the sectors are wrong.
4. **Comms** — Each operator reports back in the same structured format (so the integrator can compose). Define the report shape **before** dispatch.
5. **Rally Point** — Where do results converge, and what is the integrator going to do with them? Define before dispatch.
6. **Dispatch** — Launch operators in parallel (single batch). Do not serialize what can fan out.
7. **Consolidation** — Integrator reads each operator's report, resolves conflicts, produces single-voice output.

The integrator never disappears into one of the operator roles. Holding the picture is the job.

## Output Format
Pre-dispatch:
```
# ELEMENT DISPATCH
**Intent**: <one-sentence mission>
**Operators**:
- <name/role> — Sector: <scope> — Report shape: <format>
- <name/role> — Sector: <scope> — Report shape: <format>
- <name/role> — Sector: <scope> — Report shape: <format>
**Rally Point**: <where reports go, what integrator does with them>
```

Post-consolidation:
```
# ELEMENT REPORT
**Findings** (consolidated):
- <finding> [from: operator-X]
- <finding> [from: operator-Y]
**Conflicts resolved**: <if any, how>
**Recommendation**: <single-voice next action>
```

## Example
> **Intent**: Determine whether migrating from REST to GraphQL is worth a quarter of engineering time.
>
> **Operators**:
> - **Operator-1 (Recon)** — Sector: current REST surface area, request patterns, n+1 hotspots. Report shape: UAV format with endpoint inventory and pain points.
> - **Operator-2 (Cost)** — Sector: GraphQL adoption cost (client/server library, schema authoring, caching, infra). Report shape: bullet list with effort estimates.
> - **Operator-3 (Risk)** — Sector: known GraphQL failure modes at our scale (query complexity, batching, schema versioning). Report shape: wargame three-round output.
>
> **Rally Point**: Integrator merges into a single decision memo with verdict (PROCEED / TRIAL / DROP).
>
> *Dispatch in parallel — single batch.*
>
> *(After reports return...)*
>
> **Findings**:
> - 47 REST endpoints, 6 with severe n+1 patterns [from: Operator-1]
> - GraphQL server adoption ~3 engineer-weeks; client refactor ~6 [from: Operator-2]
> - Query-complexity DoS risk and schema-versioning pain at our org size are real but mitigable [from: Operator-3]
>
> **Recommendation**: TRIAL on one bounded surface (the dashboard's high-fanout queries) before committing to a full migration.

## Gotchas
- ❌ Spawning subagents without explicit non-overlapping sectors — you'll get three reports on the same finding
- ❌ Letting the integrator pick up one of the operator roles — the picture-holder must hold the picture
- ❌ More than five operators per element — coordination overhead exceeds the parallelism gain
- ❌ Dispatching serially when fan-out is possible — DEVGRU's only structural advantage is parallel, do not waste it
- ❌ Vague report shapes — without a defined format per operator, consolidation degrades to summarization

## References
- `references/doctrine.md` — SEAL Team Six / Naval Special Warfare Development Group flat-team model
