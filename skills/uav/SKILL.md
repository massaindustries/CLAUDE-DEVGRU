---
name: uav
description: Use this when the user asks an open-ended question about a codebase — "how does X work", "where is Y defined", "what's the architecture", "find all callers of Z", "explore the repo" — or when the next implementation step depends on facts the agent does not yet have. Trigger before writing code in any unfamiliar area. Read-only by definition. Even a 1% chance the agent is about to guess at structure means activate.
---
# UAV — Reconnaissance Pass

## When to Use
- User asks how something works, where something lives, or what calls what
- Unfamiliar codebase, framework, or module
- About to modify code in an area the agent hasn't read
- Before proposing an architecture, refactor, or new abstraction

Skip when: the file path is explicit and the change is local, or a UAV pass was already completed for the same area in this session.

## Protocol
Strictly read-only. No edits, no commits, no side effects. Cover the airspace, return with intel.

1. **Tasking** — Restate the question in one line. What is the operator trying to know?
2. **Sweep** — Map the surface area: top-level structure, entry points, package boundaries. Use `find`, `ls`, fast grep — broad first, then narrow.
3. **Track** — Follow the specific signal: definitions, callers, dependencies, tests. Note file paths with line numbers.
4. **Imagery** — Capture short, surgical excerpts (≤10 lines each). Quote, don't paraphrase, when precision matters.
5. **Debrief** — Return findings as a structured report. Name what was NOT found explicitly.

## Output Format
```
# UAV REPORT
**Tasking**: <one-line question>

**Map** (top-level relevant structure):
- path/to/dir/ — role
- path/to/dir/ — role

**Findings**:
- <claim> — `path/to/file.ext:line`
- <claim> — `path/to/file.ext:line`

**Gaps** (asked but not found):
- <thing> — not located; nearest match: `path:line`

**Recommendation**: <what to do with the intel, or "ready for tasking">
```

No edits. No commits. If a finding suggests a fix, surface it in the recommendation — do not act on it.

## Example
> **Tasking**: "Where is the auth token refreshed, and is the refresh logic shared with mobile?"
>
> **Map**:
> - `apps/web/src/auth/` — web auth module
> - `apps/mobile/src/auth/` — mobile auth module
> - `packages/auth-core/` — shared primitives
>
> **Findings**:
> - Web refresh implementation — `apps/web/src/auth/refresh.ts:42`
> - Mobile refresh implementation — `apps/mobile/src/auth/refresh.ts:31`
> - Shared token decoder — `packages/auth-core/src/token.ts:12`
> - Web and mobile both call `decodeToken()` but implement refresh independently — duplicated retry/backoff logic.
>
> **Gaps**:
> - No shared refresh function found. Searched `packages/*/refresh*`, no match.
>
> **Recommendation**: Refresh logic is duplicated between platforms with subtly different retry strategies. Worth lifting into `auth-core`. Ready for tasking.

## Gotchas
- ❌ Pasting whole files into the report — excerpt, don't dump
- ❌ Skipping the **Gaps** section when nothing's missing — the absence of a finding is itself intel
- ❌ Acting on findings during the pass — UAVs don't drop ordnance; reconnaissance and engagement are separate skills
- ❌ Confident claims without `path:line` citations — every finding must be traceable

## References
- `references/doctrine.md` — UAV/ISR doctrine, the recon-vs-engagement separation
