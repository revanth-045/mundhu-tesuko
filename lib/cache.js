// Pre-baked answers for the common questions.
//
// Why this exists: every cached hit is an OpenAI call NOT made. The demo path is
// therefore free to run, and the live model is reserved for genuinely new
// questions. Cached answers were written by hand against the same rule cards the
// model is given, so they carry the same citations.

const norm = (s) =>
  (s || "").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();

const SEED = [
  {
    keys: ["what documents do i need", "which documents", "documents for new card", "పత్రాలు ఏమి కావాలి", "ఏ పత్రాలు"],
    en: "For a new card you need: Aadhaar of every family member, proof of residence, an income declaration, a passport photo of the head of the family, and the head of family's bank passbook. Take originals and one photocopy set.",
    te: "కొత్త కార్డు కోసం కావాల్సినవి: కుటుంబ సభ్యులందరి ఆధార్, నివాస ధ్రువీకరణ, ఆదాయ ప్రకటన, కుటుంబ పెద్ద ఫోటో, కుటుంబ పెద్ద బ్యాంక్ పాస్‌బుక్. ఒరిజినల్స్‌తో పాటు ఒక జిరాక్స్ సెట్ తీసుకెళ్లండి.",
    cites: ["DOCS-NEW"],
  },
  {
    keys: ["how much does it cost", "what is the fee", "fee", "ఎంత ఖర్చు", "రుసుము ఎంత", "ఫీజు"],
    en: "About ₹45 at MeeSeva. Reports document centres charging ₹250–₹500 and giving no receipt. You do not have to pay more than the notified fee, and you can ask for a receipt for anything you pay.",
    te: "మీసేవలో సుమారు ₹45. కొన్ని కేంద్రాలు ₹250–₹500 వసూలు చేస్తూ రసీదు ఇవ్వడం లేదని వార్తలు. నోటిఫై చేసిన రుసుము కంటే ఎక్కువ చెల్లించాల్సిన అవసరం లేదు. చెల్లించినదానికి రసీదు అడగండి.",
    cites: ["FEE"],
  },
  {
    keys: ["how much rice", "how much will i get", "entitlement", "ఎంత బియ్యం", "ఎన్ని కిలోలు"],
    en: "6 kg of rice per person per month. Antyodaya (AAY) households get 35 kg per family per month regardless of how many people are in the family.",
    te: "ఒక్కో వ్యక్తికి నెలకు 6 కిలోల బియ్యం. అంత్యోదయ (AAY) కుటుంబాలకు ఎంతమంది ఉన్నా నెలకు 35 కిలోలు.",
    cites: ["ENTITLEMENT"],
  },
  {
    keys: ["how long does it take", "pending for months", "still under process", "ఎంత సమయం", "పెండింగ్"],
    en: "It is described as around 30 days. If yours has been pending far longer, that is not a normal wait — it is a grievance. You can escalate to the District Supply Office, and under the National Food Security Act, appeal to the District Grievance Redressal Officer.",
    te: "సుమారు 30 రోజులు పట్టాలి. దీనికి మించి చాలా కాలం పెండింగ్‌లో ఉంటే అది సాధారణ ఆలస్యం కాదు — ఫిర్యాదు చేయదగినది. జిల్లా సప్లై ఆఫీసుకు, ఆహార భద్రతా చట్టం ప్రకారం DGROకు అప్పీలు చేయవచ్చు.",
    cites: ["TIMELINE", "APPEAL-DGRO"],
  },
  {
    keys: ["my card has not come", "card not received", "i did not get it yet", "still not received",
           "కార్డు ఇంకా రాలేదు", "కార్డు రాలేదు", "ఇంకా అందలేదు"],
    en: "First check the status with your application number on the EPDS portal. If it says approved, the card has been made but not handed over — ask your ration shop dealer, then the Mandal Revenue Office. If it still says under process after about 30 days, that is a grievance: escalate to the District Supply Office, then the helpline 1800-4250-0333.",
    te: "ముందు మీ దరఖాస్తు నంబర్‌తో EPDS పోర్టల్‌లో స్థితి చూడండి. 'అప్రూవ్డ్' అని ఉంటే కార్డు తయారైంది కానీ మీ చేతికి ఇవ్వలేదు — రేషన్ దుకాణం డీలర్‌ను, తర్వాత మండల రెవెన్యూ ఆఫీసును అడగండి. సుమారు 30 రోజుల తర్వాత కూడా 'అండర్ ప్రాసెస్' అని ఉంటే అది ఫిర్యాదు చేయదగినది — జిల్లా సప్లై ఆఫీసుకు, తర్వాత 1800-4250-0333కు తెలియజేయండి.",
    cites: ["TRACK-STATUS", "NOT-RECEIVED", "TIMELINE", "DELAY-LADDER"],
  },
  {
    keys: ["what does under process mean", "under process", "status meaning", "అండర్ ప్రాసెస్", "స్థితి అర్థం"],
    en: "\"Under process\" means your application was accepted but no decision is recorded yet. \"Field verification pending\" means an officer is meant to visit — often nobody has. \"Approved\" means the card exists in the system, which is not the same as it being in your hand. Around 30 days is the stated timeline; well beyond that is a grievance, not a queue.",
    te: "\"అండర్ ప్రాసెస్\" అంటే దరఖాస్తు స్వీకరించారు, ఇంకా నిర్ణయం జరగలేదు. \"ఫీల్డ్ వెరిఫికేషన్ పెండింగ్\" అంటే అధికారి రావాలి — చాలాసార్లు ఎవరూ రారు. \"అప్రూవ్డ్\" అంటే సిస్టమ్‌లో కార్డు ఉంది, చేతికి వచ్చినట్టు కాదు. సుమారు 30 రోజులు అని చెబుతారు; అంతకు మించితే అది క్యూ కాదు, ఫిర్యాదు.",
    cites: ["STATUS-MEANINGS", "TIMELINE", "DELAY-LADDER"],
  },
  {
    keys: ["how do i check status", "check my application", "track application", "స్థితి ఎలా చూడాలి", "ట్రాక్"],
    en: "Use your application or acknowledgement number on the EPDS Telangana portal. If you were never given that number, that itself is a problem — you are entitled to an acknowledgement slip whenever you apply or pay a fee. Without it you cannot track the application, or prove you made one.",
    te: "EPDS తెలంగాణ పోర్టల్‌లో మీ దరఖాస్తు నంబర్ లేదా రసీదు నంబర్ వాడండి. ఆ నంబర్ మీకు ఇవ్వకపోయి ఉంటే అదే ఒక సమస్య — దరఖాస్తు చేసినప్పుడు, డబ్బు కట్టినప్పుడు రసీదు అడిగే హక్కు మీకు ఉంది. అది లేకుండా స్థితి చూడలేరు, దరఖాస్తు చేశారని నిరూపించనూ లేరు.",
    cites: ["TRACK-STATUS", "ACK-SLIP"],
  },
  {
    keys: ["fingerprint not working", "biometric failed", "వేలిముద్ర పడటం లేదు", "వేలిముద్ర"],
    en: "Central instructions tell states not to deny PDS benefits only because Aadhaar authentication failed. Ask the shop to try alternate means. If you are still refused, that is a grievance — helpline 1800-4250-0333, or the District Supply Office.",
    te: "ఆధార్ ప్రామాణీకరణ విఫలమైందని మాత్రమే రేషన్ నిరాకరించవద్దని కేంద్రం రాష్ట్రాలకు సూచించింది. ప్రత్యామ్నాయ మార్గం ప్రయత్నించమని దుకాణంలో అడగండి. ఇంకా నిరాకరిస్తే ఫిర్యాదు చేయండి — 1800-4250-0333 లేదా జిల్లా సప్లై ఆఫీసు.",
    cites: ["AADHAAR-NOT-SOLE-GROUND", "GRIEVANCE-CHANNELS"],
  },
  {
    keys: ["where do i complain", "grievance", "helpline", "ఫిర్యాదు", "హెల్ప్‌లైన్"],
    en: "Three routes: the EPDS Telangana portal's grievance system, the toll-free helpline 1800-4250-0333, or the District Supply Office in person. If none of those resolve it, the DGRO is your statutory appeal under the National Food Security Act.",
    te: "మూడు మార్గాలు: EPDS తెలంగాణ పోర్టల్ ఫిర్యాదు వ్యవస్థ, టోల్ ఫ్రీ 1800-4250-0333, లేదా జిల్లా సప్లై ఆఫీసు. ఇవి పరిష్కరించకపోతే, ఆహార భద్రతా చట్టం ప్రకారం DGROకు అప్పీలు చేసే హక్కు మీకు ఉంది.",
    cites: ["GRIEVANCE-CHANNELS", "APPEAL-DGRO"],
  },
  {
    keys: ["after marriage", "add my wife", "add wife name", "పెళ్లి తర్వాత", "భార్య పేరు"],
    en: "The order matters. Get the name removed from the parents' card FIRST, keep that acknowledgement, then apply to add it to the new card and attach the acknowledgement. If you apply the other way round, the duplicate check rejects you — and that rejection is a sequencing problem, not fraud.",
    te: "వరుస క్రమం ముఖ్యం. ముందు పుట్టింటి కార్డు నుండి పేరు తొలగించండి, ఆ రసీదు ఉంచుకోండి, తర్వాత కొత్త కార్డులో చేర్చమని దరఖాస్తు చేసి ఆ రసీదు జతచేయండి. వేరే క్రమంలో చేస్తే 'డూప్లికేట్' అని తిరస్కరిస్తారు — అది క్రమం సమస్య, మోసం కాదు.",
    cites: ["DOCS-MARRIAGE", "EXCL-DUPLICATE"],
  },
  {
    keys: ["what else does this card give", "other schemes", "blast radius", "ఇంకా ఏమి వస్తాయి", "ఇతర పథకాలు"],
    en: "More than rice. Public reporting links the Food Security Card to Aarogyasri health cover, Indiramma housing, student fee reimbursement, the ₹500 gas cylinder and free electricity. So a problem with this one card can quietly affect several other things.",
    te: "బియ్యం మాత్రమే కాదు. ఫుడ్ సెక్యూరిటీ కార్డు ఆరోగ్యశ్రీ, ఇందిరమ్మ ఇళ్లు, ఫీజు రీయింబర్స్‌మెంట్, ₹500 సిలిండర్, ఉచిత విద్యుత్‌తో ముడిపడి ఉందని వార్తలు. అంటే ఈ ఒక్క కార్డు సమస్య వల్ల ఇంకా చాలా వాటిపై ప్రభావం పడొచ్చు.",
    cites: ["LINK-AAROGYASRI", "LINK-INDIRAMMA", "LINK-FEEREIMB", "LINK-CYLINDER", "LINK-POWER"],
  },
];

const runtime = new Map(); // session cache for live answers

export function lookup(question, lang) {
  const q = norm(question);
  if (!q) return null;

  for (const item of SEED) {
    for (const key of item.keys) {
      const k = norm(key);
      if (q === k || q.includes(k) || k.includes(q)) {
        return { text: item[lang] || item.en, cites: item.cites, source: "cache" };
      }
    }
  }
  const hit = runtime.get(`${lang}:${q}`);
  return hit ? { ...hit, source: "session-cache" } : null;
}

export function remember(question, lang, payload) {
  runtime.set(`${lang}:${norm(question)}`, payload);
}

export const seedCount = SEED.length;
