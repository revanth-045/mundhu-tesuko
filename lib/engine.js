// Deterministic eligibility engine. No model involved.
// The LLM never decides eligibility — it only explains what this file computed.

import { ruleById } from "./rules.js";

export const LIMITS = {
  incomeRural: 150000,
  incomeUrban: 200000,      // stricter of the two conflicting public figures
  incomeUrbanDisputed: 250000,
  landWetAcres: 3.5,
  landDryAcres: 7.5,
};

/**
 * @param {object} a answers
 * @returns {{verdict:string, checks:Array, citedRuleIds:string[], blockers:Array, warnings:Array}}
 */
export function assessEligibility(a) {
  const checks = [];
  const push = (id, pass, enDetail, teDetail, hard = true) =>
    checks.push({ ruleId: id, pass, hard, en: enDetail, te: teDetail });

  // residency
  push(
    "RESIDENCY",
    a.resident === true,
    a.resident ? "You are a Telangana resident." : "Applicant must be a Telangana resident.",
    a.resident ? "మీరు తెలంగాణ నివాసి." : "దరఖాస్తుదారు తెలంగాణ నివాసి అయి ఉండాలి."
  );

  // income
  const urban = a.area === "urban";
  const limit = urban ? LIMITS.incomeUrban : LIMITS.incomeRural;
  const incomeOk = Number(a.income) < limit;
  const inDisputeBand =
    urban && Number(a.income) >= LIMITS.incomeUrban && Number(a.income) < LIMITS.incomeUrbanDisputed;

  push(
    urban ? "INCOME-URBAN" : "INCOME-RURAL",
    incomeOk,
    incomeOk
      ? `₹${fmt(a.income)} is under the ₹${fmt(limit)} limit.`
      : `₹${fmt(a.income)} is above the ₹${fmt(limit)} limit.`,
    incomeOk
      ? `₹${fmt(a.income)} — ₹${fmt(limit)} పరిమితి లోపే ఉంది.`
      : `₹${fmt(a.income)} — ₹${fmt(limit)} పరిమితి కంటే ఎక్కువ.`
  );

  // land
  const wet = Number(a.landWet || 0);
  const dry = Number(a.landDry || 0);
  const landOk = wet <= LIMITS.landWetAcres && dry <= LIMITS.landDryAcres;
  push(
    "LAND-LIMIT",
    landOk,
    landOk
      ? `${wet} acres wet and ${dry} acres dry are within limits.`
      : `Limit is ${LIMITS.landWetAcres} acres wet / ${LIMITS.landDryAcres} acres dry.`,
    landOk
      ? `${wet} ఎకరాల మాగాణి, ${dry} ఎకరాల మెట్ట — పరిమితి లోపే.`
      : `పరిమితి ${LIMITS.landWetAcres} ఎకరాల మాగాణి / ${LIMITS.landDryAcres} ఎకరాల మెట్ట.`
  );

  // exclusions
  push(
    "EXCL-INCOMETAX",
    a.incomeTax !== true,
    a.incomeTax ? "A family member pays income tax." : "No income tax payer in the family.",
    a.incomeTax ? "కుటుంబంలో ఆదాయపు పన్ను చెల్లించే వారు ఉన్నారు." : "కుటుంబంలో ఆదాయపు పన్ను చెల్లించే వారు లేరు."
  );
  push(
    "EXCL-GOVTJOB",
    a.govtJob !== true,
    a.govtJob
      ? "A regular government employee in the family is generally a bar — but contract, outsourced and sanitation staff are commonly treated as eligible. We have NOT verified this exception."
      : "No regular government employee in the family.",
    a.govtJob
      ? "కుటుంబంలో రెగ్యులర్ ప్రభుత్వ ఉద్యోగి ఉంటే సాధారణంగా అర్హత ఉండదు — కానీ కాంట్రాక్ట్, ఔట్‌సోర్సింగ్, పారిశుద్ధ్య సిబ్బందికి అర్హత ఉంటుంది. ఈ మినహాయింపును మేము ధ్రువీకరించలేదు."
      : "కుటుంబంలో రెగ్యులర్ ప్రభుత్వ ఉద్యోగి లేరు.",
    false // soft: carve-out unverified, so we warn rather than hard-block
  );
  push(
    "EXCL-DUPLICATE",
    a.otherCard !== true,
    a.otherCard
      ? "Another active card exists for this family. If this is a leftover entry after marriage or migration, get it removed first — then this stops being a bar."
      : "No other active card reported.",
    a.otherCard
      ? "ఈ కుటుంబానికి వేరే యాక్టివ్ కార్డు ఉంది. పెళ్లి లేదా వలస తర్వాత మిగిలిపోయిన పాత ఎంట్రీ అయితే, ముందు దాన్ని తొలగించండి — అప్పుడు ఇది అడ్డంకి కాదు."
      : "వేరే యాక్టివ్ కార్డు లేదు."
  );

  const blockers = checks.filter((c) => !c.pass && c.hard);
  const warnings = checks.filter((c) => !c.pass && !c.hard);

  let verdict = "ELIGIBLE";
  if (blockers.length) verdict = "NOT_ELIGIBLE";
  else if (warnings.length || inDisputeBand) verdict = "NEEDS_CHECK";

  return {
    verdict,
    checks,
    blockers,
    warnings,
    inDisputeBand,
    citedRuleIds: [...new Set(checks.map((c) => c.ruleId))].filter((id) => ruleById(id)),
  };
}

const fmt = (n) => Number(n || 0).toLocaleString("en-IN");
