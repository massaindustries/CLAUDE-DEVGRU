# UAV — Doctrine Reference

## Origin
*Unmanned Aerial Vehicle* (UAV) entered military doctrine through the Israeli Air Force's success with the IAI Scout and Mastiff during the 1982 Bekaa Valley operations, where remote reconnaissance broke a previously-dominant Syrian air-defense network without putting pilots over hostile airspace. The U.S. followed with RQ-1 Predator (1995) and RQ-4 Global Hawk (1998). What began as a sensor became an entire doctrine: **ISR — Intelligence, Surveillance, Reconnaissance**.

The doctrinal separation that matters here is older than UAVs. **Reconnaissance answers questions; engagement alters the battlespace.** Mixing the two corrupts both. Field Manual FM 3-55 (*Information Collection*) codifies the line; ATP 2-01 (*Plan Requirements and Assess Collection*) operationalizes it.

## Intelligence Preparation of the Operational Environment (IPB)
**ATP 2-01.3** defines IPB as a continuous, four-step staff process. It is the most directly portable military doctrine for codebase recon.

| IPB step | Doctrinal output | Codebase recon analog |
|---|---|---|
| **1. Define the operational environment** | Limits of AO + area of interest | Bound the question: which repos, services, branches are in scope; what's adjacent (consumers, infra) |
| **2. Describe environmental effects** | Modified Combined Obstacle Overlay (MCOO) | Map the terrain: directory tree, build graph, module dependency graph; "restricted terrain" = generated code, vendored deps, deprecated zones |
| **3. Evaluate the threat** | Doctrinal template of how the threat fights | Characterize the change/risk surface: which modules historically break, which libs have CVEs, which subsystems have implicit coupling |
| **4. Determine threat COAs** | Situation template + event template | Hypothesis generation: "the bug is in auth" vs. "the bug is in cache"; the event template lists observations that would confirm/deny each — these become NAIs |

The point of memorizing the four steps is to know what you're choosing to skip when you do.

## Collection Plan / Information Collection Matrix (ICM)
**ATP 2-01** prescribes the Information Collection Matrix — the discipline that turns "look around" into "answer specific questions with specific sources":

| PIR | Indicator | SIR (specific info req) | NAI (where to look) | Asset / Tool | LTIOV | Report format |
|---|---|---|---|---|---|---|
| Priority Intelligence Requirement | Observable phenomenon | Information that, when collected, partly answers PIR | Named Area of Interest | Sensor / unit | Latest Time Info is Of Value | How the answer comes back |

**Codebase ICM example** for *"does the API enforce auth on /admin?"*:

| PIR | Indicator | SIR | NAI | Tool | LTIOV | Report |
|---|---|---|---|---|---|---|
| Auth on /admin? | Middleware decorator / route guard in the chain | "find references to `requireAdmin` in routes/admin/*" | `routes/admin/`, `middleware/auth.ts` | ripgrep + LSP refs | before drafting fix | one-line citation w/ file:line |

The ICM is what a "UAV REPORT" template's `Tasking` section is operationalizing. Without it, agent recon collapses into associative grep-and-summarize.

## NAI vs. TAI — Named Areas of Interest vs. Targeted Areas of Interest
Per FM 3-90 and ATP 2-01.3:

- **NAI** — a geospatial area, systems node, or link against which information satisfying a specific information requirement *can be collected*. **Watch**, do not engage.
- **TAI** — an engagement area where interdiction by fire, maneuver, or jamming reduces or deprives the enemy of capability. **Act**.

NAIs may be promoted to TAIs after priority targets are identified, but that promotion is a separate, authorized step. The doctrinal separation is the geography of **find** vs. **engage**.

**Codebase analog — the doctrinal name for the read-only ethic:**
- **NAI** = "the auth module is where the question 'is /admin protected?' gets answered" — a region of code you *read* to confirm a hypothesis.
- **TAI** = "`routes/admin/users.ts:42` is where we'd edit once we know" — a region you intend to *modify*.

UAV is **NAI-only**. Promotion to TAI requires `mission-brief` (planning) and `engagement-rules` (autonomy). The skill enforces this through `allowed-tools` frontmatter (read tools only) and through the Handoff requirement.

## F3EAD — The Find Phase
**Find, Fix, Finish, Exploit, Analyze, Disseminate** — articulated by Flynn and McChrystal in Iraq (TF-714, 2003–08). Each phase produces a **briefing artifact** that becomes input to the next.

At the **troop level**, Find is a multi-discipline funnel: SIGINT/HUMINT/GEOINT/OSINT operators generate and nurture leads from broad questions ("which routes does the target take," "which accounts show sudden cashflows"). The artifact Find produces is the **target package** — the dossier that travels through Fix, Finish, and Exploit.

**Codebase analog**: a "target package" for a code change is the set of files, the call graph touching them, the tests that cover them, the people who recently edited them, and the open questions still unresolved. The UAV report **is** the target package. An edit-authorized agent (or human) should be able to act on it without redoing the recon.

## Pattern-of-Life Analysis
**POL** is "the specific set of behaviors and movements associated with a particular entity over a given period of time." Built from movement, communications, associates, frequented locations. Doctrine: *you do not understand a target by snapshot — you understand it by watching it over time.*

**Codebase analog** — a file is not understood from one read; it is understood from its history:

| POL signal | Codebase command |
|---|---|
| Movement over time | `git log --follow path/to/file` |
| Associates (who edits it) | `git log --format='%an' path/to/file \| sort -u` |
| Co-changes (related files) | Adam Tornhill's temporal coupling (`code-maat`); files that change together |
| Recency | `git log --since=30d`; recent edits change the recommendation |
| Authorship density | `git blame -w -C -C`; long-tenured vs. recent contributors |

A function last touched 3 years ago by a since-departed engineer is a *different finding* than one touched yesterday by the current on-call.

## ISR Taxonomy — Disciplines Applied to Code
Per JP 2-0:

| Discipline | Doctrinal definition | Codebase analog |
|---|---|---|
| **SIGINT** | Electronic transmissions intercepted | Log files, traces, metrics, instrumentation, eBPF |
| **HUMINT** | Information gathered from people | `git blame`, PR comments, code review threads, design docs, asking the original author |
| **IMINT** | Imagery (sub-component of GEOINT) | Architecture diagrams, ER diagrams, rendered flame graphs, component-tree screenshots |
| **GEOINT** | Visual/analytical representation of geospatial activity | Directory layout, module dependency graph, service topology, build graph |
| **OSINT** | Publicly available info | README, package registry pages, public docs, upstream issue trackers, Stack Overflow |
| **MASINT** | Measurement and signature | Profiling output, perf counters, fuzzing crash signatures |
| **TECHINT** | Technical data about equipment | Reverse-engineering binaries, schema introspection, dependency manifests |

A UAV pass that uses only one discipline is fragile. The strongest passes triangulate at least three.

## Reconnaissance Pull vs. Reconnaissance Push
Per **FM 3-98, *Reconnaissance, Security, and Tactical Enabling Tasks***:

- **Recon pull** — used when the situation is unclear. Recon launches on initial PIRs *before* COA selection; the commander uses returned info to choose where to commit. **Recon shapes the plan.**
- **Recon push** — used after the commander has committed. Recon confirms a pre-planned operation and refines the COP.

Pull is harder because it requires tolerating ambiguity in the plan and trusting recon's judgment. Conventional units default to push because push fits rigid orders cycles.

**Codebase translation:**
- **Recon-push:** *"I already know the fix, I just want to confirm."* (Often wrong — confirmation bias.)
- **Recon-pull:** *"I don't know what the fix is — read first, decide after."*

Most engineering failure modes (wrong refactor, band-aid in the wrong layer) come from push when the situation demanded pull. **UAV is doctrinally a pull instrument.** The "Tasking ambiguous — re-sweep" handoff disposition exists precisely to honor the pull ethos.

## Fight for Information
FM 3-98 Ch. 5 lists "**fight for information**" as a reconnaissance fundamental. Some information is unobtainable by stealth — it requires **reconnaissance by force**, deliberately provoking a reaction to reveal disposition.

**Codebase analog** — some questions cannot be answered by reading:
- Run the test (does it pass?)
- Run the build (what breaks?)
- Temporarily delete a function and let the type-checker enumerate dependents
- Open a draft PR to see what reviewers flag
- Profile under load to see real bottlenecks

These are the "fight for information" techniques. UAV does not execute them under the read-only contract — but the report may **recommend** them as part of the Handoff to a higher-autonomy skill.

## Five Steps of Reconnaissance — Plan, Prepare, Execute, Report, Recover
Per FM 3-98 / FM 3-21.8. The doctrinal weight on **Report** is the under-appreciated discipline: *a recon mission is not complete until the intelligence is in the commander's hands in the form he asked for.* A perfect recon with a missing report is a failed mission.

**Codebase application:**

| Step | What it is |
|---|---|
| **Plan** | Write the collection plan (Tasking Analysis, NAIs, tools) |
| **Prepare** | Gather tools, set scope, snapshot state |
| **Execute** | Read, search, trace — within budget |
| **Report** | Produce the structured artifact in the consumer's preferred format |
| **Recover** | Leave the workspace clean (no half-edits, no stray scratch); update notes |

UAV treats Report as equal in weight to Execute. Most code-recon failures are reporting failures — the agent learned the answer but never wrote it down in the form the next actor needed.

## SALUTE / SALT Format
**SALUTE** — the standard spot-report skeleton: **S**ize, **A**ctivity, **L**ocation, **U**nit, **T**ime, **E**quipment. SALT is the abbreviated cousin for rapid voice reporting.

**Code-SALUTE** for a finding:

| SALUTE field | Codebase finding |
|---|---|
| **S**ize | Scope / blast radius (lines, files, modules, downstream consumers) |
| **A**ctivity | What the code does / the observed behavior or bug |
| **L**ocation | `path/to/file.ext:lineno` — exact, citable |
| **U**nit | Owning team / module / package boundary |
| **T**ime | Commit / branch / version where observed; runtime timestamp from logs |
| **E**quipment | Tools used to gather (rg, lsp, tests, profiler) — establishes provenance |

This is the doctrinal justification for the citation-with-context discipline the SKILL.md enforces.

## Cognitive Discipline Borrowed from the SE Literature
The military doctrine above is reinforced by software-engineering research on code comprehension:

- **Felienne Hermans, *The Programmer's Brain*** — code reading is bounded by working memory; chunking + one-sentence-per-file summaries reduce cognitive load.
- **Peter Naur, "Programming as Theory Building"** (1985) — the source code is the *artifact*; the *theory* lives in developers' heads. Reconstruct it by reading code + history + tests + discussions, not any one channel alone.
- **Steve Yegge, "Code's Worst Enemy"** — trace one feature end-to-end; **follow data, not control** (Hickey's *Hammock Driven Development* echoes this).
- **Adam Tornhill, *Your Code as a Crime Scene*** — hotspots (change-frequency × complexity), temporal coupling, code biographies — the VCS log is forensic evidence.
- **Michael Feathers, *Working Effectively with Legacy Code*** — *do not change what you do not understand*; identify seams before modifying.
- **Chesterton's Fence** (G.K. Chesterton, *The Thing*, 1929) — don't remove a fence until you know why it was built; document the existing way before proposing the right way.
- **Fresh-eyes advantage** (Sim & Holt, "The Ramp-Up Problem", ICSE 1998; Bilalić et al., "Why good thoughts block better ones", 2008) — newcomers' first-day questions are unrecoverable from long-tenured engineers. **Every AI session is fresh eyes by construction — capitalize on it.**

## Real Failure Modes — What Bad Recon Looks Like
Convergent across the 2025–2026 agent literature and the SE comprehension research:

1. **Over-broad grep** — `rg foo` in a monorepo returning 4,000 hits with no narrowing.
2. **Hallucinated call relations** — "X calls Y" without an actual grep-confirmed line. The arxiv 2512.12117 study measured 14–95% hallucinated-citation rates across 13 models; mechanical line-range verification cuts this to 0%.
3. **Premature architecture** — declaring "this is CQRS / hexagonal / DDD" from one directory name.
4. **README theater** — quoting the README as if it were ground truth (it's aspiration, not record).
5. **Single-cue PID** — identification on one ambiguous signal (file extension, regex match, naming convention).
6. **Symbol conflation** — `User` (model) vs. `User` (DTO) vs. `User` (test fixture).
7. **Mid-pass fix-and-keep-going** — find a typo, fix it, finish the recon. Violates the NAI/TAI separation.
8. **Whole-file dumps** when 30 lines would do — pollutes context, degrades subsequent reasoning ~30% after 5–6 turns.
9. **Skipping tests** — tests are the highest-density specification artifact; ignoring them is malpractice.
10. **Reading without writing** — no externalized notes; working memory loses the model. (Hermans is explicit on this.)

## Worked Example — Full UAV Pass
*Tasking: "Where is the auth token refreshed, and is the refresh logic shared with the mobile client in this Next.js + Express + React Native monorepo?"*

```
# UAV REPORT
**Thoroughness**: medium
**Tasking** (restated): Locate token-refresh implementation in web and mobile; determine whether they share code.
**Would count as an answer**: A file:line for each refresh implementation + a yes/no on shared code.

## Map (relevant surface area)
- `apps/web/src/auth/` — web auth module
- `apps/mobile/src/auth/` — mobile auth module
- `packages/auth-core/` — shared primitives
- `packages/auth-core/src/` — six TS files, all small (<100 LOC)

## Findings
- Web refresh implementation — `apps/web/src/auth/refresh.ts:42` — uses exponential backoff, 5 retries
- Mobile refresh implementation — `apps/mobile/src/auth/refresh.ts:31` — uses linear backoff, 3 retries
- Shared token decoder — `packages/auth-core/src/token.ts:12`
- Both apps import `decodeToken` from `@org/auth-core` but implement `refreshToken` independently — confirmed via `rg "import.*refreshToken" apps/`: no shared import

## Negative space
- No shared refresh function. Searched `packages/*/refresh*`, `packages/auth-core/src/refresh*`, `rg "export.*refreshToken" packages/`. No match in shared packages.
- No design doc for refresh strategy. Searched `docs/`, `**/README*`, `**/AUTH*`. No match.

## Pattern-of-life
- `apps/mobile/src/auth/refresh.ts` last touched 11d ago (PR #4421, mobile-team) — recent
- `apps/web/src/auth/refresh.ts` last touched 8mo ago (PR #3102) — stable
- `packages/auth-core/` last touched 2mo ago (PR #4012, platform-team) — moderate

## What would change the answer
- A `packages/auth/` directory exists but is excluded by `.gitignore` (vendored from another repo). If the refresh actually lives there, the answer changes.

## Tool budget used
- 9 / 15 tool calls

## Recommendation / Handoff
- [x] Ready for `mission-brief` — duplicated refresh with drift (exp vs linear backoff) is worth a planning pass before edits
```

A SOF reviewer would sign this. Every claim is citable, the absence of a shared refresh is explicit, the recency signal is named, the contrarian fact is surfaced, and the handoff is one disposition.

## PACE for Claude Recon — Reference Table
*If recon must work, it owes you four independent paths.*

| Layer | Primary | Alternate | Contingency | Emergency |
|---|---|---|---|---|
| **Search** | `rg` (ripgrep) | `ast-grep` / tree-sitter | `git grep` / `git log -S` | Ask user |
| **Symbol resolution** | LSP / `ctags` | `ast-grep` semantic patterns | regex with context lines | Read by hand |
| **History** | `git log --follow` | `git blame -L` | GitHub PR API (`gh`) | Ask the original author |
| **Cross-repo** | monorepo grep | submodule traversal | package-registry metadata | Out-of-range escalation |
| **Inventory** | `scc` / `tokei` | `cloc` | `git ls-files \| wc -l` | Manual `find` |
| **Authorship** | `git shortlog` | `git blame -w -C -C` | CODEOWNERS file | Ask the on-call |

## Further Reading
- ATP 2-01.3, *Intelligence Preparation of the Operational Environment* — https://home.army.mil/wood/application/files/8915/5751/8365/ATP_2-01.3_Intelligence_Preparation_of_the_Battlefield.pdf
- ATP 2-01, *Plan Requirements and Assess Collection* — https://www.bits.de/NRANEU/others/amd-us-archive/atp2_01(14).pdf
- FM 3-98, *Reconnaissance, Security, and Tactical Enabling Tasks* — https://irp.fas.org/doddir/army/fm3-98.pdf
- FM 3-55, *Information Collection* — https://irp.fas.org/doddir/army/fm3-55.pdf
- JP 2-0, *Joint Intelligence* — https://www.jcs.mil/Portals/36/Documents/Doctrine/pubs/jp2_0.pdf
- Felienne Hermans, *The Programmer's Brain* (Manning, 2021)
- Adam Tornhill, *Your Code as a Crime Scene* (Pragmatic, 2015) and *Software Design X-Rays* (Pragmatic, 2018)
- Peter Naur, "Programming as Theory Building", *Microprocessing & Microprogramming* 15 (1985)
- Michael Feathers, *Working Effectively with Legacy Code* (Prentice Hall, 2004)
- Aharon Levran, *Bekaa Valley 1982* — the operational debut of UAV-led reconnaissance
- McChrystal, *Team of Teams* — F3EAD and the horizontal briefing surface
- Aider repo-map doctrine — https://aider.chat/docs/repomap.html
- "Citation-Grounded Code Comprehension" (arxiv 2512.12117) — https://arxiv.org/abs/2512.12117
- Anthropic Skill best-practices — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Claude Code sub-agents (Explore, Plan, general-purpose) — https://code.claude.com/docs/en/sub-agents
