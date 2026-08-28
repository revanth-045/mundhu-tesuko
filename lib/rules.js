// Curated rule cards for the Telangana Food Security Card (FSC) journey.
//
// HONESTY CONTRACT — every card declares where it came from:
//   sourceKind: "official"  -> stated on a government portal / statute
//               "reported"  -> consistently reported in press or public guides
//               "assumed"   -> our working assumption, NOT verified
//   confidence: high | medium | low
// The UI surfaces both. Nothing here is presented as more certain than it is.
//
// inForce/supersededBy drive the graph prune: a retired card can never reach
// the model, so it can never be quoted at a citizen.

export const RULES = [
  // ---------------------------------------------------------------- eligibility
  {
    id: "INCOME-RURAL",
    topic: ["eligibility", "income", "rural"],
    en: { title: "Income limit — rural", body: "Annual family income must be below ₹1,50,000 for rural applicants." },
    te: { title: "ఆదాయ పరిమితి — గ్రామీణ", body: "గ్రామీణ ప్రాంతాల్లో కుటుంబ వార్షిక ఆదాయం ₹1,50,000 కంటే తక్కువ ఉండాలి." },
    sourceKind: "reported", confidence: "medium",
    source: "Telangana FSC eligibility, as published across public guides",
    effectiveFrom: "2024-01-01", inForce: true, supersedes: ["INCOME-RURAL-OLD"],
  },
  {
    id: "INCOME-RURAL-OLD",
    topic: ["eligibility", "income", "rural"],
    en: { title: "Income limit — rural (RETIRED)", body: "Earlier rural ceiling of ₹1,00,000 per year." },
    te: { title: "ఆదాయ పరిమితి — గ్రామీణ (రద్దు)", body: "గతంలో గ్రామీణ పరిమితి సంవత్సరానికి ₹1,00,000." },
    sourceKind: "assumed", confidence: "low",
    source: "Illustrative retired rule — included to demonstrate supersession pruning",
    effectiveFrom: "2016-01-01", inForce: false, supersededBy: "INCOME-RURAL",
  },
  {
    id: "INCOME-URBAN",
    topic: ["eligibility", "income", "urban"],
    en: {
      title: "Income limit — urban",
      body: "Annual family income must be below ₹2,00,000 for urban applicants. NOTE: public sources disagree — some state ₹2,50,000. We apply the stricter ₹2,00,000 and flag the conflict rather than guess.",
    },
    te: {
      title: "ఆదాయ పరిమితి — పట్టణ",
      body: "పట్టణ ప్రాంతాల్లో కుటుంబ వార్షిక ఆదాయం ₹2,00,000 కంటే తక్కువ ఉండాలి. గమనిక: కొన్ని వెబ్‌సైట్లు ₹2,50,000 అని చెబుతున్నాయి. మేము కఠినమైన ₹2,00,000 వాడుతున్నాము, ఈ తేడాను మీకు చూపిస్తున్నాము.",
    },
    sourceKind: "reported", confidence: "low",
    source: "CONFLICT observed live: two public sources give ₹2L and ₹2.5L",
    effectiveFrom: "2024-01-01", inForce: true, conflict: true,
  },
  {
    id: "LAND-LIMIT",
    topic: ["eligibility", "land"],
    en: { title: "Land holding limit", body: "Applicant must not hold more than 3.5 acres of wetland or 7.5 acres of dryland." },
    te: { title: "భూమి పరిమితి", body: "దరఖాస్తుదారుకు 3.5 ఎకరాల మాగాణి లేదా 7.5 ఎకరాల మెట్ట భూమి కంటే ఎక్కువ ఉండకూడదు." },
    sourceKind: "reported", confidence: "medium",
    source: "Telangana FSC land-holding criteria, public guides",
    effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "EXCL-INCOMETAX",
    topic: ["eligibility", "exclusion"],
    en: { title: "Exclusion — income tax payer", body: "Families where a member pays income tax are not eligible." },
    te: { title: "మినహాయింపు — ఆదాయపు పన్ను", body: "కుటుంబంలో ఎవరైనా ఆదాయపు పన్ను చెల్లిస్తుంటే అర్హత ఉండదు." },
    sourceKind: "reported", confidence: "high",
    source: "Standard NFSA/state exclusion, widely published",
    effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "EXCL-GOVTJOB",
    topic: ["eligibility", "exclusion"],
    en: { title: "Exclusion — government employee", body: "Families with a regular government employee are generally excluded. Sanitation workers, outsourced and contract staff are commonly treated as eligible." },
    te: { title: "మినహాయింపు — ప్రభుత్వ ఉద్యోగి", body: "రెగ్యులర్ ప్రభుత్వ ఉద్యోగి ఉన్న కుటుంబాలకు సాధారణంగా అర్హత ఉండదు. పారిశుద్ధ్య కార్మికులు, ఔట్‌సోర్సింగ్, కాంట్రాక్ట్ సిబ్బందికి సాధారణంగా అర్హత ఉంటుంది." },
    sourceKind: "assumed", confidence: "low",
    source: "UNVERIFIED carve-out. Do not rely on the exception without checking the GO.",
    effectiveFrom: "2024-01-01", inForce: true, needsVerification: true,
  },
  {
    id: "EXCL-DUPLICATE",
    topic: ["eligibility", "exclusion", "duplicate"],
    en: { title: "One card per family", body: "A family may hold only one active Food Security Card, in Telangana or any other state. Holding another card is a valid ground for rejection." },
    te: { title: "కుటుంబానికి ఒకే కార్డు", body: "ఒక కుటుంబానికి తెలంగాణలో గానీ, వేరే రాష్ట్రంలో గానీ ఒకే యాక్టివ్ ఫుడ్ సెక్యూరిటీ కార్డు మాత్రమే ఉండాలి." },
    sourceKind: "official", confidence: "high",
    source: "Stated on Telangana FSC eligibility guidance",
    effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "RESIDENCY",
    topic: ["eligibility", "residency"],
    en: { title: "Residency", body: "Applicant must be a resident of Telangana." },
    te: { title: "నివాసం", body: "దరఖాస్తుదారు తెలంగాణ నివాసి అయి ఉండాలి." },
    sourceKind: "official", confidence: "high",
    source: "Telangana FSC eligibility", effectiveFrom: "2024-01-01", inForce: true,
  },

  // ---------------------------------------------------------------- money
  {
    id: "FEE",
    topic: ["fee", "meeseva", "cost"],
    en: {
      title: "What it should cost",
      body: "The official MeeSeva charge for a ration card application is about ₹45. Press reports document centres charging ₹250–₹500 and issuing no receipt. Paying more than the notified fee is not required, and you are entitled to a receipt for whatever you pay.",
    },
    te: {
      title: "అసలు ఖర్చు ఎంత",
      body: "మీసేవలో రేషన్ కార్డు దరఖాస్తుకు అధికారిక రుసుము సుమారు ₹45. కొన్ని కేంద్రాలు ₹250–₹500 వసూలు చేస్తున్నాయని, రసీదు ఇవ్వడం లేదని వార్తలు చెబుతున్నాయి. నోటిఫై చేసిన రుసుము కంటే ఎక్కువ చెల్లించాల్సిన అవసరం లేదు. మీరు చెల్లించిన దానికి రసీదు అడిగే హక్కు మీకు ఉంది.",
    },
    sourceKind: "reported", confidence: "high",
    source: "The Hans India, Munsif Daily, Deccan Chronicle (Aug 2026 reporting)",
    effectiveFrom: "2025-01-01", inForce: true,
  },

  // ---------------------------------------------------------------- documents
  {
    id: "DOCS-NEW",
    topic: ["documents", "new"],
    en: { title: "Documents — new card", body: "Aadhaar of every family member, proof of residence, income declaration, passport photo of the head of family, and bank passbook of the head of family." },
    te: { title: "పత్రాలు — కొత్త కార్డు", body: "కుటుంబ సభ్యులందరి ఆధార్, నివాస ధ్రువీకరణ, ఆదాయ ప్రకటన, కుటుంబ పెద్ద ఫోటో, కుటుంబ పెద్ద బ్యాంక్ పాస్‌బుక్." },
    sourceKind: "reported", confidence: "medium",
    source: "MeeSeva FSC application guidance", effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "DOCS-NEWBORN",
    topic: ["documents", "add", "child", "newborn"],
    en: { title: "Documents — adding a child", body: "Birth certificate of the child, child's Aadhaar if issued, and the existing family card. Aadhaar is not always available for infants; the birth certificate is the primary document." },
    te: { title: "పత్రాలు — పిల్లల పేరు చేర్చడానికి", body: "పిల్లల జనన ధ్రువీకరణ పత్రం, ఆధార్ ఉంటే అది, ప్రస్తుత కుటుంబ కార్డు. చిన్న పిల్లలకు ఆధార్ ఉండకపోవచ్చు — జనన ధ్రువీకరణ పత్రమే ముఖ్యం." },
    sourceKind: "reported", confidence: "medium",
    source: "MeeSeva FSC correction form guidance", effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "DOCS-MARRIAGE",
    topic: ["documents", "add", "marriage", "wife"],
    en: { title: "Documents — adding a spouse after marriage", body: "Marriage certificate, spouse's Aadhaar, and proof that the spouse's name has been removed from the parents' card. The removal must complete before the addition, otherwise the duplicate check will reject you." },
    te: { title: "పత్రాలు — పెళ్లి తర్వాత భార్య/భర్త పేరు చేర్చడానికి", body: "వివాహ ధ్రువీకరణ పత్రం, ఆధార్, మరియు పుట్టింటి కార్డు నుండి పేరు తొలగించినట్టు ఆధారం. ముందు తొలగింపు పూర్తి కావాలి, లేకపోతే 'డూప్లికేట్' అని తిరస్కరిస్తారు." },
    sourceKind: "reported", confidence: "medium",
    source: "Common MeeSeva practice; sequencing inferred from duplicate-rejection rule",
    effectiveFrom: "2024-01-01", inForce: true, needsVerification: true,
  },

  // ---------------------------------------------------------------- entitlement
  {
    id: "ENTITLEMENT",
    topic: ["entitlement", "rice", "quantity"],
    en: { title: "What you receive", body: "6 kg of rice per person per month under a Food Security Card. Antyodaya (AAY) households receive 35 kg per family per month regardless of family size." },
    te: { title: "మీకు ఎంత వస్తుంది", body: "ఫుడ్ సెక్యూరిటీ కార్డుపై ఒక్కో వ్యక్తికి నెలకు 6 కిలోల బియ్యం. అంత్యోదయ (AAY) కుటుంబాలకు కుటుంబ పరిమాణంతో సంబంధం లేకుండా నెలకు 35 కిలోలు." },
    sourceKind: "official", confidence: "high",
    source: "Telangana Civil Supplies / district portals", effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "EKYC",
    topic: ["ekyc", "aadhaar", "biometric"],
    en: { title: "e-KYC is mandatory", body: "Every member on the card must complete Aadhaar-based e-KYC. Members who do not complete it risk removal from the card." },
    te: { title: "ఈ-కేవైసీ తప్పనిసరి", body: "కార్డులోని ప్రతి సభ్యుడు ఆధార్ ఆధారిత ఈ-కేవైసీ పూర్తి చేయాలి. చేయకపోతే కార్డు నుండి పేరు తొలగించే ప్రమాదం ఉంది." },
    sourceKind: "official", confidence: "high",
    source: "Telangana Civil Supplies e-KYC drive", effectiveFrom: "2026-01-01", inForce: true,
  },
  {
    id: "AADHAAR-NOT-SOLE-GROUND",
    topic: ["ekyc", "aadhaar", "biometric", "rights", "denial"],
    en: {
      title: "Aadhaar failure alone cannot deny you",
      body: "Central instructions direct states not to deny PDS benefits solely because a beneficiary lacks Aadhaar or has not linked it. If biometric authentication fails, alternate means should be offered.",
    },
    te: {
      title: "ఆధార్ పని చేయకపోతే మాత్రమే నిరాకరించలేరు",
      body: "ఆధార్ లేదని లేదా లింక్ చేయలేదని మాత్రమే రేషన్ నిరాకరించవద్దని కేంద్రం రాష్ట్రాలకు సూచించింది. వేలిముద్ర పడకపోతే ప్రత్యామ్నాయ మార్గం ఇవ్వాలి.",
    },
    sourceKind: "reported", confidence: "medium",
    source: "Central directive to states, as reported (Deccan Herald)",
    effectiveFrom: "2024-01-01", inForce: true,
  },

  // ---------------------------------------------------------------- process & rights
  {
    id: "TIMELINE",
    topic: ["status", "timeline", "pending", "delay", "waiting", "long", "received", "arrived"],
    en: { title: "How long it should take", body: "Application, verification and issuance are described as taking around 30 days. Cases pending far beyond this are common and are a grievance, not a normal wait." },
    te: { line: "", title: "ఎంత సమయం పట్టాలి", body: "దరఖాస్తు, విచారణ, కార్డు జారీ సుమారు 30 రోజుల్లో పూర్తి కావాలి. దీనికి మించి పెండింగ్‌లో ఉంటే అది సాధారణ ఆలస్యం కాదు — ఫిర్యాదు చేయదగిన విషయం." },
    sourceKind: "reported", confidence: "medium",
    source: "Processing timeline stated in public application guides",
    effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "APPEAL-DGRO",
    topic: ["rights", "appeal", "grievance", "pending", "rejected"],
    en: {
      title: "Your right to appeal",
      body: "Under the National Food Security Act, every district has a District Grievance Redressal Officer (DGRO) you can appeal to, and each state has a State Food Commission above that. A long-pending or wrongly rejected application is a grievance you can formally escalate — you do not have to keep waiting.",
    },
    te: {
      title: "అప్పీలు చేసే మీ హక్కు",
      body: "జాతీయ ఆహార భద్రతా చట్టం ప్రకారం ప్రతి జిల్లాలో జిల్లా ఫిర్యాదుల పరిష్కార అధికారి (DGRO) ఉంటారు, ఆ పైన రాష్ట్ర ఆహార కమిషన్ ఉంటుంది. చాలా కాలం పెండింగ్‌లో ఉన్నా, తప్పుగా తిరస్కరించినా — మీరు అధికారికంగా అప్పీలు చేయవచ్చు. ఎదురుచూస్తూ ఉండాల్సిన అవసరం లేదు.",
    },
    sourceKind: "official", confidence: "high",
    source: "National Food Security Act, 2013 — grievance redressal machinery",
    effectiveFrom: "2013-09-10", inForce: true,
  },
  {
    id: "GRIEVANCE-CHANNELS",
    topic: ["rights", "grievance", "complaint", "helpline"],
    en: { title: "Where to complain", body: "EPDS Telangana portal — 'Grievance Redressal System for E2E PDS'. Toll-free helpline 1800-4250-0333. District Supply Office for in-person escalation." },
    te: { title: "ఎక్కడ ఫిర్యాదు చేయాలి", body: "EPDS తెలంగాణ పోర్టల్‌లో 'Grievance Redressal System for E2E PDS'. టోల్ ఫ్రీ నంబర్ 1800-4250-0333. లేదా జిల్లా సప్లై ఆఫీసు." },
    sourceKind: "official", confidence: "high",
    source: "EPDS Telangana portal + published helpline",
    effectiveFrom: "2024-01-01", inForce: true,
  },


  // ---------------------------------------------------------------- status & waiting
  {
    id: "TRACK-STATUS",
    topic: ["status", "track", "check", "pending", "application", "received", "arrived"],
    en: { title: "How to check your status", body: "Track an application on the EPDS Telangana portal using your application or acknowledgement number. Keep that number safe — without it, tracking is difficult and the office will ask for it first." },
    te: { title: "మీ దరఖాస్తు స్థితి ఎలా చూడాలి", body: "EPDS తెలంగాణ పోర్టల్‌లో మీ దరఖాస్తు నంబర్ లేదా రసీదు నంబర్‌తో స్థితి చూడవచ్చు. ఆ నంబర్ జాగ్రత్తగా ఉంచుకోండి — అది లేకుండా ట్రాక్ చేయడం కష్టం, ఆఫీసులో కూడా మొదట అదే అడుగుతారు." },
    sourceKind: "official", confidence: "high",
    source: "EPDS Telangana portal — application status service",
    effectiveFrom: "2024-01-01", inForce: true,
  },
  {
    id: "STATUS-MEANINGS",
    topic: ["status", "pending", "process", "meaning", "verification", "approved", "received"],
    en: {
      title: "What the status words mean",
      body: "\"Under process\" means your application has been accepted but no decision is recorded yet. \"Field verification pending\" means an officer is meant to visit — often nobody has. \"Approved\" means the card exists in the system, which is not the same as it being in your hand. These readings are our interpretation of common usage, not an official glossary.",
    },
    te: {
      title: "స్థితిలో ఉన్న మాటలకు అర్థం",
      body: "\"అండర్ ప్రాసెస్\" అంటే మీ దరఖాస్తు స్వీకరించారు, కానీ ఇంకా నిర్ణయం నమోదు కాలేదు. \"ఫీల్డ్ వెరిఫికేషన్ పెండింగ్\" అంటే అధికారి రావాల్సి ఉంది — చాలాసార్లు ఎవరూ రారు. \"అప్రూవ్డ్\" అంటే సిస్టమ్‌లో కార్డు ఉంది, అది మీ చేతికి వచ్చినట్టు కాదు. ఇవి సాధారణ వాడుక ఆధారంగా మా వివరణ, అధికారిక పదకోశం కాదు.",
    },
    sourceKind: "assumed", confidence: "low",
    source: "Our reading of commonly seen portal statuses. No official glossary was found.",
    effectiveFrom: "2024-01-01", inForce: true, needsVerification: true,
  },
  {
    id: "NOT-RECEIVED",
    topic: ["received", "arrived", "delivered", "collect", "printed", "approved", "status", "card"],
    en: {
      title: "Approved, but the card has not reached you",
      body: "An approved card still has to be printed and handed over, usually through your Fair Price Shop dealer or the Mandal office. If the portal shows approved but you have nothing in hand, ask the dealer first, then the Mandal Revenue Office, carrying your application number. Being approved is proof enough to ask.",
    },
    te: {
      title: "అప్రూవ్ అయ్యింది కానీ కార్డు చేతికి రాలేదు",
      body: "అప్రూవ్ అయిన కార్డును ప్రింట్ చేసి ఇవ్వాల్సి ఉంటుంది — సాధారణంగా మీ రేషన్ దుకాణం డీలర్ ద్వారా లేదా మండల ఆఫీసు ద్వారా. పోర్టల్‌లో అప్రూవ్డ్ అని ఉండి చేతికి రాకపోతే, ముందు డీలర్‌ను, తర్వాత మండల రెవెన్యూ ఆఫీసును దరఖాస్తు నంబర్‌తో అడగండి. అప్రూవ్ అయిందనే ఆధారం సరిపోతుంది.",
    },
    sourceKind: "reported", confidence: "medium",
    source: "Common distribution practice through FPS dealers and Mandal offices",
    effectiveFrom: "2024-01-01", inForce: true, needsVerification: true,
  },
  {
    id: "DELAY-LADDER",
    topic: ["delay", "pending", "waiting", "months", "years", "escalate", "status", "received"],
    en: {
      title: "If it has been pending too long",
      body: "Escalate in this order, keeping your application number and every acknowledgement: 1) the MeeSeva centre where you applied, 2) the Mandal Revenue Office or Tahsildar, 3) the District Supply Office, 4) the helpline 1800-4250-0333, 5) the District Grievance Redressal Officer under the National Food Security Act. A long wait is a grievance, not a queue — you do not have to keep waiting quietly.",
    },
    te: {
      title: "చాలా కాలం పెండింగ్‌లో ఉంటే",
      body: "ఈ వరుసలో పైకి తీసుకెళ్లండి — దరఖాస్తు నంబర్, ప్రతి రసీదు జాగ్రత్తగా ఉంచుకుని: 1) దరఖాస్తు చేసిన మీసేవ కేంద్రం, 2) మండల రెవెన్యూ ఆఫీసు / తహసీల్దార్, 3) జిల్లా సప్లై ఆఫీసు, 4) హెల్ప్‌లైన్ 1800-4250-0333, 5) ఆహార భద్రతా చట్టం ప్రకారం జిల్లా ఫిర్యాదుల పరిష్కార అధికారి. ఎక్కువ కాలం ఆగడం అంటే క్యూ కాదు — అది ఫిర్యాదు చేయదగిన విషయం. మౌనంగా ఎదురుచూడాల్సిన అవసరం లేదు.",
    },
    sourceKind: "official", confidence: "high",
    source: "NFSA 2013 grievance machinery + published Telangana channels",
    effectiveFrom: "2013-09-10", inForce: true,
  },
  {
    id: "ACK-SLIP",
    topic: ["acknowledgement", "receipt", "slip", "proof", "application", "meeseva"],
    en: {
      title: "You are entitled to an acknowledgement",
      body: "Whenever you submit an application or pay a fee, ask for an acknowledgement slip with a number on it. Press reports document MeeSeva centres taking money and issuing nothing. Without that number you cannot track your application, and you cannot prove you ever applied.",
    },
    te: {
      title: "రసీదు అడిగే హక్కు మీకు ఉంది",
      body: "దరఖాస్తు ఇచ్చినప్పుడు, డబ్బు కట్టినప్పుడు — నంబర్ ఉన్న రసీదు తప్పకుండా అడగండి. కొన్ని మీసేవ కేంద్రాలు డబ్బు తీసుకుని ఏమీ ఇవ్వడం లేదని వార్తలు ఉన్నాయి. ఆ నంబర్ లేకపోతే మీరు స్థితి చూడలేరు, దరఖాస్తు చేశారని నిరూపించనూ లేరు.",
    },
    sourceKind: "reported", confidence: "high",
    source: "The Hans India, Munsif Daily (Aug 2026) on centres issuing no receipts",
    effectiveFrom: "2025-01-01", inForce: true,
  },
  {
    id: "REAPPLY",
    topic: ["reapply", "again", "duplicate", "pending", "application", "status"],
    en: {
      title: "Applying again while one is pending",
      body: "Do not file a second application while the first is still open. A duplicate entry is a common ground for rejecting both. Chase the existing application number instead — and if it is genuinely lost, ask the office to record that in writing before you re-apply.",
    },
    te: {
      title: "ఒకటి పెండింగ్‌లో ఉండగా మళ్లీ దరఖాస్తు",
      body: "మొదటి దరఖాస్తు ఇంకా ఉండగా రెండోది పెట్టవద్దు. డూప్లికేట్ అని రెండూ తిరస్కరించే ప్రమాదం ఉంది. బదులుగా ఉన్న దరఖాస్తు నంబర్‌నే వెంబడించండి — నిజంగా పోయిందని తేలితే, మళ్లీ దరఖాస్తు చేసే ముందు ఆ విషయాన్ని ఆఫీసులో రాతపూర్వకంగా నమోదు చేయించండి.",
    },
    sourceKind: "assumed", confidence: "low",
    source: "Inferred from the duplicate-rejection rule. Not stated in a GO we have seen.",
    effectiveFrom: "2024-01-01", inForce: true, needsVerification: true,
  },
  {
    id: "NAME-CORRECTION",
    topic: ["correction", "name", "wrong", "spelling", "change", "mismatch", "aadhaar", "dob"],
    en: {
      title: "Wrong name, age or details on the card",
      body: "Corrections go through the MeeSeva 'Correction in Food Security Card' form, with proof of the correct detail — Aadhaar for a name or date of birth. A name that does not match Aadhaar is a frequent cause of later rejections and eKYC failures, so it is worth fixing before it blocks something else.",
    },
    te: {
      title: "కార్డులో పేరు, వయసు, వివరాలు తప్పుగా ఉంటే",
      body: "మీసేవలో 'ఫుడ్ సెక్యూరిటీ కార్డు కరెక్షన్' ఫారం ద్వారా సరిచేయవచ్చు — సరైన వివరానికి ఆధారం జతచేయాలి (పేరు, పుట్టిన తేదీకి ఆధార్). ఆధార్‌తో పేరు సరిపోకపోతే తర్వాత తిరస్కరణలు, ఈ-కేవైసీ వైఫల్యాలు వస్తాయి. అందుకే ఇంకేదైనా ఆగిపోయే ముందే సరిచేసుకోవడం మంచిది.",
    },
    sourceKind: "reported", confidence: "medium",
    source: "MeeSeva FSC correction form guidance",
    effectiveFrom: "2024-01-01", inForce: true,
  },

  // ---------------------------------------------------------------- linked schemes (blast radius)
  {
    id: "LINK-AAROGYASRI", topic: ["linked", "health"],
    en: { title: "Aarogyasri", body: "Health cover. The Food Security Card is used as the eligibility document." },
    te: { title: "ఆరోగ్యశ్రీ", body: "ఆరోగ్య బీమా. అర్హత పత్రంగా ఫుడ్ సెక్యూరిటీ కార్డు వాడతారు." },
    sourceKind: "reported", confidence: "medium",
    source: "News reporting on schemes unlocked by new ration cards",
    effectiveFrom: "2024-01-01", inForce: true, scheme: true,
  },
  {
    id: "LINK-INDIRAMMA", topic: ["linked", "housing"],
    en: { title: "Indiramma Indlu", body: "Housing scheme. Ration card is listed among required documents." },
    te: { title: "ఇందిరమ్మ ఇళ్లు", body: "ఇళ్ల పథకం. అవసరమైన పత్రాల్లో రేషన్ కార్డు ఉంది." },
    sourceKind: "reported", confidence: "medium",
    source: "Indiramma Housing scheme document list", effectiveFrom: "2024-01-01", inForce: true, scheme: true,
  },
  {
    id: "LINK-FEEREIMB", topic: ["linked", "education"],
    en: { title: "Fee reimbursement", body: "Student tuition reimbursement, reported as unlocked by holding a ration card." },
    te: { title: "ఫీజు రీయింబర్స్‌మెంట్", body: "విద్యార్థుల ఫీజు తిరిగి చెల్లింపు — రేషన్ కార్డుతో ముడిపడి ఉంది." },
    sourceKind: "reported", confidence: "medium",
    source: "News reporting on new ration card benefits", effectiveFrom: "2024-01-01", inForce: true, scheme: true,
  },
  {
    id: "LINK-CYLINDER", topic: ["linked", "lpg"],
    en: { title: "₹500 gas cylinder", body: "Subsidised LPG, reported as linked to ration card eligibility." },
    te: { title: "₹500 గ్యాస్ సిలిండర్", body: "సబ్సిడీ గ్యాస్ — రేషన్ కార్డు అర్హతతో ముడిపడి ఉంది." },
    sourceKind: "reported", confidence: "medium",
    source: "News reporting on new ration card benefits", effectiveFrom: "2024-01-01", inForce: true, scheme: true,
  },
  {
    id: "LINK-POWER", topic: ["linked", "electricity"],
    en: { title: "Free electricity (200 units)", body: "Reported as linked to ration card eligibility." },
    te: { title: "ఉచిత విద్యుత్ (200 యూనిట్లు)", body: "రేషన్ కార్డు అర్హతతో ముడిపడి ఉందని వార్తలు." },
    sourceKind: "reported", confidence: "medium",
    source: "News reporting on new ration card benefits", effectiveFrom: "2024-01-01", inForce: true, scheme: true,
  },
  {
    id: "LINK-KALYANALAKSHMI", topic: ["linked", "marriage"],
    en: { title: "Kalyana Lakshmi / Shaadi Mubarak", body: "Marriage assistance. Income-linked; ration card is commonly used as supporting proof." },
    te: { title: "కళ్యాణ లక్ష్మి / షాదీ ముబారక్", body: "వివాహ సహాయం. ఆదాయంతో ముడిపడినది; రేషన్ కార్డును ఆధారంగా వాడతారు." },
    sourceKind: "assumed", confidence: "low",
    source: "Scheme is income-linked; the ration-card dependency is our inference",
    effectiveFrom: "2024-01-01", inForce: true, scheme: true, needsVerification: true,
  },
];

// ---------------------------------------------------------------- rejection codes
export const REJECTION_CODES = [
  {
    code: "INCOME",
    match: ["income", "ఆదాయ"],
    en: { plain: "They believe your family earns more than the limit.", check: "Was your income actually assessed, or assumed from your job type?", fix: "Get an income certificate from the Tahsildar showing your real annual income, then re-apply." },
    te: { plain: "మీ కుటుంబ ఆదాయం పరిమితి కంటే ఎక్కువ ఉందని వారు భావిస్తున్నారు.", check: "నిజంగా మీ ఆదాయాన్ని లెక్కించారా, లేక మీ ఉద్యోగాన్ని చూసి ఊహించారా?", fix: "తహసీల్దార్ నుండి ఆదాయ ధ్రువీకరణ పత్రం తీసుకుని మళ్లీ దరఖాస్తు చేయండి." },
    rules: ["INCOME-RURAL", "INCOME-URBAN"], oftenWrong: true,
  },
  {
    code: "DUPLICATE",
    match: ["duplicate", "already", "డూప్లికేట్"],
    en: { plain: "Their system found your name on another card.", check: "Very common after marriage — your old card entry may not have been removed yet. That is a sequencing problem, not fraud.", fix: "First get the name removed from the old card, collect that acknowledgement, then apply again with it attached." },
    te: { plain: "మీ పేరు వేరే కార్డులో ఉందని వారి సిస్టమ్ చూపిస్తోంది.", check: "పెళ్లి తర్వాత ఇది చాలా సాధారణం — పాత కార్డు నుండి పేరు ఇంకా తొలగించి ఉండకపోవచ్చు. ఇది వరుస క్రమం సమస్య, మోసం కాదు.", fix: "ముందు పాత కార్డు నుండి పేరు తొలగించి, ఆ రసీదు తీసుకుని, దాన్ని జతచేసి మళ్లీ దరఖాస్తు చేయండి." },
    rules: ["EXCL-DUPLICATE", "DOCS-MARRIAGE"], oftenWrong: true,
  },
  {
    code: "DOCUMENTS",
    match: ["document", "missing", "పత్ర"],
    en: { plain: "A required document was missing or unreadable.", check: "They rarely say which one.", fix: "Take the full document list below and re-submit. Ask the operator to name the missing document in writing." },
    te: { plain: "అవసరమైన పత్రం లేదు లేదా చదవడానికి రాలేదు.", check: "ఏ పత్రం అనేది వారు చెప్పరు.", fix: "కింద ఇచ్చిన పూర్తి జాబితాతో మళ్లీ సమర్పించండి. ఏ పత్రం లేదో రాతపూర్వకంగా అడగండి." },
    rules: ["DOCS-NEW"], oftenWrong: false,
  },
  {
    code: "VERIFICATION",
    match: ["verification", "field", "విచారణ"],
    en: { plain: "The field verification was not completed.", check: "Often means nobody visited, not that you failed.", fix: "This is a grievance. Escalate to the District Supply Office and, if unresolved, to the DGRO." },
    te: { plain: "క్షేత్రస్థాయి విచారణ పూర్తి కాలేదు.", check: "చాలాసార్లు ఎవరూ రాలేదు అని అర్థం — మీరు విఫలమయ్యారని కాదు.", fix: "ఇది ఫిర్యాదు చేయదగినది. జిల్లా సప్లై ఆఫీసుకు, పరిష్కారం కాకపోతే DGROకు తీసుకెళ్లండి." },
    rules: ["TIMELINE", "APPEAL-DGRO"], oftenWrong: true,
  },
];

export const inForceRules = () => RULES.filter((r) => r.inForce);
export const ruleById = (id) => RULES.find((r) => r.id === id);
export const schemeRules = () => RULES.filter((r) => r.scheme && r.inForce);
