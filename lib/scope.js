// Scope detection, kept out of the route so it can be tested without any network call.
//
// A retrieval score alone is too brittle: "time" matches the TIMELINE card, while
// "am I eligible" can score low. So a question is in scope if it contains a word
// from the domain, OR matches a rule card strongly.

const SCOPE_FLOOR = 4;
const DOMAIN = [
  // English
  "card","ration","fsc","food security","eligib","qualif","income","land","acre","gunta",
  "document","certificate","proof","fee","cost","charge","rupee","rice","kg","quintal",
  "apply","applic","reject","refus","pending","status","kyc","aadhaar","biometric",
  "fingerprint","meeseva","tahsildar","mro","dealer","shop","ration shop","member","name",
  "add","remove","delete","famil","appeal","grievance","complaint","portab","scheme",
  "aarogyasri","indiramma","cylinder","electricity","marriage","widow","death","died",
  "quota","entitle","subsid","bpl","aay","antyodaya","pds",
  // everyday phrasings that mean the card without naming it
  "not yet","did not get","didn't get","still waiting","has not come","hasn't come",
  "my name","add my","remove my","how do i apply","where do i apply","why was i",
  "రాలేదు","వచ్చిందా","రాలేదా","ఇవ్వలేదు","ఎక్కడ అప్లై","ఎలా అప్లై",
  // Telugu
  "కార్డు","రేషన్","అర్హత","ఆదాయ","భూమి","ఎకర","పత్ర","ధ్రువీకరణ","రుసుము","ఖర్చు","ఫీజు",
  "బియ్యం","కిలో","దరఖాస్తు","తిరస్కర","పెండింగ్","కేవైసీ","ఆధార్","వేలిముద్ర","మీసేవ",
  "తహసీల్దార్","సభ్యు","పేరు","చేర్చ","తొలగ","కుటుంబ","అప్పీలు","ఫిర్యాదు","పథక",
  "ఆరోగ్యశ్రీ","సిలిండర్","విద్యుత్","పెళ్లి","వివాహ","మరణ","దుకాణ","కోటా",
];
const inDomain = (q) => {
  const s = String(q).toLowerCase();
  return DOMAIN.some((w) => s.includes(w));
};

export { SCOPE_FLOOR, DOMAIN, inDomain };
