# CLAUDE DEVGRU

> Military doctrine adapted to AI-agent workflows.

Two Claude Code skills that give any agent special-forces discipline. **`ooda`** runs Boyd's **Observe → Orient → Decide → Act** loop as a single disciplined iteration: read-only reconnaissance with `path:line` citations, adversarial review and three-round pre-mortem, an operational brief gated behind an explicit `ACK`, and a status-plus-pivot SITREP after every move. It folds five battle-tested protocols — recon, red-team, wargame, SMEAC, SITREP — into four phases, so the agent checks before it changes instead of winging it. **`skunk-works`** spins up a small, elite swarm of specialist science agents — framing, frontier-scanning, adversarial red-team, capability/economics grounding, empirical testing, and a judge gate — modeled on Lockheed's Advanced Development Programs, to map the state of the art of any STEM field and return decision-grade intelligence.

## Install

```
/plugin install claude-devgru
```

Or clone and point Claude Code at the directory:

```
git clone https://github.com/massaindustries/claude-devgru.git
/plugin install ./claude-devgru
```

Skills are auto-discovered. No configuration required.

## The Skills

| Skill | What it does |
|---|---|
| [`ooda`](skills/ooda/SKILL.md) | One Boyd-loop iteration — read-only recon (Observe), adversarial framing + pre-mortem (Orient), operational brief with ACK gate (Decide), status + pivot SITREP (Act). Emits `PROCEED/HALT`, `APPROVE/BLOCK`, and `ACK` verdicts where they apply. |
| [`skunk-works`](skills/skunk-works/SKILL.md) | Frontier STEM research swarm — a tiered team of specialist science agents (framer, landscape-mapper, frontier-scanner, contrarian, capability/economics, simulator, prototyper, integrator, judge) coordinated by a real Claude Code Workflow over schema-validated shared memory, with a rigor loop, empirical testing, a structured archive, and steering checkpoints. Returns a decision-grade brief on the state of the art and its whitespace. |

### The four phases

- **Observe** — read-only reconnaissance. Restate the tasking, cite every claim with `path:line`, name what was *not* found, declare a tool budget. Look, don't touch.
- **Orient** — the asymmetric phase. Update the model to match the signal, then stress the plan: three-failure adversarial review before merge, or a three-round pre-mortem before a non-trivial plan executes.
- **Decide** — pick the highest-information move. Small and reversible → single action. Multi-file or destructive → a compact SMEAC brief, each assumption tagged with an ABORT TRIGGER, gated behind a hard `ACK`.
- **Act** — execute one move, capture the result, feed it back to Observe. At phase boundaries emit a SITREP; surface every pivot instead of drifting silently.

A three-iteration circuit breaker halts the loop before it thrashes.

## Quick Start

The skills auto-trigger on the situations described in their `description` field. To invoke explicitly:

```
/ooda
/skunk-works
```

Or describe the situation in natural language — "how does auth work here", "wargame this migration", "we're about to ship, review it", "checkpoint" for `ooda`; "what's the current SOTA for X, and where's the whitespace" for `skunk-works` — and the matching skill activates.

## Repo Layout

```
claude-devgru/
├── .claude-plugin/plugin.json        # Plugin manifest
├── skills/
│   ├── ooda/SKILL.md                 # Boyd-loop doctrine, protocol, example
│   └── skunk-works/                  # Frontier research swarm
│       ├── SKILL.md                  #   doctrine + architecture
│       ├── agents/*.md               #   11 specialist subagents
│       ├── workflows/skunk-works.js  #   the executable Workflow script
│       └── archive/                  #   institutional-memory scaffold
├── LICENSE
└── README.md
```

## Contributing

PRs welcome. The skill follows a strict template:

- Frontmatter `description` is pure trigger, third person. **No** workflow summary in the description (that causes Claude to shortcut the protocol); the procedure lives in the body.
- Body is lean and self-contained — one file, readable in a few minutes.
- `Anti-Example` and `Common Mistakes` sections are mandatory — they are the most valuable part of any skill.
- Skill folder names: lowercase letters, numbers, hyphens only. Brand display in copy is UPPERCASE.

Open an issue first for proposals so the doctrine fit can be reviewed before you write the SKILL.md.

## License

MIT — see [`LICENSE`](LICENSE).
