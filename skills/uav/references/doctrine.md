# UAV / ISR — Doctrine Reference

## Origin
*Unmanned Aerial Vehicle* (UAV) entered military doctrine through the Israeli Air Force's success with the IAI Scout and Mastiff during the 1982 Bekaa Valley operations, where remote reconnaissance broke a previously-dominant Syrian air-defense network without putting pilots over hostile airspace. The U.S. followed with RQ-1 Predator (1995) and RQ-4 Global Hawk (1998), and what began as a sensor became an entire doctrine: **ISR** — Intelligence, Surveillance, Reconnaissance.

The doctrinal separation that matters here is older than UAVs. *Reconnaissance* answers questions; *engagement* alters the battlespace. Mixing the two corrupts both — a recon asset that fires gives away its position; a strike asset that pauses to look becomes a target. Field Manual FM 3-55 (*Information Collection*) codifies the line.

## The Find–Fix–Finish Loop
Modern targeting doctrine (F3EAD: Find, Fix, Finish, Exploit, Analyse) builds on this separation. *Find* and *fix* are surveillance-side activities — answer the questions, locate the target. Only after both are complete does *finish* execute. F3EAD failed when units collapsed the steps: striking what they thought they had found before they had truly fixed it.

## Why It Maps to AI-Agent Work
Agents have one cognitive habit that breaks codebases: they answer a question by *changing* something instead of *checking* something. Asked "where is auth refreshed?", they propose a refactor. Asked "is this safe?", they add a try/catch. The reconnaissance impulse atrophies in favor of action because action is rewarded.

UAV reasserts the separation. A pass is read-only by contract — the agent maps, traces, cites, and *returns* with intel. Whatever the user decides to do with that intel is a separate skill (mission-brief, wargame, then execute). The discipline pays off twice: first, the user gets a clearer picture; second, the agent has a paper trail of file paths and line numbers it can hand to the next step, so execution doesn't re-discover the same facts.

## Excerpt, Don't Dump
ISR products are valuable in inverse proportion to their length. A 3-line excerpt with `path:line` citations is more actionable than a 200-line file paste. The same rule applies in this skill: quote surgically, cite always, and let the operator pull the full file if they need it.

## Further Reading
- U.S. Army FM 3-55, *Information Collection*
- Joint Publication 2-01, *Joint and National Intelligence Support to Military Operations*
- Christopher A. Lawrence, *War by Numbers* — on what "evidence" means in operational analysis
- *Bekaa Valley 1982*, Aharon Levran — the operational debut of UAV-led reconnaissance
