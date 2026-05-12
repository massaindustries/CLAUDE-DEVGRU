# OODA — Doctrine Reference

## Origin
The OODA loop — Observe, Orient, Decide, Act — was developed by Colonel John Boyd, U.S. Air Force, beginning in the late 1950s and refined through his briefings *Patterns of Conflict* and *The Essence of Winning and Losing* into the 1990s.

Boyd's puzzle was Korea. The F-86 Sabre had a markedly worse climb rate, turn radius, and gun than the MiG-15 — yet the U.S. kill ratio over MiG Alley was lopsided in the Sabre's favor. Boyd located the advantage in two engineering details: the Sabre's hydraulic flight controls and its bubble canopy. Together, those let the pilot **observe** more, **orient** faster, and **act** in shorter cycles than the MiG pilot. The MiG was a better aircraft on paper and a worse aircraft in a fight, because its pilot's decision cycle was longer.

Boyd's insight: *speed of decision under uncertainty beats quality of decision under perfect information.* The pilot who closes the loop faster forces the opponent to react to a stale picture.

## The Four Steps, Properly Read

Most popularizations flatten OODA into a generic four-step planning ritual. Boyd's actual emphasis was on **Orient** — the step where the existing mental model meets new observation. Orient is where bias, expertise, and prior commitment all collide. A wrong Orient produces a wrong Decide; the cycle then runs faster in the wrong direction.

The full diagram Boyd sketched has feedback arrows from every step back into Orient. Observe feeds it; Decide tests it; Act updates it. The loop is not a flowchart — it's an epistemic engine.

## Why "Tempo" Matters

Boyd's later work introduced the idea of **operating inside the opponent's OODA loop** — running your decision cycle faster than the enemy can update theirs. Applied to single-operator work, the same principle says: *each iteration must produce new information*. An iteration that doesn't reduce uncertainty isn't a loop; it's thrash.

This is the failure mode OODA exists to prevent. Three rounds of "try something, see what breaks, try something else" without an explicit Orient step is not iteration — it's gambling.

## Why It Maps to AI-Agent Work

LLM agents are pattern-matchers under uncertainty, which sounds Boydian until you watch one loop without the Orient step: it tries a fix, sees a failure, tries another fix, sees another failure — never updating its model of why. Three iterations later the conversation has expanded by 4,000 tokens and the problem hasn't moved.

Explicit OODA forces the agent to:
1. **Observe** raw output rather than its own interpretation of the output.
2. **Orient** by flagging when the new signal contradicts the prior model. (This is the step agents most reliably skip.)
3. **Decide** based on information value, not confidence.
4. **Act** with one move per iteration, capturing the result for the next loop.

The three-iteration cap is a circuit breaker. If OODA hasn't converged in three loops, the problem is outside the skill's effective range — escalate to a wargame, a UAV pass, or the user. Don't grind.

## Further Reading
- John Boyd, *Patterns of Conflict* (briefing, multiple iterations 1977–1995)
- Frans P.B. Osinga, *Science, Strategy and War: The Strategic Theory of John Boyd* (2007) — the most rigorous secondary source
- Robert Coram, *Boyd: The Fighter Pilot Who Changed the Art of War* (2002) — the narrative biography
- Chet Richards, *Certain to Win* (2004) — Boyd's ideas applied outside aviation
