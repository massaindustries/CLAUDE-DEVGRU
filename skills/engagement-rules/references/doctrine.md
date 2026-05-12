# Rules of Engagement — Doctrine Reference

## Origin
Rules of Engagement (ROE) are the directives that define the circumstances, conditions, degree, and manner in which the use of force may be applied. In NATO and U.S. doctrine, ROE translate political and legal limits into language a soldier on the ground can act on in a fraction of a second.

The modern framework descends from the U.S. Joint Chiefs of Staff's Standing Rules of Engagement (SROE), first formalized in 1988 and revised regularly since. NATO publishes its equivalent in MC 362/1.

## Weapons States
Aviation contributes the cleanest state vocabulary, codified for U.S. and NATO fighter pilots:

- **Weapons HOLD** — Do not fire except in self-defense or when ordered by higher authority. The default state when entering uncertain airspace.
- **Weapons TIGHT** — Fire only at targets positively identified as hostile under the current ROE. The working default for most missions.
- **Weapons FREE** — Fire on any target not positively identified as friendly. Reserved for declared engagement zones and unambiguous tactical situations.

The progression matches risk tolerance to confidence. Crucially, **de-escalation is always permitted**; escalation requires authority.

## Commander's Intent vs. Rules
ROE never override commander's intent — they bound it. A pilot under Weapons TIGHT still flies the mission; the rule constrains the trigger, not the wing. The same separation applies to AI agents: the mission tells you what to accomplish; ROE tells you how much you can mutate without checking back.

## Why It Maps to AI-Agent Work
LLM agents operate across a wide blast-radius spectrum within a single session: read a file (zero risk), edit a comment (low), refactor a module (medium), run a migration (high), force-push to main (catastrophic). Without an explicit state, the agent calibrates risk implicitly — and the user calibrates trust implicitly — and the two drift apart silently until something breaks.

A declared state makes the calibration visible. The user can grant FREE for a scratch directory, watch the agent run end-to-end, and trust the agent will drop back to TIGHT the moment work touches anything shared. The declaration is the contract.

## The Escalation Asymmetry
Escalation needs words; de-escalation needs none. This asymmetry is intentional. In combat it prevents inadvertent fires. In agent work it prevents inadvertent damage. An agent should drop to HOLD the instant it encounters something it doesn't understand — production data, an unfamiliar framework, a destructive command without a clear undo. No permission required to be more careful.

## Further Reading
- JCS Standing Rules of Engagement (SROE), CJCSI 3121.01B
- NATO MC 362/1, *NATO Rules of Engagement*
- U.S. Air Force, *Aerospace Doctrine — Counterair Operations*
- *The Accidental Guerrilla*, David Kilcullen — on how rigid ROE survive contact with messy reality
