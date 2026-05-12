# Checkpoint — Doctrine Reference

## Origin
This skill merges two classical military reports that, in practice, almost always travel together:

**SITREP** — Situation Report. A periodic communication from a subordinate to higher command describing current position, status, activity, and immediate intentions. Standardized in the U.S. Army's FM 6-99 and NATO's STANAG 2014. SITREPs are pushed on a schedule and pulled on demand.

**FRAGO** — Fragmentary Order. A short order issued in flight to modify an existing OPORD without rewriting it. FRAGOs assume the receiver already holds the original brief; they communicate only the delta. Doctrine: *"Issue a FRAGO when the situation has changed enough that the plan must change, but not enough to justify a new OPORD."*

The two are paired in real operations because changes in the situation (a SITREP) almost always demand changes to the plan (a FRAGO). Combining them in a single skill matches operational reality and prevents the agent from emitting status reports that obscure the fact that the plan itself just shifted.

## Why Merge Them
A status report without a plan-delta is a courtesy. A plan-delta without context is confusing. The two are most useful when emitted together: *"here's what's true now, and here's what changes because of it."* In agent work, the temptation is to bury a plan change inside a progress bullet ("also, restructured the migration to be two-phase") — which sounds like progress and is in fact a unilateral re-plan. The Pivot section forces the change above the fold.

## Cadence
SITREP doctrine specifies regular, scheduled reports — daily, hourly, or on phase transitions. For agent work, fixed-clock cadence is the wrong default: agent time isn't wall time. Better triggers:
- **Phase boundaries** in the mission brief (M2 of MISSION BRIEF Execution section completed)
- **Reality divergence** — observation contradicts the brief
- **User pings** — direct request for status
- **Pre-pivot** — any time the next checkpoint will require an ack

## Why It Maps to AI-Agent Work
Long-running agent tasks fail in a specific and recognisable way: the user looks back at the conversation an hour later and discovers the agent has been quietly re-architecting the plan for the last three turns. There was no single misstep — each individual step looked reasonable — but the cumulative drift means the user is now operating on a stale picture of what's happening.

Checkpoints are the corrective. A two-paragraph snapshot at every phase boundary keeps the user's mental model in sync, and the explicit Pivot block forces the agent to declare when the plan has changed instead of letting the change accumulate silently. The cost (a few hundred tokens) is trivial against the alternative (a user discovering, on review, that work has been done they didn't sign off on).

## Further Reading
- U.S. Army FM 6-99, *U.S. Army Report and Message Formats*
- NATO STANAG 2014, *Formats for Orders and Designation of Timings*
- USMC MCRP 3-30.1, *Marine Corps Operations*
- David Marquet, *Turn the Ship Around!* (2012) — civilian analog: "I intend to..." statements as continuous checkpointing
