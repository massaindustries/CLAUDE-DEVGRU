# Wargame — Doctrine Reference

## Origin
Wargaming as a structured planning practice dates to *Kriegsspiel*, developed by Lieutenant Georg Leopold von Reisswitz and his son Georg Heinrich Rudolf in early-19th-century Prussia. The Prussian General Staff adopted it in 1824 as a required tool for officer training, crediting it as one of the institutional advantages behind their victories at Königgrätz (1866) and Sedan (1870).

The modern Western military adopted wargaming after WWII, with the U.S. Naval War College's gaming program — running since 1887 — formalizing the practice for fleet-level planning. The Marine Corps Planning Process (MCPP) mandates a wargame step in every operational plan: red plays the enemy, blue plays the plan, white adjudicates.

## The Pre-Mortem
Gary Klein's *pre-mortem* (2007) brought the concept into management literature. The technique: before execution, assume the plan has failed catastrophically, then work backwards to find why. It exploits a known cognitive asymmetry — people are far better at imagining concrete reasons something *did* fail than abstract reasons something *might* fail.

The military's red-team tradition predates Klein by decades. A red cell exists to argue against the plan with the same energy the planners argued for it. The CIA's *Phoenix Memo* on the 1973 Yom Kippur surprise attack is the canonical case study in what happens when no one is paid to disagree.

## Three Rounds, Not One
A single round of "what could go wrong" produces shallow failures — the ones the planner already considered and dismissed. Three rounds with different lenses (adversary action, hidden assumption, detection/recovery) force progressively non-obvious failure modes to the surface. The third round — detection and rollback — is the most consistently undervalued, because operators imagine the failure but not the *epistemics* of noticing it.

## Why It Maps to AI-Agent Work
Agent failures cluster around the same three classes as combat failures:
1. **Adversary action** — the system fights back: locks, rate limits, idempotency violations, version skew between client and server.
2. **Hidden assumption** — the agent inferred a constraint that doesn't hold: that an API is transactional, that a migration is reversible, that a test suite covers the changed path.
3. **Detection lag** — the agent moved fast, the user only saw the consequence hours later, and rollback became surgery instead of a button-press.

A 60-second wargame round before destructive ops costs almost nothing relative to the cost of finding out on production. Run it.

## Further Reading
- Peter Perla, *The Art of Wargaming* (1990)
- Gary Klein, "Performing a Project Premortem", *Harvard Business Review*, 2007
- Bryce Hoffman, *Red Teaming: How Your Business Can Conquer the Competition by Challenging Everything* (2017)
- Micah Zenko, *Red Team: How to Succeed by Thinking Like the Enemy* (2015)
