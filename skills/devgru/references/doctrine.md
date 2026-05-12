# DEVGRU — Doctrine Reference

## Origin
The U.S. Naval Special Warfare Development Group (DEVGRU), commonly known as SEAL Team Six, was established in 1980 by Commander Richard Marcinko after the Iran hostage-rescue failure at Desert One demonstrated the gap between conventional doctrine and the demands of counter-terrorist direct action.

The unit's organizational signature — small, flat elements with high individual autonomy and short feedback loops — was a deliberate departure from the Navy's standing chain of command. Marcinko's *Rogue Warrior* and subsequent doctrinal critique argued that hierarchical structures imposed latencies a 60-second hostage-rescue could not absorb.

## What "Flat" Actually Means
Flat does not mean leaderless. A DEVGRU element has a designated Team Leader, but the leader's authority is exercised through *Commander's Intent* rather than per-step direction. Every operator can recite the mission in one sentence. Any operator can take initiative consistent with that intent without checking back. The leader's job is integration — composing what the operators report back into a single picture for higher command.

This is the architectural property that matters for AI-agent work: **autonomy distributed by intent, integration centralized by role.** Operators don't need permission for each action; the integrator doesn't try to do the operators' work.

## Sectors of Fire
"Sectors of fire" is a fireteam-level concept: each member is responsible for a specific arc, and the arcs are deliberately non-overlapping. Two rifles covering the same arc waste a rifle; two rifles with a gap between their arcs leave the team blind to that gap. Sector discipline is constantly checked and constantly adjusted as the team moves.

For multi-agent work, this maps directly to **scope assignment.** Spawning three subagents without explicit non-overlapping scopes produces three reports on the same finding, with the gaps unattended. The fix is structural — assign each operator an explicit sector before dispatch, and verify that the union of sectors covers the intent.

## Element Size
DEVGRU elements typically operate at four to six operators. The number isn't arbitrary; it sits at the edge of what one integrator can hold in working memory while the operation runs. Larger elements decompose into multiple elements with their own integrators, each rolling up to higher command. The same scaling rule applies to multi-agent dispatch: beyond ~5 parallel operators, coordination overhead eats the parallelism gain. If the work needs more, decompose into nested elements rather than flattening into one wide fan-out.

## Why It Maps to AI-Agent Work
Agentic systems hit two failure modes that DEVGRU's doctrine directly addresses:

1. **Coordination collapse.** Subagents spawned without disciplined scope produce redundant work and miss seams. The "sectors of fire" rule forces the integrator to think about coverage *before* dispatch, not as a salvage operation afterwards.

2. **Integrator drift.** The main agent, watching subagents work, gets tempted to "help" by doing one of their tasks itself. This is exactly the dual-hatting that DEVGRU's flat structure rules out. The integrator's only job during execution is to hold the picture so they can compose results into single-voice output at the rally point.

The format also forces a discipline that pure parallelism lacks: each operator must report in a defined shape (UAV report, wargame rounds, brief, etc.) so the integrator can compose rather than summarize. Composition preserves citations and reasoning; summarization erases them.

## Further Reading
- Richard Marcinko, *Rogue Warrior* (1992)
- Mark Owen, *No Easy Day* (2012)
- Eric Greitens, *The Heart and the Fist* (2011)
- Stanley McChrystal, *Team of Teams* (2015) — the modern statement of distributed autonomy with central integration
- USSOCOM Pub 3-33, *Joint Special Operations Task Force Operations*
