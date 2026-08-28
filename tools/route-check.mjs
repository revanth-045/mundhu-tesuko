// Predicts which path a question takes — cache, scope-gate, or a real model call.
// Runs entirely locally. Makes no network request and costs nothing.
import { lookup } from "../lib/cache.js";
import { retrieve } from "../lib/retrieve.js";
import { SCOPE_FLOOR, inDomain } from "../lib/scope.js";

export function route(question, lang = "en") {
  if (lookup(question, lang)) return { path: "cache", why: "matches a pre-written answer" };
  const { kept } = retrieve(question);
  const top = kept[0]?.score ?? 0;
  if (!inDomain(question) && top < SCOPE_FLOOR)
    return { path: "scope-gate", why: `no domain word, top score ${top} < ${SCOPE_FLOOR}` };
  return { path: "MODEL", why: `in domain, best match ${kept[0]?.rule.id ?? "-"} (${top})` };
}
