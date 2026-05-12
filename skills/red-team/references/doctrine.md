# Red Team & AAR — Doctrine Reference

## Origin of the Red Team
The "red cell" emerged in U.S. military doctrine during the Cold War, formalized through wargaming at the Naval War College and codified after the 1973 Yom Kippur surprise — an intelligence failure that the post-mortem (the *Phoenix Memo*) attributed in part to the absence of any institutional voice paid to disagree with the consensus.

The 2003 *Iraq Survey Group* and the 2004 *9/11 Commission Report* both reiterated the same recommendation: standing red cells, mandated dissent, structured argument against the plan. The CIA's *Tradecraft Primer* (2009) lists red-teaming as a core analytic technique, alongside Analysis of Competing Hypotheses and Devil's Advocacy.

The principle is robust because the failure mode is robust: groups that build a thing also evaluate it, and the evaluation systematically misses the failure modes the group is blind to. The fix is structural — assign someone (or some role) to argue the opposite case with the same energy that built the plan.

## Origin of the AAR
The **After Action Review** was developed at the U.S. Army's National Training Center at Fort Irwin in the early 1980s as a tool for unit-level learning after force-on-force exercises. The four questions — *what was supposed to happen, what actually happened, why was there a gap, what do we change* — are unchanged from the original NTC format.

Two doctrinal commitments make the AAR work:
1. **No rank** — during the AAR, the senior officer's analysis carries no more weight than the junior soldier's. Rank rejoins the room when the AAR ends.
2. **No blame** — the question is *what system property* caused the gap, not *who failed*. The moment blame enters, the conversation produces defensiveness instead of learning.

David Garvin's 1993 HBR piece *Building a Learning Organization* brought the AAR into civilian management literature, where it has been reliably misapplied ever since — usually by skipping the no-rank and no-blame commitments.

## Why Merge Red Team and AAR
The brief folds these into one skill because they share a single structural function: **someone other than the proposer evaluates the work, under a rule set that protects the evaluation from the proposer's bias.** Pre-merge, that means adversarial critique. Post-incident, it means root-cause analysis. The mental move is the same; only the timing differs.

Keeping them in one skill also reinforces the agent behavior we want: any time the work crosses an evaluation boundary — merge, ship, fail — the same disciplined role-flip kicks in.

## Three Failures, Not Ten
A red-team review that returns a list of twenty issues is doing the proposer a disservice. Review fatigue is real, and the marginal issue past the top three is almost always lower-leverage than the proposer simply reading the diff again. The three-failure cap forces prioritization and produces actionable output. Nit-level concerns belong in a separate inline-comment pass, not in the red-team report.

## Why It Maps to AI-Agent Work
LLM agents have a documented preference for confirmation — the same conversation that built the plan will, if asked to evaluate it, evaluate it favorably. The red-team skill is the structural fix: an explicit role-flip ("I am now arguing against this") that the agent can announce and the user can verify. The verdict line at the end forces a discrete choice; "looks fine to me" doesn't survive the format.

For AAR, the same principle applies in reverse: after a failure, the temptation is to narrate the failure rather than analyze it. The four-question template forces the agent through root cause to a single concrete change — not "we should be more careful next time" but a specific, observable doctrine update.

## Further Reading
- CIA, *A Tradecraft Primer: Structured Analytic Techniques for Improving Intelligence Analysis* (2009)
- U.S. Army TC 25-20, *A Leader's Guide to After-Action Reviews*
- Micah Zenko, *Red Team: How to Succeed by Thinking Like the Enemy* (2015)
- David Garvin, "Building a Learning Organization", *Harvard Business Review*, 1993
- Sidney Dekker, *The Field Guide to Understanding Human Error* (2014) — for the no-blame discipline in incident review
