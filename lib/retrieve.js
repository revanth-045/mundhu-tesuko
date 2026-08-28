// Retrieval with a supersession guillotine.
//
// The point of this file: a retired rule is removed BEFORE anything reaches the
// model, in plain code. The model therefore cannot quote a rule that is no longer
// in force — that is a structural guarantee, not a prompt instruction.

import { RULES } from "./rules.js";

const STOP = new Set("a an the is are do i my me to for of on in what how can will and or my na naa".split(" "));

const tokenize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t));

function scoreRule(rule, qTokens) {
  const hay = [
    rule.id,
    ...(rule.topic || []),
    rule.en?.title,
    rule.en?.body,
    rule.te?.title,
    rule.te?.body,
  ]
    .join(" ")
    .toLowerCase();
  const hayTokens = new Set(tokenize(hay));

  let score = 0;
  for (const t of qTokens) {
    const stem = t.length > 5 ? t.slice(0, 5) : t; // eligible ~ eligibility, document ~ documents
    if ((rule.topic || []).some((tp) => tp.toLowerCase().startsWith(stem))) score += 3;
    else if (hayTokens.has(t)) score += 1.5;
    else if ([...hayTokens].some((h) => h.startsWith(stem))) score += 1;
    else if (hay.includes(t)) score += 0.5; // substring, handles Telugu inflection
  }
  return score;
}

/**
 * @returns {{kept:Array, pruned:Array, considered:number}}
 *  `pruned` is returned so the UI can SHOW what was thrown away and why.
 */
export function retrieve(query, { k = 5, boostIds = [] } = {}) {
  const qTokens = tokenize(query);
  const scored = RULES.map((r) => ({
    rule: r,
    score: scoreRule(r, qTokens) + (boostIds.includes(r.id) ? 5 : 0),
  })).filter((s) => s.score > 0);

  scored.sort((a, b) => b.score - a.score);

  const pruned = [];
  const kept = [];
  for (const s of scored) {
    if (!s.rule.inForce) {
      pruned.push({
        id: s.rule.id,
        title: s.rule.en.title,
        score: s.score,
        reason: `superseded by ${s.rule.supersededBy}`,
      });
      continue; // ── the guillotine ──
    }
    if (kept.length < k) kept.push(s);
  }
  return { kept, pruned, considered: scored.length };
}

/** Compact, citation-ready context block for the model. Only in-force text. */
export function buildContext(kept, lang = "en") {
  return kept
    .map(({ rule }) => {
      const t = rule[lang] || rule.en;
      return `[${rule.id}] ${t.title}\n${t.body}\n(source: ${rule.source}; confidence: ${rule.confidence}; kind: ${rule.sourceKind})`;
    })
    .join("\n\n");
}
