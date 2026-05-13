---
name: uav
description: Use when the user asks how, where, or what about an unfamiliar codebase ("how does X work", "where is Y defined", "what calls Z", "explore the repo", "find references to", "trace the flow", "before I touch this"); before any code edit in an unfamiliar area; when the next implementation step depends on facts not yet in evidence; when about to spawn an Explore subagent. Emits a read-only reconnaissance report with file:line citations, names what was NOT found, and hands off to the next doctrinal skill.
when_to_use: Trigger before any edit in an unfamiliar area, on open-ended codebase questions, and when a destructive plan rests on unverified assumptions. Skip on local edits with explicit file:line targets, on continuations of an already-completed pass, and on read-and-edit tasks where the file is already in context.
argument-hint: "[question or area of code to recon]"
allowed-tools: Read, Grep, Glob, Bash(rg:*), Bash(fd:*), Bash(find:*), Bash(ls:*), Bash(wc:*), Bash(head:*), Bash(tail:*), Bash(git log:*), Bash(git blame:*), Bash(git diff:*), Bash(git grep:*), Bash(git ls-files:*), Bash(tokei:*), Bash(scc:*), Bash(ast-grep:*)
---
# UAV — Reconnaissance Pass

## Overview
A UAV pass is read-only reconnaissance of a codebase before any edit. It exists to break the agent's strongest habit: answering a question by *changing* something instead of *checking* something. Reconnaissance and engagement are separate skills; UAV only flies in NAIs, never in TAIs.

## Announce at Start
When this skill activates, emit verbatim as the first line of the response:

> *Using uav skill — read-only reconnaissance pass, no edits, no commits, no mutations.*

## When to Use
- User asks how something works, where something lives, or what calls what
- Unfamiliar codebase, framework, or module
- About to modify code in an area the agent hasn't read
- Before proposing an architecture, refactor, or new abstraction
- Tasking arrives with verbs like "explore", "investigate", "trace", "find", "understand"

## Skip When
- File path explicit and the change is local (single-file, single-line, in-context)
- A UAV pass already completed for the same scope this session
- Tasking is to *act on* prior recon (route to `mission-brief` or direct edit)

## Scope Check
If the question spans multiple unrelated subsystems, repos, or eras of code, **refuse a single pass**. Emit a decomposition list — one sub-question per area — and let the user select. A single pass over multiple independent areas flattens findings and prevents proper handoff.

## Protocol
Read-only by contract. The `allowed-tools` frontmatter mechanically enforces this; the protocol enforces it doctrinally. **Look, don't touch.**

### Tasking Analysis (5 buckets)
Before sweeping, fill these. If a bucket is empty, surface it as `GAP:`.

- **Specified questions** — what the user explicitly asked
- **Implied questions** — what they need to know but didn't ask
- **Essential question** — the one that, if unanswered, makes the rest useless
- **Sources to consult** — files, history (git log), tests, docs, external (OSINT)
- **Scope boundaries** — directories, branches, time-windows that are *out of bounds*

Each assumption inside Tasking Analysis carries a **HALT-AND-SURFACE TRIGGER**: a condition that, if violated mid-pass, halts work and re-scopes (e.g., "assume auth lives in `apps/web/auth/`" → HALT IF that path is empty/missing).

### Three Recon Questions
Answer all three before declaring Found:
- **What does the operator actually want to know?** (not what they typed — what they need)
- **What's the cheapest evidence that answers it?** (cite this evidence by `path:line`)
- **What would change the answer?** (the contrarian fact — the third question is the most-skipped)

### Thoroughness Level
Declare at start. Bounds total tool calls.

| Level | Budget | When |
|---|---|---|
| **quick** | ≤ 5 tool calls, single hypothesis | "is feature X present", "where is constant Y" |
| **medium** | ≤ 15 tool calls, broad map + targeted trace | Default. Most questions. |
| **deep** | ≤ 40 tool calls, cross-module + git archeology + tests | Architecture, security audit, refactor planning |

### Time / Token Budget (1/4 – 1/2 – 1/4)
- **¼ Sweep** — broad mapping (top-level layout, manifests, entry points)
- **½ Depth-trace** — follow the specific signal (definitions, callers, dependencies, tests, git history)
- **¼ Report + Handoff** — most agents shortchange the report; that's where the value lands

### Layered Retrieval Order
Per 2025–2026 agentic-search consensus (Anthropic dropped vector DB; agentic grep wins for code):

1. **Structural first** — `git ls-files | head`, `fd -t d -d 2`, `scc` for inventory, manifest files (`package.json`, `pyproject.toml`, `go.mod`)
2. **Keyword / identifier** — `rg -n 'symbol'`, `git grep`, exact-token search
3. **Semantic / structural AST** — `ast-grep` for "function that does X", LSP refs when available
4. **History** — `git log -S 'string'`, `git log --follow`, `git blame -L`
5. **Ask the user** — only when the codebase doesn't contain the answer

### PACE for Recon Tools
*If recon must work, it owes you four independent paths.*

| Layer | Primary | Alternate | Contingency | Emergency |
|---|---|---|---|---|
| Search | `rg` | `ast-grep` / tree-sitter | `git grep` / `git log -S` | Ask user |
| Symbol resolution | LSP / `ctags` | `ast-grep` semantic patterns | regex with context | Ask user / read by hand |
| History | `git log --follow` | `git blame -L` | PR API via `gh` | Ask author directly |
| Cross-repo | monorepo grep | submodule traversal | package-registry metadata | Out-of-range escalation |

### Excerpt Discipline — Signatures, Not Bodies
- **Cite always** — every claim followed by `path:line` or `path:line-line`. Repo-root-relative.
- **Signatures before bodies** — quote function/class/type signatures; reserve excerpts for load-bearing lines.
- **Hard caps**: ≤ 10 lines per excerpt, ≤ 3 excerpts per claim, ≤ 15 findings per report.
- **Negative space**: state what was **NOT** found explicitly — absence is intel.

## Output Format
Emit the report in this exact code-fenced template. Empty slots surface as `GAP:`.

```
# UAV REPORT
**Thoroughness**: quick | medium | deep
**Tasking** (restated): <one-line>
**Would count as an answer**: <falsifiable criterion>

## Map (relevant surface area)
- `path/` — role
- `path/` — role

## Findings (each with citation)
- <claim> — `path/to/file.ext:line` [optional short excerpt if load-bearing]
- <claim> — `path/to/file.ext:line`

## Negative space (asked but NOT found)
- <thing> — not located; queries run: <list>; nearest match: `path:line`

## Pattern-of-life (git history signal, if relevant)
- `path` last touched <date> by <author/PR> — <one-line significance>

## What would change the answer
- <contrarian fact or unread source>

## Tool budget used
- <N> / <budget> tool calls

## Recommendation / Handoff
- [ ] Ready for `mission-brief` (tasking clear, scope bounded, ready to act)
- [ ] Ready for `wargame` (non-trivial risk surface detected)
- [ ] Tasking ambiguous — re-sweep with: <clarification>
- [ ] Out of range — need: <external input>
```

## Self-Review
Before emitting the report, run this checklist. Any failure = revise, then emit.

- [ ] No edits, no commits, no mutating commands run. No external state changed.
- [ ] "Would count as an answer" line satisfied by the findings
- [ ] Every claim has a `path:line` citation
- [ ] Negative space section non-empty (or explicitly "n/a — all questions answered")
- [ ] Excerpt caps respected (≤ 10 lines, ≤ 3 per claim, ≤ 15 findings total)
- [ ] Exactly one Handoff checkbox checked
- [ ] Three Recon Questions all answered, including "what would change the answer"
- [ ] Tool-budget line filled

## Handoff
A UAV pass terminates with exactly one disposition:

- **→ `mission-brief`** — tasking is clear, scope is bounded, ready to act
- **→ `wargame`** — findings reveal non-trivial risk (regression surface, security, distributed state)
- **→ re-sweep** — tasking ambiguous; surface what would need to be specified
- **→ user-escalate** — codebase doesn't contain the answer; need external context, another repo, or docs

The Handoff is a routing instruction, not a question. UAV does not ask permission to look; it declares what it found and what doctrinal capability is now appropriate.

## Example
> **Tasking**: *"Where is the auth token refreshed, and is the refresh logic shared with the mobile client?"*
>
> ```
> # UAV REPORT
> **Thoroughness**: medium
> **Tasking** (restated): Locate token-refresh implementation in web and mobile; determine whether they share code.
> **Would count as an answer**: A file:line for each refresh implementation + a yes/no on shared code.
>
> ## Map
> - `apps/web/src/auth/` — web auth module
> - `apps/mobile/src/auth/` — mobile auth module
> - `packages/auth-core/` — shared primitives
>
> ## Findings
> - Web refresh implementation — `apps/web/src/auth/refresh.ts:42`
> - Mobile refresh implementation — `apps/mobile/src/auth/refresh.ts:31`
> - Shared token decoder — `packages/auth-core/src/token.ts:12`
> - Web and mobile both call `decodeToken()` but implement refresh independently — duplicate retry/backoff logic, subtly different (web: exponential, mobile: linear)
>
> ## Negative space
> - No shared refresh function found. Searched `packages/*/refresh*`, `packages/auth-core/src/refresh*`, `rg "refreshToken" packages/` — no match in shared packages.
>
> ## Pattern-of-life
> - `apps/mobile/src/auth/refresh.ts` last touched 11 days ago (PR #4421, mobile-team) — recent activity, refresh logic may be in flux
> - `apps/web/src/auth/refresh.ts` last touched 8 months ago (PR #3102) — stable
>
> ## What would change the answer
> - A `packages/auth/` directory exists but is excluded by `.gitignore` (vendored from another repo). If the refresh actually lives there, the answer changes.
>
> ## Tool budget used
> - 9 / 15 tool calls
>
> ## Recommendation / Handoff
> - [x] Ready for `mission-brief` — duplicated refresh with drift is worth a planning pass before edits
> ```

## Anti-Example
A **decorative recon** — the failure mode this skill exists to prevent:

```
# UAV REPORT
The codebase uses a factory pattern. Auth is in the auth module. There's a token refresh somewhere in the web app. The mobile app probably has its own. Looks like they could share code.
```

Failures: no thoroughness, no tasking restated, no `path:line` on any claim, no negative space, no pattern-of-life, no handoff, hedged language ("probably", "could", "somewhere"). This is paraphrased opinion masquerading as reconnaissance. A SOF reviewer would discard it.

## Common Mistakes
- ❌ Mid-pass fix-and-keep-going — find a typo, fix it, complete the recon. Recon and engagement are separate skills.
- ❌ Confident claims without `path:line` citations — every finding must be traceable
- ❌ Asserting call relations without grep-verification — "X calls Y" requires an actual matched line
- ❌ Premature architectural diagnosis after reading 3 files — declaring "this is CQRS / DDD / hexagonal" from one directory name
- ❌ Skipping Negative space when nothing's missing — the absence of a finding is itself intel
- ❌ Pasting whole files into the report — excerpt, don't dump
- ❌ Semantic / embedding search when grep would find it — wastes budget, less precise
- ❌ Following every import chain to depth without budget — bound depth at 2 unless asked
- ❌ Skipping pattern-of-life when answer depends on recency — code from 2018 reads differently than yesterday's
- ❌ Re-reading files already in context — wastes budget; reference the prior read
- ❌ Treating "Skip when" as decorative — read-and-edit tasks with explicit targets do not need a UAV pass

## References
- `references/doctrine.md` — full doctrinal lineage: IPB, Collection Plan / ICM, NAI/TAI, F3EAD's Find phase, Pattern-of-Life, ISR taxonomy, recon-pull vs push, SALUTE/SALT format, worked example, PACE-for-Claude-recon
- ATP 2-01.3, *Intelligence Preparation of the Operational Environment* — the IPB four-step process
- ATP 2-01, *Plan Requirements and Assess Collection* — the Information Collection Matrix
- FM 3-98, *Reconnaissance, Security, and Tactical Enabling Tasks* — recon-pull doctrine, five-step recon cycle
- JP 2-0, *Joint Intelligence* — ISR disciplines taxonomy
- Anthropic Skill best-practices — https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices
- Aider repo-map doctrine — https://aider.chat/docs/repomap.html
- "Citation-Grounded Code Comprehension" (arxiv 2512.12117) — the empirical basis for excerpt + `path:line` discipline
