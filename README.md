# CLAUDE DEVGRU

> Military doctrine adapted to AI-agent workflows.

Eight Claude Code skills that give any agent special-forces operational discipline: structured mission briefs, decision loops under uncertainty, autonomy levels, status checkpoints, adversarial review, and multi-agent coordination. Each skill takes a battle-tested military protocol — SMEAC, OODA, ROE, SITREP, AAR — and translates it into a tight, triggerable doctrine for coding work. Drop in, install once, and your agent stops winging it.

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

## Skill Catalog

| Skill | Cluster | What it does |
|---|---|---|
| [`mission-brief`](skills/mission-brief/SKILL.md) | Planning | Forces every new task through the five-paragraph SMEAC brief before execution |
| [`wargame`](skills/wargame/SKILL.md) | Planning | Three-round pre-mortem against destructive or irreversible plans |
| [`uav`](skills/uav/SKILL.md) | Planning | Read-only reconnaissance pass of an unfamiliar codebase |
| [`ooda`](skills/ooda/SKILL.md) | Execution | Boyd's Observe–Orient–Decide–Act loop for high-uncertainty debug and incident work |
| [`engagement-rules`](skills/engagement-rules/SKILL.md) | Execution | Autonomy levels (HOLD / TIGHT / FREE) declared and re-declared on transitions |
| [`checkpoint`](skills/checkpoint/SKILL.md) | Comms | SITREP + FRAGO in one — status update plus mid-mission plan pivot |
| [`red-team`](skills/red-team/SKILL.md) | Review | Adversarial pre-merge critique and after-action review in one skill |
| [`devgru`](skills/devgru/SKILL.md) | Coordination | Flat-team doctrine for multi-agent dispatch — sectors of fire, no hierarchy |

## Quick Start

Each skill auto-triggers on the situations described in its `description` field. To invoke explicitly:

```
/mission-brief
/wargame
/red-team
```

Or simply describe the situation in natural language — "we're about to ship, let's red-team this" — and the matching skill activates.

## Repo Layout

```
claude-devgru/
├── .claude-plugin/plugin.json     # Plugin manifest
├── skills/<skill-name>/
│   ├── SKILL.md                   # The doctrine, the protocol, the example
│   └── references/doctrine.md     # Military origin and deeper reading
├── LICENSE
└── README.md
```

## Contributing

PRs welcome. New skills should follow the existing template exactly:

- Frontmatter `description` is pure trigger, third person, pushy. **No** workflow summary in the description (that causes Claude to shortcut the protocol).
- SKILL.md body is concise; push lore into `references/doctrine.md`.
- Exactly **one** worked Example per skill. `Gotchas` section is mandatory — it's the most valuable part of any skill.
- Skill folder names: lowercase letters, numbers, hyphens only. Brand display in copy is UPPERCASE.

Open an issue first for new skill proposals so the doctrine fit can be reviewed before you write the SKILL.md.

## License

MIT — see [`LICENSE`](LICENSE).
