// Canned results for DEMO mode (no API key). They match SAMPLE_REPORT in public/app.js.
// NOTE: the Yoruba, Igbo and Hausa text is a best-effort draft and MUST be reviewed by a native speaker
// before being shown to anyone. That is why language_confidence is "low" for those three.

const KEY_TERMS = {
  en: [
    { term: "Invasive ductal carcinoma", meaning: "The most common type of breast cancer. It started in the milk ducts and grew into nearby breast tissue." },
    { term: "Grade 2", meaning: "The cancer cells look somewhat different from normal cells and are growing at a medium speed." },
    { term: "ER positive", meaning: "The cancer cells have receptors that use the hormone oestrogen to grow. This often means hormone-blocking medicine can be an option, which your doctor will discuss." },
    { term: "HER2 negative", meaning: "The cancer cells do not have extra HER2 protein. This tells your doctors which treatments are likely to suit you." },
    { term: "Margins clear", meaning: "No cancer cells were seen at the edge of the tissue that was removed." },
    { term: "Lymph node", meaning: "A small gland that filters fluid in the body. Cancer can sometimes spread there first." },
  ],
  pcm: [
    { term: "Invasive ductal carcinoma", meaning: "Na the most common type of breast cancer. E start from the milk pipe dem, then e enter the breast flesh wey dey near am." },
    { term: "Grade 2", meaning: "The cancer cells no look like normal cells well, and dem dey grow at medium speed." },
    { term: "ER positive", meaning: "The cancer cells dey use one hormone wey dem call oestrogen to grow. Sometimes, medicine wey go block that hormone fit help. Your doctor go talk about am." },
    { term: "HER2 negative", meaning: "The cancer cells no get extra HER2 protein. This one dey help doctor know which treatment fit work for you." },
    { term: "Margins clear", meaning: "Dem no see cancer cells for the edge of the part wey dem comot." },
    { term: "Lymph node", meaning: "Na small gland wey dey clean water for body. Cancer fit reach there first sometimes." },
  ],
  yo: [
    { term: "Invasive ductal carcinoma", meaning: "Ó jẹ́ irú àrùn jẹjẹrẹ ọmú tó wọ́pọ̀ jù. Ó bẹ̀rẹ̀ láti inú ọ̀nà wàrà, ó sì tàn sí ara ọmú tó wà nítòsí." },
    { term: "Grade 2", meaning: "Àwọn sẹ́ẹ̀lì àrùn náà yàtọ̀ díẹ̀ sí sẹ́ẹ̀lì àdáyébá, wọ́n sì ń dàgbà ní ìwọ̀nba." },
    { term: "ER positive", meaning: "Àwọn sẹ́ẹ̀lì àrùn náà ń lo họ́mọ̀nù oestrogen láti dàgbà. Dókítà rẹ yóò bá ọ sọ̀rọ̀ nípa oògùn tó lè dènà rẹ̀." },
    { term: "HER2 negative", meaning: "Àwọn sẹ́ẹ̀lì àrùn náà kò ní HER2 protein tó pọ̀jù. Èyí ń ran àwọn dókítà lọ́wọ́ láti mọ ìtọ́jú tó yẹ." },
    { term: "Margins clear", meaning: "Wọn kò rí sẹ́ẹ̀lì àrùn ní etí ibi tí wọ́n gé kúrò." },
    { term: "Lymph node", meaning: "Ẹṣẹ́ kékeré tó ń ṣe àlẹ̀ omi inú ara. Àrùn jẹjẹrẹ lè tàn dé ibẹ̀ ná." },
  ],
  ig: [
    { term: "Invasive ductal carcinoma", meaning: "Ọ bụ ụdị kansa ara ara nwanyị kacha ewu ewu. Ọ malitere n'ọwa mmiri ara ma gbasaa n'ime anụ ahụ dị nso." },
    { term: "Grade 2", meaning: "Sel kansa ndị ahụ dị ntakịrị iche na sel nkịtị, ha na-eto n'ọkwa etiti." },
    { term: "ER positive", meaning: "Sel kansa ndị ahụ na-eji homonụ oestrogen eto. Dọkịta gị ga-agwa gị banyere ọgwụ nwere ike igbochi ya." },
    { term: "HER2 negative", meaning: "Sel kansa ndị ahụ enweghị HER2 protein ọzọ n'ọtụtụ. Nke a na-enyere ndị dọkịta aka ịmata ọgwụgwọ kwesịrị ekwesị." },
    { term: "Margins clear", meaning: "Ha ahụghị sel kansa n'ọnụ ebe a wepụrụ." },
    { term: "Lymph node", meaning: "Obere gland nke na-asacha mmiri n'ahụ. Kansa nwere ike ibu ụzọ gbasaa ebe ahụ." },
  ],
  ha: [
    { term: "Invasive ductal carcinoma", meaning: "Wannan shi ne nau'in ciwon daji na nono mafi yawa. Ya fara daga hanyoyin madara sannan ya yadu zuwa naman nono da ke kusa." },
    { term: "Grade 2", meaning: "Ƙwayoyin ciwon dajin sun ɗan bambanta da ƙwayoyin halitta na al'ada, kuma suna girma a matsakaicin gudu." },
    { term: "ER positive", meaning: "Ƙwayoyin ciwon dajin suna amfani da hormone ɗin oestrogen don girma. Likitanka zai yi maka bayani game da magungunan da ke iya hana shi." },
    { term: "HER2 negative", meaning: "Ƙwayoyin ciwon dajin ba su da ƙarin sinadarin HER2. Wannan yana taimaka wa likitoci su san maganin da ya dace." },
    { term: "Margins clear", meaning: "Ba a ga ƙwayoyin ciwon daji a gefen da aka cire ba." },
    { term: "Lymph node", meaning: "Ƙaramar gland ce da ke tace ruwa a jiki. Wani lokaci ciwon daji kan fara yaduwa zuwa can." },
  ],
};

const COPY = {
  en: {
    summary: "This report says a type of breast cancer called invasive ductal carcinoma was found. It is Grade 2, which means the cells are growing at a medium speed. The tumour was removed and no cancer cells were seen at the edges. One of the 12 lymph nodes that were checked had cancer in it. Your care team will explain what this means for you and what comes next.",
    questions: [
      "What stage is my cancer, and what does that mean for me?",
      "Because one lymph node had cancer, do I need more tests or scans?",
      "What treatments do you recommend next, and what are the possible side effects?",
      "Is hormone-blocking medicine an option for me, and for how long?",
      "How often will I need follow-up visits, and what should I watch for between visits?",
    ],
    help: "Contact your care team or go to the nearest hospital if you have severe pain, heavy bleeding, trouble breathing, a fever, or anything that worries you.",
  },
  pcm: {
    summary: "This report dey talk say dem see one type of breast cancer wey dem dey call invasive ductal carcinoma. E be Grade 2, wey mean say the cells dey grow for medium speed. Dem don comot the lump, and dem no see cancer cells for the edge. Dem check 12 lymph nodes, and one of dem get cancer. Your doctor go explain wetin this mean for you and wetin dem go do next.",
    questions: [
      "Which stage my cancer reach, and wetin e mean for me?",
      "Since one lymph node get cancer, I need more test or scan?",
      "Which treatment una recommend next, and wetin be the side effects?",
      "Hormone medicine fit work for me, and for how long I go take am?",
      "How often I go dey come for check-up, and wetin I suppose dey watch for between visits?",
    ],
    help: "Call your care team or run go the nearest hospital if you get serious pain, plenty bleeding, wahala to breathe, fever, or anything wey dey worry you.",
  },
  yo: {
    summary: "Ìwé yìí sọ pé wọ́n rí irú àrùn jẹjẹrẹ ọmú kan tí wọ́n ń pè ní invasive ductal carcinoma. Ó jẹ́ Grade 2, èyí túmọ̀ sí pé àwọn sẹ́ẹ̀lì náà ń dàgbà ní ìwọ̀nba. Wọ́n ti yọ ìkókó náà kúrò, wọn kò sì rí sẹ́ẹ̀lì àrùn ní etí rẹ̀. Ọ̀kan nínú àwọn lymph node méjìlá tí wọ́n yẹ̀wò ní àrùn nínú. Àwọn dókítà rẹ yóò ṣàlàyé ohun tí èyí túmọ̀ sí fún ọ àti ohun tó kàn.",
    questions: [
      "Ipele wo ni àrùn mi wà, kí ni èyí túmọ̀ sí fún mi?",
      "Nítorí pé lymph node kan ní àrùn, ṣé mo nílò àyẹ̀wò tàbí scan míì?",
      "Ìtọ́jú wo ni ẹ gbà mí nímọ̀ràn, kí sì ni àwọn àbájáde rẹ̀?",
      "Ṣé oògùn tó ń dènà họ́mọ̀nù yẹ fún mi, fún ìgbà wo?",
      "Ìgbà mélòó ni mo gbọ́dọ̀ padà wá fún àyẹ̀wò, kí sì ni kí n máa kíyèsí?",
    ],
    help: "Kàn sí àwọn dókítà rẹ tàbí lọ sí ilé ìwòsàn tó súnmọ́ ọ jù tí o bá ní ìrora líle, ẹ̀jẹ̀ tó ń ṣàn púpọ̀, ìṣòro mímí, ibà, tàbí ohunkóhun tó ń kọ ọ́ lẹ́nu.",
  },
  ig: {
    summary: "Akwụkwọ a na-ekwu na achọpụtara otu ụdị kansa ara ara nwanyị a na-akpọ invasive ductal carcinoma. Ọ bụ Grade 2, nke pụtara na sel ndị ahụ na-eto n'ọkwa etiti. Ewepụla ya, ahụghịkwa sel kansa n'ọnụ ya. Otu n'ime lymph nodes iri na abụọ a nwalere nwere kansa. Ndị dọkịta gị ga-akọwara gị ihe nke a pụtara maka gị na ihe na-esote.",
    questions: [
      "Kedu ogo kansa m dị, gịnịkwa bụ ihe ọ pụtara maka m?",
      "N'ihi na otu lymph node nwere kansa, achọrọ m nyocha ma ọ bụ scan ọzọ?",
      "Kedu ọgwụgwọ ị na-atụ aro, gịnịkwa bụ mmetụta ọ nwere ike inwe?",
      "Ọgwụ na-egbochi homonụ ọ dị mma maka m, ruo ogologo oge ole?",
      "Ugboro ole ka m ga-abịa maka nyocha, gịnịkwa ka m ga-ele anya?",
    ],
    help: "Kpọtụrụ ndị dọkịta gị ma ọ bụ gaa ụlọ ọgwụ kacha nso ma ọ bụrụ na ị nwere mgbu siri ike, ọbara na-asọpụta nke ukwuu, nsogbu iku ume, ọkụ ahụ, ma ọ bụ ihe ọ bụla na-echegbu gị.",
  },
  ha: {
    summary: "Wannan takarda ta ce an gano wani nau'in ciwon daji na nono da ake kira invasive ductal carcinoma. Mataki na 2 ne (Grade 2), wato ƙwayoyin suna girma a matsakaicin gudu. An cire shi, kuma ba a ga ƙwayoyin ciwon daji a gefensa ba. Ɗaya daga cikin lymph nodes goma sha biyu da aka duba yana da ciwon daji. Likitocinka za su yi maka bayani abin da wannan yake nufi gare ka da abin da zai biyo baya.",
    questions: [
      "Wane mataki ciwon dajina ya kai, kuma me hakan yake nufi gare ni?",
      "Tun da lymph node ɗaya yana da ciwon daji, ina buƙatar ƙarin gwaji ko scan?",
      "Wane magani kuke ba da shawara a gaba, kuma menene illolinsa?",
      "Maganin hana hormone zai dace da ni, kuma har na tsawon lokaci nawa?",
      "Sau nawa zan riƙa dawowa don dubawa, kuma me zan kula da shi a tsakanin ziyara?",
    ],
    help: "Tuntuɓi likitocinka ko ka je asibiti mafi kusa idan kana da zafi mai tsanani, zubar jini mai yawa, wahalar numfashi, zazzaɓi, ko duk wani abu da ke damunka.",
  },
};

const DEMO_RESULTS = {};
for (const lang of Object.keys(COPY)) {
  DEMO_RESULTS[lang] = {
    summary: COPY[lang].summary,
    key_terms: KEY_TERMS[lang],
    questions_for_doctor: COPY[lang].questions,
    when_to_get_help: COPY[lang].help,
    language_confidence: lang === "en" || lang === "pcm" ? "high" : "low",
  };
}

module.exports = { DEMO_RESULTS };
