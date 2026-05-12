# SMEAC — Doctrine Reference

## Origin
SMEAC is the five-paragraph operations order (OPORD) format codified by the United States Marine Corps and adopted across NATO ground forces. It distills any combat order into five sections that, when read aloud, leave no ambiguity about what's happening, who does what, with what, and how everyone stays in sync.

The mnemonic is taught in The Basic School (Quantico, Virginia) to every newly commissioned Marine officer and has been refined since the early 20th century. The same format appears in the U.S. Army's FM 6-0 (*Commander and Staff Organization and Operations*) and in NATO's STANAG 2014.

## The Five Paragraphs

### S — Situation
Friendly forces, enemy forces, terrain, weather, civil considerations. Establishes the operational picture the receiver must hold in their head while reading the rest of the order.

### M — Mission
A single sentence in **task + purpose** form: *who* does *what*, *when*, *where*, *and why*. Read twice in a verbal brief. Everything downstream of the mission line must serve that one sentence.

### E — Execution
Commander's intent (the *why*), concept of operations (the *how*), tasks to subordinate units, and coordinating instructions. Includes decision points, branches, and sequels.

### A — Administration and Logistics
Supply, transport, medical, casualty evacuation, prisoner handling. The boring slide that decides whether a mission survives contact.

### C — Command and Signal
Chain of command, succession, communication plan (primary, alternate, contingency, emergency — "PACE"), reporting cadence, signal codewords.

## Why It Maps to AI-Agent Work
Software tasks fail in the same places combat operations do: unclear endstate, no agreed reporting cadence, dependencies undiscovered until execution. SMEAC forces the operator to surface those gaps *before* committing tools, time, or context window.

For an AI agent, the five paragraphs map cleanly:
- **S** → repo state, framework versions, constraints, conventions
- **M** → the user's commander's intent, in one line
- **E** → numbered plan with decision points
- **A** → packages, tools, time/token budget, dependencies
- **C** → when to checkpoint, what "done" looks like, who confirms it

## Further Reading
- USMC MCWP 5-10, *Marine Corps Planning Process*
- US Army FM 6-0, *Commander and Staff Organization and Operations*
- NATO STANAG 2014, *Formats for Orders and Designation of Timings, Locations and Boundaries*
- *The Defence of Duffer's Drift*, E.D. Swinton (1904) — the original case study of why structured orders matter
