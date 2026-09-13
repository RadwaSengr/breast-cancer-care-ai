import { MEDICAL_SOURCES, type MedicalSource, type SupportedLanguage } from "../../../server/medicalKnowledge";

export type StaticCitation = {
  id: string;
  organization: string;
  title: string;
  url: string;
  label: string;
};

export type StaticAnswer = {
  answer: string;
  suggestedQuestions: string[];
  citations: StaticCitation[];
};

const suggestions = {
  ar: [
    "ما المتابعة المطلوبة بعد علاج سرطان الثدي؟",
    "ما الأعراض التي ينبغي أن أبلغ عنها فريقي؟",
    "ما أشكال الدعم المتاحة خلال التعافي؟",
  ],
  en: [
    "What follow-up is needed after breast-cancer treatment?",
    "Which symptoms should I report to my care team?",
    "What support is available during recovery?",
  ],
} as const;

function isInScope(question: string) {
  return /سرطان\s*الثدي|الثدي|استئصال|ماستكتومي|breast\s*cancer|breast|mastectomy|lumpectomy|mammogram|كيماوي|كيميائي|إشعاع|هرموني|مناعي|جراحة|خزعة|ورم|علاج|متابعة|ناجية|تعاف|تأهيل|أعراض|جرح|عدوى|حمى|حمي|حرارة|قشعريرة|الوذمة|دعم|حجز|بهية|chemotherapy|radiation|hormone|immunotherapy|oncology|biopsy|surgery|treatment|follow[- ]?up|survivorship|recovery|rehabilitation|symptom|wound|infection|fever|chills|lymphedema|support|bahya/i.test(question);
}

function chooseSources(question: string): MedicalSource[] {
  const normalized = question.toLowerCase();
  if (/حمى|حمي|حرارة|قشعريرة|عدوى|جرح|إفراز|fever|chills|infection|wound|drainage/i.test(normalized)) {
    return MEDICAL_SOURCES.filter(source => source.id === "nci-infection-neutropenia");
  }
  if (/بعد|متابعة|تعاف|ناجية|follow[- ]?up|survivorship|after\s*treatment|recovery/i.test(normalized)) {
    return MEDICAL_SOURCES.filter(source => ["nci-follow-up-care", "acs-breast-survivorship"].includes(source.id));
  }
  if (/بهية|حجز|موعد|فرع|خدمات|16602|bahya|booking|appointment|branch|support/i.test(normalized)) {
    return MEDICAL_SOURCES.filter(source => source.id === "baheya-egypt-patient-journey");
  }
  const ranked = MEDICAL_SOURCES.map(source => ({
    source,
    score: source.keywords.reduce((score, keyword) => score + (normalized.includes(keyword.toLowerCase()) ? 1 : 0), 0),
  })).sort((a, b) => b.score - a.score);
  const matched = ranked.filter(item => item.score > 0).slice(0, 2).map(item => item.source);
  return matched.length ? matched : MEDICAL_SOURCES.filter(source => ["who-breast-cancer", "nci-treatment-overview"].includes(source.id));
}

function citation(source: MedicalSource, language: SupportedLanguage): StaticCitation {
  return {
    id: source.id,
    organization: source.organization,
    title: source.title[language],
    url: source.url,
    label: source.citationLabel[language],
  };
}

export function answerFromBundledSources(question: string, language: SupportedLanguage): StaticAnswer {
  if (!isInScope(question)) {
    const quoted = question.replace(/[\r\n]+/g, " ").trim().slice(0, 160);
    return {
      answer: language === "ar"
        ? `آسفة يا حبيبتي، مش هقدر أجاوب على «${quoted}». أنا هنا مخصوصة للرد على أسئلة عن سرطان الثدي، العلاج والتعافي وخدمات الدعم. أقدر أساعدك في المعلومات العامة الموثقة عن سرطان الثدي أو تجهيز أسئلة لفريق علاجكِ. سؤالك خارج هذا السياق.`
        : `I’m sorry, but I can’t answer “${quoted}.” I’m specifically here for breast cancer, treatment, recovery, and support services. I can help with general, source-based breast-cancer education or questions for your care team. This question is outside my scope.`,
      suggestedQuestions: [...suggestions[language]],
      citations: [],
    };
  }

  const sources = chooseSources(question).slice(0, 2);
  const urgent = /حمى|حمي|حرارة|قشعريرة|عدوى|جرح|إفراز|fever|chills|infection|wound|drainage/i.test(question);
  const content = sources.map(source => source.content[language]).join("\n\n");
  const sourceLinks = sources.map(source => `${source.citationLabel[language]} ${source.url}`).join(" · ");
  const safety = urgent ? (language === "ar"
    ? "إذا كانت لديكِ حرارة مقاسة أو قشعريرة أو احمرار أو تورم أو إفرازات من الجرح بعد الجراحة، تواصلي مع فريق الجراحة أو الأورام اليوم. عند الأعراض الشديدة أو صعوبة التنفس أو تدهور سريع، اطلبي الطوارئ فورًا. لا أستطيع تشخيص السبب أو وصف علاج."
    : "If you have a measured fever, chills, redness, swelling, or drainage from a surgical wound, contact your surgical or oncology team today. For severe symptoms, breathing difficulty, or rapid deterioration, seek emergency care. I cannot diagnose the cause or prescribe treatment.") : "";
  return {
    answer: `${safety ? `${safety}\n\n` : ""}${content}\n\n${language === "ar" ? "مصادر موثوقة:" : "Trusted sources:"} ${sourceLinks}`,
    suggestedQuestions: [...suggestions[language]],
    citations: sources.map(source => citation(source, language)),
  };
}

export { suggestions as STATIC_SUGGESTIONS };
