export const meta = {
  name: "skunk-works",
  description:
    "Frontier STEM research swarm: framing, recon, adversarial stress, empirical test, integration, forecast, and a judge gate. Returns a structured-memory object the orchestrator persists and renders.",
  phases: [
    { title: "frame", detail: "lock the question; ingest prior archive" },
    { title: "recon", detail: "landscape map + frontier scan (rigor loop on deep)" },
    { title: "stress", detail: "contrarian red-team + capability/economics grounding" },
    { title: "test", detail: "simulator + prototyper validate load-bearing claims (deep)" },
    { title: "integrate", detail: "reconcile every node into one direction (deep)" },
    { title: "synthesize", detail: "scenarios, asymmetric opportunities, narrative risks" },
    { title: "gate", detail: "judge sign-off; rebalance confidence (deep)" },
  ],
};

// ---------------------------------------------------------------------------
// args: {
//   question: string,                  // the research question (required)
//   tier?: "simple"|"standard"|"deep", // defaults to "deep"
//   prior?: { findings?: [], dead_ends?: [] }, // archive slice the orchestrator loaded
//   segment?: "recon"|"full",          // "recon" stops after the post_recon liaison report
//   resume?: object,                   // a prior run's mem, to continue an attended run
//   directive?: { type?: string, steer?: string }, // founder steer injected after a checkpoint
// }
// Shared memory is THIS JavaScript object. Agents are stateless: each receives the relevant
// slice of `mem` serialized into its prompt. The runtime injects no filesystem, no Date.now,
// and no Math.random — archive I/O, timestamps, and human checkpoints live in the orchestrator.
// ---------------------------------------------------------------------------

// Normalize args: some harnesses deliver the global `args` as a JSON STRING, not a parsed
// object. Accept either, so `IN.question` is always real.
const IN = (() => {
  try {
    return typeof args === "string" ? JSON.parse(args) : args ?? {};
  } catch {
    return {};
  }
})();

// Fail-fast input guard: never let the swarm research a missing/"undefined" question.
if (typeof IN.question !== "string" || IN.question.trim() === "") {
  throw new Error(
    `skunk-works: a non-empty args.question is required — got ${JSON.stringify(IN.question)}. ` +
      `Invoke the Workflow tool with args = { question, tier?, prior? }.`
  );
}
const VALID_TIERS = ["simple", "standard", "deep"];
const tier = VALID_TIERS.includes(IN.tier) ? IN.tier : "deep";
const segment = IN.segment ?? "full";
const TAU = 0.15; // saturation threshold: stop recon when marginal verified yield <= TAU
const MAX_ITERS = 3; // hard ceiling on rigor-loop passes (shoestring rule)
const FLOOR = 60_000; // stop iterating if fewer than this many budget tokens remain
const J = (o) => JSON.stringify(o ?? null);
const mem = IN.resume ?? {};
mem.meta = { complexity_tier: tier, version: "2.0" };

// --- node schemas (Part III shapes) handed to agent() for tool-layer validation ----------
const FRAME_SCHEMA = {
  type: "object",
  required: ["reframed_question", "scope_boundaries", "success_metrics", "sub_questions", "confidence"],
  properties: {
    original_query: { type: "string" },
    reframed_question: { type: "string" },
    scope_boundaries: { type: "array", items: { type: "string" } },
    success_metrics: { type: "array", items: { type: "string" } },
    sub_questions: { type: "array", items: { type: "string" } },
    mission_fit: { type: ["string", "null"] },
    archive_consulted: { type: "array", items: { type: "string" } },
    complexity_tier: { type: "string", enum: ["simple", "standard", "deep"] },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
  },
};
const LANDSCAPE_SCHEMA = {
  type: "object",
  required: ["taxonomy", "dominant_paradigms", "gaps"],
  properties: {
    taxonomy: {
      type: "array",
      items: {
        type: "object",
        properties: { domain: { type: "string" }, subdomains: { type: "array", items: { type: "string" } } },
      },
    },
    dominant_paradigms: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          key_papers: { type: "array", items: { type: "string" } },
          maturity: { type: "string", enum: ["emerging", "established", "saturated"] },
        },
      },
    },
    gaps: { type: "array", items: { type: "string" } },
  },
};
const FRONTIER_SCHEMA = {
  type: "object",
  required: ["frontier_signals"],
  properties: {
    frontier_signals: {
      type: "array",
      minItems: 5,
      maxItems: 15,
      items: {
        type: "object",
        required: ["id", "type", "source", "title", "one_liner", "relevance_score", "peer_reviewed", "code_available", "claims"],
        properties: {
          id: { type: "string" },
          type: { type: "string", enum: ["paper", "repo", "preprint", "benchmark", "lab", "dataset"] },
          source: { type: "string" },
          title: { type: "string" },
          date: { type: ["string", "null"] },
          authors: { type: "array", items: { type: "string" } },
          one_liner: { type: "string" },
          relevance_score: { type: "integer", minimum: 1, maximum: 10 },
          code_available: { type: "boolean" },
          reproduced: { type: ["boolean", "null"] },
          peer_reviewed: { type: "boolean" },
          claims: { type: "array", items: { type: "string" } },
        },
      },
    },
  },
};
const CONTRARIAN_SCHEMA = {
  type: "object",
  required: ["contrarian_findings"],
  properties: {
    contrarian_findings: {
      type: "array",
      items: {
        type: "object",
        required: ["target_signal", "critique", "severity"],
        properties: {
          target_signal: { type: "string" },
          critique: { type: "string" },
          evidence: { type: "array", items: { type: "string" } },
          severity: { type: "string", enum: ["fatal", "limitation", "caveat"] },
        },
      },
    },
  },
};
const CAPABILITY_SCHEMA = {
  type: "object",
  required: ["methods"],
  properties: {
    methods: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "feasibility"],
        properties: {
          name: { type: "string" },
          performance: { type: "object" },
          cost_train: { type: "string" },
          cost_infer: { type: "string" },
          infra_required: { type: "string" },
          scalability: { type: "string", enum: ["high", "medium", "low"] },
          maturity: { type: "string", enum: ["experimental", "production"] },
          feasibility: { type: "string", enum: ["yes", "no", "partial"] },
        },
      },
    },
  },
};
const EMPIRICAL_SCHEMA = {
  type: "object",
  required: ["tested_claims", "untested_claims"],
  properties: {
    tested_claims: {
      type: "array",
      items: {
        type: "object",
        required: ["claim", "method", "result"],
        properties: {
          claim: { type: "string" },
          target_signal: { type: "string" },
          method: { type: "string", enum: ["in_silico_model", "benchmark_rerun", "micro_reproduction", "numeric_estimate"] },
          result: { type: "string", enum: ["confirmed", "partially_confirmed", "refuted", "inconclusive"] },
          evidence: { type: "string" },
          cost: { type: "string" },
          notes: { type: "string" },
        },
      },
    },
    untested_claims: {
      type: "array",
      items: {
        type: "object",
        properties: { claim: { type: "string" }, reason: { type: "string" } },
      },
    },
  },
};
const INTEGRATION_SCHEMA = {
  type: "object",
  required: ["reconciled_design", "open_conflicts"],
  properties: {
    reconciled_design: { type: "string" },
    conflicts_resolved: {
      type: "array",
      items: {
        type: "object",
        properties: { between: { type: "array", items: { type: "string" } }, resolution: { type: "string" } },
      },
    },
    open_conflicts: { type: "array", items: { type: "string" } },
    integration_risks: { type: "array", items: { type: "string" } },
  },
};
const FORECAST_SCHEMA = {
  type: "object",
  required: ["scenarios", "opportunities", "narrative_risks"],
  properties: {
    scenarios: {
      type: "array",
      items: {
        type: "object",
        required: ["horizon", "probability", "description"],
        properties: {
          horizon: { type: "string", enum: ["6m", "12m", "24m"] },
          probability: { type: "number", minimum: 0, maximum: 1 },
          description: { type: "string" },
          catalysts: { type: "array", items: { type: "string" } },
          blockers: { type: "array", items: { type: "string" } },
        },
      },
    },
    opportunities: {
      type: "array",
      items: {
        type: "object",
        properties: {
          area: { type: "string" },
          impact: { type: "string", enum: ["high", "medium"] },
          effort: { type: "string", enum: ["low", "medium", "high"] },
        },
      },
    },
    narrative_risks: { type: "array", items: { type: "string" } },
  },
};
const INSPECTOR_SCHEMA = {
  type: "object",
  required: ["rigor_score", "issues"],
  properties: {
    rigor_score: { type: "integer", minimum: 1, maximum: 10 },
    issues: { type: "array", items: { type: "string" } },
    rerun: {
      type: "array",
      items: {
        type: "object",
        properties: { agent: { type: "string" }, reason: { type: "string" } },
      },
    },
  },
};
const JUDGE_SCHEMA = {
  type: "object",
  required: ["coherence_score", "final_verdict"],
  properties: {
    coherence_score: { type: "integer", minimum: 1, maximum: 10 },
    hallucination_flags: { type: "array", items: { type: "string" } },
    confidence_rebalance: {
      type: "array",
      items: {
        type: "object",
        properties: { claim: { type: "string" }, new_confidence: { type: "string", enum: ["high", "medium", "low"] } },
      },
    },
    rerun_instructions: {
      type: "array",
      items: {
        type: "object",
        properties: { agent: { type: "string" }, reason: { type: "string" } },
      },
    },
    dead_ends: {
      type: "array",
      items: {
        type: "object",
        properties: { idea: { type: "string" }, killed_by: { type: "string" }, reason: { type: "string" } },
      },
    },
    final_verdict: { type: "string", enum: ["approved", "needs_revision", "rejected"] },
  },
};

// --- deterministic helpers (no agents) ----------------------------------------------------
function gates(signals) {
  const f = [];
  if (!Array.isArray(signals) || signals.length < 5) f.push("fewer than 5 frontier signals");
  for (const s of signals ?? []) {
    if (!s.source) f.push(`${s.id ?? "?"}: missing source URL`);
    if (s.peer_reviewed == null) f.push(`${s.id ?? "?"}: peer-review status not set`);
    if (s.code_available == null) f.push(`${s.id ?? "?"}: code availability not set`);
  }
  return f;
}
function marginalYield(prevSignals, nextSignals) {
  const seen = new Set((prevSignals ?? []).map((s) => s.source));
  const fresh = (nextSignals ?? []).filter((s) => !seen.has(s.source) && s.reproduced !== false);
  return fresh.length / Math.max(1, (nextSignals ?? []).length);
}
function mergeEmpirical(parts) {
  const tested = [], untested = [];
  for (const p of parts.filter(Boolean)) {
    tested.push(...(p.tested_claims ?? []));
    untested.push(...(p.untested_claims ?? []));
  }
  return { tested_claims: tested, untested_claims: untested };
}
function buildLiaison(checkpoint) {
  const sigs = mem.frontier_signals ?? [];
  const fatal = (mem.contrarian_findings ?? []).filter((c) => c.severity === "fatal").length;
  const refuted = (mem.empirical_test?.tested_claims ?? []).filter((t) => t.result === "refuted").length;
  const top = sigs
    .slice()
    .sort((a, b) => (b.relevance_score ?? 0) - (a.relevance_score ?? 0))
    .slice(0, 3)
    .map((s) => s.title);
  return {
    checkpoint,
    digest: `${sigs.length} signals; ${fatal} fatal critiques; ${refuted} refuted claims. Top: ${top.join(" | ") || "n/a"}.`,
    key_findings: top,
    open_questions_for_founder: mem.problem_frame?.sub_questions ?? [],
    founder_directive: IN.directive?.type ?? null,
  };
}

// =========================================================================================
// Phase 1 — FRAME
// =========================================================================================
if (!mem.problem_frame) {
  phase("frame");
  mem.problem_frame = await agent(
    `You are framing a Skunk Works research request.\n` +
      `Original question: ${IN.question}\n` +
      `Prior verified findings on this topic: ${J(IN.prior?.findings)}\n` +
      `Known dead-ends (do not re-frame around these): ${J(IN.prior?.dead_ends)}\n` +
      `Founder steer (may be empty): ${IN.directive?.steer ?? "(none)"}`,
    { agentType: "problem-framer", schema: FRAME_SCHEMA, phase: "frame" }
  );
  mem.problem_frame.archive_consulted = (IN.prior?.findings ?? []).map((f) => f.run_id).filter(Boolean);
}

// =========================================================================================
// Phases 2-3 — RECON + STRESS  (deep wraps recon in the Rigor Loop)
// =========================================================================================
async function runRecon(prev) {
  phase("recon");
  const results = await parallel([
    tier === "simple"
      ? () => Promise.resolve(null)
      : () =>
          agent(
            `Map the structural landscape of this domain. Do not summarize papers.\n` +
              `Frame: ${J(mem.problem_frame)}\nPrior recon pass (for delta): ${J(prev?.landscape)}`,
            { agentType: "landscape-mapper", schema: LANDSCAPE_SCHEMA, phase: "recon" }
          ),
    () =>
      agent(
        `Scan the frontier for what is happening RIGHT NOW. Pick field-appropriate sources first.\n` +
          `Frame: ${J(mem.problem_frame)}\n` +
          `Prior recon pass (surface only what it missed): ${J(prev?.frontier?.frontier_signals)}\n` +
          `Dead-ends already proven (skip these paths): ${J(IN.prior?.dead_ends)}\n` +
          `Founder steer (may be empty): ${IN.directive?.steer ?? "(none)"}`,
        { agentType: "frontier-scanner", schema: FRONTIER_SCHEMA, phase: "recon" }
      ),
  ]);
  return { landscape: results[0], frontier: results[1] };
}

async function runStress(recon) {
  if (tier === "simple") return null;
  phase("stress");
  const results = await parallel([
    () =>
      agent(
        `Red-team these findings. Attack the strongest version of each claim; evidence before opinion.\n${J(recon)}`,
        { agentType: "contrarian-analyst", schema: CONTRARIAN_SCHEMA, phase: "stress" }
      ),
    () =>
      agent(
        `Ground these findings in engineering and economic reality (cost, infra, feasibility).\n${J(recon)}`,
        { agentType: "capability-economics", schema: CAPABILITY_SCHEMA, phase: "stress" }
      ),
  ]);
  return { contrarian: results[0], capability: results[1] };
}

let recon, stress, iter = 0, my = 1, gate_failures = [];
if (tier !== "deep") {
  recon = await runRecon(null);
  stress = await runStress(recon);
} else {
  let prev = null;
  do {
    recon = await runRecon(prev);
    gate_failures = gates(recon.frontier?.frontier_signals);
    if (gate_failures.length) {
      log(`rigor loop: gate failures, re-running recon — ${gate_failures.slice(0, 3).join("; ")}`);
      iter++;
      prev = recon;
      continue;
    }
    my = prev ? marginalYield(prev.frontier?.frontier_signals, recon.frontier?.frontier_signals) : 1;
    stress = await runStress(recon);
    const insp = await agent(
      `Audit the PROCESS of this recon for laziness signatures (generic claims, single-source ` +
        `conclusions, fluff lifted from abstracts, unverified search). Emit a rigor_score 1-10.\n${J({ recon, stress })}`,
      { agentType: "inspector", schema: INSPECTOR_SCHEMA, phase: "recon", model: "opus" }
    );
    iter++;
    prev = recon;
    log(`rigor loop: iter ${iter}, marginal_yield ${my.toFixed(2)}, rigor_score ${insp.rigor_score}`);
    if (insp.rigor_score >= 7 && my <= TAU) break;
  } while (iter < MAX_ITERS && (!budget.total || budget.remaining() > FLOOR));
}

mem.landscape = recon.landscape ?? null;
mem.frontier_signals = recon.frontier?.frontier_signals ?? [];
mem.contrarian_findings = stress?.contrarian?.contrarian_findings ?? null;
mem.capability_matrix = stress?.capability ?? null;

// post_recon liaison report (orchestrator reads it; unattended runs only see the log line)
mem.liaison_report = buildLiaison("post_recon");
log(`post_recon — ${mem.liaison_report.digest}`);

// Attended steering: stop here so the orchestrator can checkpoint, then re-invoke with resume.
if (segment === "recon") return mem;

// =========================================================================================
// Phase 4 — TEST (deep only)
// =========================================================================================
if (tier === "deep") {
  phase("test");
  const slice = { problem_frame: mem.problem_frame, frontier_signals: mem.frontier_signals, contrarian_findings: mem.contrarian_findings };
  const parts = await parallel([
    () =>
      agent(
        `Pressure-test the 2-4 most load-bearing claims with the cheapest model that can confirm or ` +
          `refute them. State every assumption; show the numbers.\n${J(slice)}`,
        { agentType: "simulator", schema: EMPIRICAL_SCHEMA, phase: "test" }
      ),
    () =>
      agent(
        `Cheaply reproduce or refute one or two claims (public-split benchmark rerun or micro-reproduction). ` +
          `A refuted claim is a successful test. Bound every test by cost.\n${J(slice)}`,
        { agentType: "prototyper", schema: EMPIRICAL_SCHEMA, phase: "test" }
      ),
  ]);
  mem.empirical_test = mergeEmpirical(parts);

  // =======================================================================================
  // Phase 5 — INTEGRATE (deep only)
  // =======================================================================================
  phase("integrate");
  mem.integration = await agent(
    `Reconcile every node into ONE coherent direction — the digital thread. Empirical results ` +
      `outrank paper claims, always. Surface conflicts the isolated agents could not see.\n` +
      J({
        frame: mem.problem_frame,
        frontier_signals: mem.frontier_signals,
        capability_matrix: mem.capability_matrix,
        contrarian_findings: mem.contrarian_findings,
        empirical_test: mem.empirical_test,
      }),
    { agentType: "integrator", schema: INTEGRATION_SCHEMA, phase: "integrate", model: "opus" }
  );
}

// =========================================================================================
// Phase 6 — SYNTHESIZE
// =========================================================================================
phase("synthesize");
mem.forecast = await agent(
  `Produce decision intelligence (not a summary) from ONLY this structured memory. Do not introduce ` +
    `new signals. Generate 6m/12m/24m scenarios with probabilities, 2-3 asymmetric opportunities, and ` +
    `narrative_risks (what could make this whole forecast wrong).\n` +
    J({
      frame: mem.problem_frame,
      landscape: mem.landscape,
      frontier_signals: mem.frontier_signals,
      contrarian_findings: mem.contrarian_findings,
      capability_matrix: mem.capability_matrix,
      empirical_test: mem.empirical_test ?? null,
      integration: mem.integration ?? null,
    }),
  { agentType: "synthesis-strategist", schema: FORECAST_SCHEMA, phase: "synthesize" }
);

// =========================================================================================
// Phase 7 — JUDGE GATE (deep only)
// =========================================================================================
if (tier === "deep") {
  mem.rigor_loop = {
    active: true,
    iteration_count: iter,
    gate_failures,
    marginal_yield: my,
    convergence: my <= TAU ? "saturated" : iter >= MAX_ITERS ? "ceiling_hit" : "forced_stop",
  };
  phase("gate");
  mem.judge_review = await agent(
    `Quality control. Read the full memory; flag hallucinations (claims without source, numbers that ` +
      `don't add up, citations that circle), rebalance confidence where the contrarian or a test ` +
      `undercut a high score, detect narrative drift, and collect dead_ends. Your value is in saying NO.\n` +
      J(mem),
    { agentType: "judge", schema: JUDGE_SCHEMA, phase: "gate", model: "opus" }
  );
} else {
  mem.rigor_loop = { active: false, iteration_count: 0, convergence: "inactive" };
}

// =========================================================================================
// Cost ledger from the runtime budget; return memory for the orchestrator to persist + render
// =========================================================================================
mem.cost_ledger = {
  budget_tokens: budget.total,
  spent_tokens: budget.spent(),
  status: budget.total && budget.spent() > budget.total ? "over" : budget.total && budget.spent() > 0.8 * budget.total ? "near_limit" : "under",
};
return mem;
