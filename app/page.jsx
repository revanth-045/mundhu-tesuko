"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../components/Icon.jsx";
import { T } from "../lib/i18n.js";
import { REJECTION_CODES, ruleById, schemeRules } from "../lib/rules.js";
import { assessEligibility } from "../lib/engine.js";
import { retrieve } from "../lib/retrieve.js";

function useVoice(locale) {
  const [live, setLive] = useState(false);
  const ref = useRef(null);
  const supported =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const listen = (onText) => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new SR();
    r.lang = locale; r.interimResults = false; r.maxAlternatives = 1;
    r.onresult = (e) => onText(e.results[0][0].transcript);
    r.onend = () => setLive(false); r.onerror = () => setLive(false);
    ref.current = r; setLive(true); r.start();
  };
  const stop = () => { try { ref.current?.stop(); } catch {} setLive(false); };
  const speak = (text) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = locale; u.rate = 0.95; window.speechSynthesis.speak(u);
  };
  return { live, listen, stop, speak, supported: !!supported };
}

const SCHEME_ICON = {
  "LINK-AAROGYASRI": "health", "LINK-INDIRAMMA": "house", "LINK-FEEREIMB": "cap",
  "LINK-CYLINDER": "flame", "LINK-POWER": "bolt", "LINK-KALYANALAKSHMI": "ring",
};

function Cite({ id }) {
  const r = ruleById(id);
  if (!r) return null;
  return (
    <div className="cite">
      <span className="id">{r.id}</span><span className={`tag ${r.sourceKind}`}>{r.sourceKind}</span>
      <div className="tt"><strong style={{ color: "var(--ink)" }}>{r.en.title}</strong> · {r.source}</div>
      {r.needsVerification && (
        <div className="flag bad-c"><Icon n="alert" s={13} /><span>Not verified — check before relying on it.</span></div>
      )}
      {r.conflict && (
        <div className="flag warn-c"><Icon n="alert" s={13} /><span>Sources disagree. We used the stricter figure.</span></div>
      )}
    </div>
  );
}

function Prune({ pruned, t }) {
  return (
    <div className="prune">
      <div className="hd"><Icon n="trash" s={13} /><span className="label" style={{ margin: 0 }}>{t.prunedTitle}</span></div>
      {pruned.length === 0 ? <div className="note">{t.prunedNone}</div> : (
        <>
          {pruned.map((p) => (
            <div key={p.id}>
              <span className="dead">{p.id}</span>
              <span style={{ color: "var(--mid)", fontSize: 12.5 }}> — {p.reason}</span>
            </div>
          ))}
          <div className="note" style={{ marginTop: 10 }}>{t.prunedBody}</div>
        </>
      )}
    </div>
  );
}

/* ── the assistant, used in both the rail and the mobile sheet ─────────── */
function Assistant({ t, lang, voice, q, setQ, ans, busy, ask, compact }) {
  return (
    <>
      <div className={compact ? "sb" : "rb"}>
        {!ans && !busy && (
          <div>
            <p className="empty">{t.askHint2}</p>
            {t.suggest.map((s) => (
              <button className="sugg" key={s} onClick={() => { setQ(s); ask(s); }}>{s}</button>
            ))}
          </div>
        )}
        {busy && <p className="empty">{t.thinking}</p>}
        {ans && (
          <div className="fade">
            <p className="reply">{ans.answer}</p>
            {!ans.outOfScope && typeof window !== "undefined" && window.speechSynthesis && (
              <button className="sugg" style={{ marginTop: 12 }} onClick={() => voice.speak(ans.answer)}>
                {lang === "te" ? "🔊 చదివి వినిపించు" : "🔊 Read aloud"}
              </button>
            )}
            {(ans.cites || []).length > 0 && (
              <>
                <div className="chips">{ans.cites.map((c) => <span className="chip" key={c}>{c}</span>)}</div>
                {ans.cites.map((id) => <Cite key={id} id={id} />)}
              </>
            )}
            {!ans.outOfScope && <Prune pruned={ans.pruned || []} t={t} />}
            <div className="meta"><Icon n="eye" s={12} />{ans.via}{ans.cost ? ` · ${ans.cost}` : ""}</div>
          </div>
        )}
      </div>
      <div className={compact ? "sf" : "rf"}>
        <div className="field">
          <input type="text" value={q} placeholder={t.askPh}
            onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} />
          {voice.supported && (
            <button className="mic" data-live={voice.live} aria-label="Speak"
              onClick={() => voice.live ? voice.stop() : voice.listen((txt) => { setQ(txt); ask(txt); })}>
              <Icon n={voice.live ? "stop" : "mic"} s={18} />
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function Site() {
  const [lang, setLang] = useState("te");
  const [view, setView] = useState("home");
  const t = T[lang];
  const voice = useVoice(t.dir);

  const [step, setStep] = useState(0);
  const [a, setA] = useState({});
  const [rejCode, setRejCode] = useState(null);
  const [copied, setCopied] = useState(false);
  const [q, setQ] = useState("");
  const [ans, setAns] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sheet, setSheet] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.te = lang === "te" ? "1" : "0";
  }, [lang]);

  const go = (v) => { setView(v); window.scrollTo({ top: 0, behavior: "instant" }); };

  const QS = [
    { k: "resident", q: t.qResident, opts: [[t.yes, true], [t.no, false]] },
    { k: "area", q: t.qArea, opts: [[t.rural, "rural"], [t.urban, "urban"]] },
    { k: "income", q: t.qIncome, opts: [[t.inc1, 80000], [t.inc2, 130000], [t.inc3, 180000], [t.inc4, 260000]] },
    { k: "land", q: t.qLand, opts: [[t.landNo, "none"], [t.landSmall, "small"], [t.landBig, "big"]] },
    { k: "incomeTax", q: t.qTax, opts: [[t.no, false], [t.yes, true]] },
    { k: "govtJob", q: t.qGovt, opts: [[t.no, false], [t.yes, true]], note: t.govtNote },
    { k: "otherCard", q: t.qCard, opts: [[t.no, false], [t.yes, true]] },
  ];

  const answers = useMemo(() => ({
    ...a,
    landWet: a.land === "big" ? 5 : a.land === "small" ? 1 : 0,
    landDry: a.land === "big" ? 9 : a.land === "small" ? 2 : 0,
  }), [a]);
  const result = useMemo(() => (view === "result" ? assessEligibility(answers) : null), [view, answers]);
  const prunedResult = useMemo(() => retrieve("income land eligibility exclusion").pruned, []);

  const pick = (k, v) => {
    setA((p) => ({ ...p, [k]: v }));
    if (step + 1 < QS.length) setStep(step + 1); else go("result");
  };

  async function ask(text) {
    const question = (text ?? q).trim();
    if (!question) return;
    setBusy(true); setAns(null);
    const local = retrieve(question);
    try {
      const r = await fetch("/api/ask", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, lang }),
      });
      const d = await r.json();
      setAns({ ...d, pruned: d.pruned ?? local.pruned });
    } catch {
      setAns({
        answer: lang === "te"
          ? "కనెక్షన్ సమస్య. మళ్లీ ప్రయత్నించండి, లేదా 1800-4250-0333కు కాల్ చేయండి."
          : "Connection problem. Try again, or call 1800-4250-0333.",
        cites: local.kept.map((x) => x.rule.id), pruned: local.pruned, via: "offline",
      });
    }
    setBusy(false);
  }

  const letter = useMemo(() => {
    const rc = REJECTION_CODES.find((r) => r.code === rejCode);
    if (!rc) return "";
    if (lang === "te") {
      return `గౌరవనీయులైన జిల్లా పౌరసరఫరాల అధికారి గారికి,

విషయం: ఫుడ్ సెక్యూరిటీ కార్డు దరఖాస్తు తిరస్కరణపై పునఃపరిశీలన కోరుతూ.

దరఖాస్తు సంఖ్య: ____________________
పేరు: ____________________
గ్రామం / వార్డు: ____________________
మండలం: ____________________
తేదీ: ____________________

నా దరఖాస్తును "${rc.te.plain}" అనే కారణంతో తిరస్కరించారు.

నా విన్నపం: ${rc.te.fix}

దీనికి సంబంధించిన పత్రాలను జతపరుస్తున్నాను. దయచేసి నా దరఖాస్తును మళ్లీ పరిశీలించి, తిరస్కరణకు గల కారణాన్ని రాతపూర్వకంగా తెలియజేయవలసిందిగా కోరుతున్నాను.

జాతీయ ఆహార భద్రతా చట్టం, 2013 ప్రకారం జిల్లా ఫిర్యాదుల పరిష్కార అధికారికి అప్పీలు చేసే హక్కు నాకు ఉందని గమనించగలరు.

ధన్యవాదాలు,
సంతకం: ____________________
ఫోన్: ____________________`;
    }
    return `To the District Supply Officer,

Subject: Request to reconsider the rejection of my Food Security Card application.

Application number: ____________________
Name: ____________________
Village / Ward: ____________________
Mandal: ____________________
Date: ____________________

My application was rejected with the reason: "${rc.en.plain}"

My request: ${rc.en.fix}

I am attaching the supporting documents. Please re-examine my application and provide the reason for rejection in writing.

I note that under the National Food Security Act, 2013, I have the right to appeal to the District Grievance Redressal Officer.

Thank you,
Signature: ____________________
Phone: ____________________`;
  }, [rejCode, lang]);

  useEffect(() => { setCopied(false); }, [rejCode, lang]);

  const NAV = [["home", t.nHome], ["check", t.nCheck], ["rejected", t.nRejected], ["compare", t.nCompare], ["honesty", t.nHonest]];
  const asst = { t, lang, voice, q, setQ, ans, busy, ask };

  return (
    <>
      <nav className="nav">
        <div className="in">
          <button className="logo" onClick={() => go("home")} translate="no">
            <span className="m">మ</span><b>{t.brand}</b>
          </button>
          <div className="menu">
            {NAV.map(([v, label]) => (
              <button key={v} data-on={view === v || (v === "check" && view === "result")}
                onClick={() => { if (v === "check") { setStep(0); setA({}); } go(v); }}>{label}</button>
            ))}
          </div>
          <div className="navright">
            <div className="lang" role="group" aria-label="Language">
              <button data-on={lang === "te"} onClick={() => setLang("te")}>తెలుగు</button>
              <button data-on={lang === "en"} onClick={() => setLang("en")}>EN</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="page">
        <main className="main">
          <div className="notice"><Icon n="alert" s={15} /><span>{t.notOfficial}</span></div>

          {view === "home" && (
            <div className="fade">
              <span className="kicker">EPDS Telangana · rebuilt</span>
              <h1 className="h1">{t.h1}</h1>
              <p className="dek">{t.lede}</p>
              <div className="ctas" style={{ marginBottom: 54 }}>
                <button className="cta" onClick={() => { setStep(0); setA({}); go("check"); }}>
                  {t.cta1}<Icon n="fwd" s={17} />
                </button>
                <button className="cta ghost" onClick={() => go("compare")}>{t.cta4}</button>
              </div>

              <div className="band">
                <span className="label">{t.startHere}</span>
                {[[t.cta1, t.cta1s, () => { setStep(0); setA({}); go("check"); }],
                  [t.cta2, t.cta2s, () => { setRejCode(null); go("rejected"); }],
                  [t.cta4, t.cta4s, () => go("compare")]].map(([title, desc, fn], i) => (
                  <button className="tile" key={title} onClick={fn}>
                    <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="tx"><b>{title}</b><span>{desc}</span></span>
                    <span className="gg"><Icon n="fwd" s={18} /></span>
                  </button>
                ))}
              </div>

              <div className="band">
                <span className="label">{t.howTitle}</span>
                <div className="cols3">
                  {t.how.map(([h, s], i) => (
                    <div className="col" key={h}>
                      <div className="no">{String(i + 1).padStart(2, "0")}</div>
                      <h4>{h}</h4><p className="note">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "check" && (
            <div className="fade" key={step}>
              <div className="steps">
                <span className="count">{String(step + 1).padStart(2, "0")}</span>
                <span className="track"><i style={{ width: `${((step + 1) / QS.length) * 100}%` }} /></span>
                <span className="count">{QS.length}</span>
              </div>
              <h2 className="h2" style={{ maxWidth: "18ch" }}>{QS[step].q}</h2>
              {QS[step].note && <p className="note" style={{ marginBottom: 22, maxWidth: "50ch" }}>{QS[step].note}</p>}
              <div style={{ marginTop: 26 }}>
                {QS[step].opts.map(([label, val]) => (
                  <button key={label} className="opt" data-sel={a[QS[step].k] === val} onClick={() => pick(QS[step].k, val)}>
                    <span className="rd" /><span>{label}</span>
                  </button>
                ))}
              </div>
              <button className="cta ghost" style={{ marginTop: 18 }}
                onClick={() => (step ? setStep(step - 1) : go("home"))}>
                <Icon n="back" s={16} />{t.back}
              </button>
            </div>
          )}

          {view === "result" && result && (() => {
            const ok = result.verdict === "ELIGIBLE", no = result.verdict === "NOT_ELIGIBLE";
            return (
              <div className="fade">
                <div className={`verdict ${ok ? "ok" : no ? "no" : "chk"}`}>
                  <span className="st">{ok ? t.stResult : no ? t.stBlocked : t.stCheck}</span>
                  <div className="hd">{ok ? t.vOk : no ? t.vNo : t.vChk}</div>
                  <div className="wy">{ok ? t.vOkS : no ? t.vNoS : t.vChkS}</div>
                </div>

                <div className="band"><span className="label">{t.checksTitle}</span>
                  {result.checks.map((c) => (
                    <div className="li" key={c.ruleId}>
                      <span className={`m ${c.pass ? "ok-c" : c.hard ? "bad-c" : "warn-c"}`}>
                        <Icon n={c.pass ? "check" : c.hard ? "ban" : "alert"} s={17} />
                      </span>
                      <span className="t">{lang === "te" ? c.te : c.en}</span>
                    </div>
                  ))}
                </div>

                <div className="band"><span className="label">{t.rulesUsed}</span>
                  {result.citedRuleIds.map((id) => <Cite key={id} id={id} />)}
                  <Prune pruned={prunedResult} t={t} />
                </div>

                <div className="band"><span className="label">{t.schemesTitle}</span>
                  <p className="body" style={{ fontSize: 15.5 }}>{t.schemesBody}</p>
                  <div className="grid">
                    {schemeRules().map((r) => (
                      <div className="cell" key={r.id}>
                        <Icon n={SCHEME_ICON[r.id]} s={21} />
                        <span>{(lang === "te" ? r.te : r.en).title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="band"><span className="label">{t.docsTitle}</span>
                  <p className="body">{(lang === "te" ? ruleById("DOCS-NEW").te : ruleById("DOCS-NEW").en).body}</p>
                  <Cite id="DOCS-NEW" />
                </div>

                <div className="band"><span className="label warn-c">{t.feeTitle}</span>
                  <p className="body">{(lang === "te" ? ruleById("FEE").te : ruleById("FEE").en).body}</p>
                  <Cite id="FEE" />
                </div>

                <button className="cta ghost" style={{ marginTop: 24 }}
                  onClick={() => { setStep(0); setA({}); go("check"); }}>{t.restart}</button>
              </div>
            );
          })()}

          {view === "rejected" && (
            <div className="fade">
              <h2 className="h2">{t.rejTitle}</h2>
              <p className="dek" style={{ fontSize: 17, marginBottom: 28 }}>{t.rejLede}</p>
              {REJECTION_CODES.map((rc) => (
                <button key={rc.code} className="opt" data-sel={rejCode === rc.code} onClick={() => setRejCode(rc.code)}>
                  <span className="rd" />
                  <span style={{ fontSize: 15, fontWeight: 500, lineHeight: 1.45 }}>{(lang === "te" ? rc.te : rc.en).plain}</span>
                </button>
              ))}
              {rejCode && (() => {
                const rc = REJECTION_CODES.find((r) => r.code === rejCode);
                const c = lang === "te" ? rc.te : rc.en;
                return (
                  <div className="fade" key={rejCode} style={{ marginTop: 28 }}>
                    <div className="band" style={{ paddingTop: 0, borderTop: 0 }}>
                      <span className="label">{t.rejMeans}</span><p className="body">{c.plain}</p>
                    </div>
                    <div className="band"><span className="label">{t.rejRight}</span><p className="body">{c.check}</p>
                      {rc.oftenWrong && (
                        <div className="flag warn-c" style={{ marginTop: 14, fontSize: 14 }}>
                          <Icon n="alert" s={16} /><span>{t.rejOftenWrong}</span>
                        </div>
                      )}
                    </div>
                    <div className="band"><span className="label">{t.rejFix}</span><p className="body">{c.fix}</p>
                      {rc.rules.map((id) => <Cite key={id} id={id} />)}
                    </div>
                    <div className="band"><span className="label">{t.letterTitle}</span>
                      <p className="note">{t.letterBody}</p>
                      <div className="letter">{letter}</div>
                      <button className="cta" style={{ marginTop: 16 }}
                        onClick={() => { navigator.clipboard?.writeText(letter); setCopied(true); }}>
                        <Icon n={copied ? "check" : "copy"} s={17} />{copied ? t.copied : t.copy}
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {view === "compare" && (
            <div className="fade">
              <h2 className="h2">{t.cta4}</h2>
              <p className="dek" style={{ fontSize: 17 }}>{t.compareLede}</p>
              <div className="cols2">
                <div>
                  <span className="label bad-c">Today</span>
                  {t.today.map((x) => (
                    <div className="li" key={x}><span className="m bad-c"><Icon n="ban" s={16} /></span><span className="t">{x}</span></div>
                  ))}
                </div>
                <div>
                  <span className="label ok-c">Here</span>
                  {t.here.map((x) => (
                    <div className="li" key={x}><span className="m ok-c"><Icon n="check" s={16} /></span><span className="t">{x}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {view === "honesty" && (
            <div className="fade">
              <h2 className="h2">{t.honTitle}</h2>
              <p className="dek" style={{ fontSize: 17 }}>{t.honLede}</p>
              <div className="band" style={{ borderTop: 0, paddingTop: 0 }}>
                {t.honest.map(([ok, txt]) => (
                  <div className="li" key={txt}>
                    <span className={`m ${ok ? "ok-c" : "warn-c"}`}><Icon n={ok ? "check" : "alert"} s={16} /></span>
                    <span className="t"><strong>{ok ? t.real : t.mock}</strong> — {txt}</span>
                  </div>
                ))}
              </div>
              <div className="band"><span className="label">{t.leastSure}</span>
                <p className="body" style={{ fontSize: 15.5 }}>{t.leastSureBody}</p>
              </div>
            </div>
          )}
        </main>

        <aside className="rail" aria-label="Assistant">
          <div className="rh"><span className="pulse" /><b>{t.railTitle}</b></div>
          <Assistant {...asst} />
        </aside>
      </div>

      <button className="fab" onClick={() => setSheet(true)}>
        <Icon n="mic" s={18} />{t.railTitle}
      </button>

      {sheet && (
        <div className="sheet">
          <div className="sh">
            <span className="pulse" />
            <b style={{ flex: 1, fontSize: 15 }}>{t.railTitle}</b>
            <button onClick={() => setSheet(false)} aria-label="Close"><Icon n="ban" s={20} /></button>
          </div>
          <Assistant {...asst} compact />
        </div>
      )}

      <footer className="foot">
        <div className="in">
          <div>
            <h5>{t.brand}</h5>
            <p>{t.notOfficial}</p>
          </div>
          <div>
            <h5>Pages</h5>
            {NAV.map(([v, label]) => (
              <button key={v} onClick={() => { if (v === "check") { setStep(0); setA({}); } go(v); }}>{label}</button>
            ))}
          </div>
          <div>
            <h5>{t.helpTitle}</h5>
            <p>{t.helpBody}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
