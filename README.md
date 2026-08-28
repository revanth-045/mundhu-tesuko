# ముందు తెలుసుకో · Mundhu Tesuko

Know before you apply — a rebuilt journey for the Telangana Food Security Card.

**An independent prototype. Not a government service, not affiliated with or approved by
any department. No live government system is contacted. All card data is mock.**

---

## What it does

| | |
|---|---|
| **Check eligibility** | Seven questions, spoken or tapped, Telugu or English → a verdict *before* you spend anything |
| **Decode a rejection** | What the one-line reason means, whether it was likely applied wrongly, and a Telugu appeal letter |
| **Ask anything** | A persistent assistant rail, grounded only in rules currently in force |
| **See the blast radius** | The other schemes this one card gates — health, housing, fees, gas, power |

## Three design choices

1. **Code decides, not the model.** Eligibility is plain arithmetic in `lib/engine.js`.
   The model only explains a result it did not compute.
2. **Retired rules are cut before retrieval reaches the model** (`lib/retrieve.js`).
   A superseded rule is structurally unquotable — and the UI shows you what was cut.
3. **Every claim is labelled** with its source and confidence. Anything unverified is
   flagged in red, not hidden.

## Cost design

Three request paths, only one of which spends anything:

| Path | Cost | When |
|---|---|---|
| `cache` | ₹0 | A general question with a pre-written answer (11 seeded, both languages) |
| `scope-gate` | ₹0 | Off-topic — refused before any model call |
| `model` | one small call | A specific question about the user's own situation |

Check any question's path without spending a call:

```bash
node -e "import('./tools/route-check.mjs').then(m=>console.log(m.route('my card has not come')))"
```

Voice runs in the browser (Web Speech API) — free, on-device, no key.

## Run it

```bash
npm install && cp .env.example .env.local && npm run dev
```

The app works with an empty key: eligibility, retrieval, citations, the prune, voice and
the appeal letter are all local. Only novel questions need a model.

## Layout

```
app/            page.jsx (the site) · api/ask (the one model endpoint)
lib/  rules.js      the corpus — 31 rule cards, each with source + confidence
      engine.js     deterministic eligibility. no model.
      retrieve.js   lexical retrieval + the supersession prune
      scope.js      domain gate — decides if a question is in scope at all
      cache.js      pre-written answers, so common questions cost nothing
      i18n.js       every string, te + en
tools/route-check.mjs   predicts a question's path offline
```

## Known limits

- Rule cards are curated from public reporting and statute, **not** scraped from
  Government Orders. Six are marked `assumed` and flagged in the interface.
- Public sources disagree on the urban income ceiling (₹2L vs ₹2.5L). We apply the
  stricter figure and show the conflict rather than pick silently.
- On a free-tier key the model is rate-limited (~10 requests/minute). The app degrades
  to rules-only with a clear message rather than failing.
