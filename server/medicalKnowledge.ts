export type SupportedLanguage = "ar" | "en";

export type MedicalSource = {
  id: string;
  organization: string;
  title: { ar: string; en: string };
  url: string;
  citationLabel: { ar: string; en: string };
  keywords: string[];
  content: { ar: string; en: string };
};

/**
 * Curated, short source records for the hackathon prototype.
 * These are educational summaries of the linked primary sources, not treatment instructions.
 */
export const MEDICAL_SOURCES: MedicalSource[] = [
  {
    id: "who-breast-cancer",
    organization: "World Health Organization",
    title: {
      ar: "منظمة الصحة العالمية: سرطان الثدي",
      en: "World Health Organization: Breast cancer",
    },
    url: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
    citationLabel: { ar: "[منظمة الصحة العالمية]", en: "[WHO]" },
    keywords: [
      "aftercare", "follow up", "follow-up", "recovery", "rehabilitation", "support",
      "الرعاية", "المتابعة", "التعافي", "التأهيل", "الدعم", "كتلة", "جرح",
    ],
    content: {
      ar: "تؤكد منظمة الصحة العالمية أن الرعاية الشاملة بعد علاج سرطان الثدي قد تشمل التأهيل والدعم النفسي والتغذوي ومشاركة فريق متعدد التخصصات. أي كتلة غير طبيعية أو جرح في الثدي لا يلتئم يحتاج إلى تقييم طبي، ولا ينبغي أن يحل التثقيف الصحي محل التقييم السريري.",
      en: "WHO notes that comprehensive breast-cancer care can include rehabilitation, psychosocial and nutritional support, and a multidisciplinary team. An abnormal breast lump or a breast wound that does not heal needs medical evaluation; patient education does not replace clinical assessment.",
    },
  },
  {
    id: "nci-breast-survivorship",
    organization: "National Cancer Institute",
    title: {
      ar: "المعهد الوطني للسرطان: الحياة بعد علاج سرطان الثدي",
      en: "National Cancer Institute: Breast Cancer Survivorship",
    },
    url: "https://www.cancer.gov/types/breast/breast-cancer-survivorship",
    citationLabel: { ar: "[المعهد الوطني للسرطان]", en: "[NCI]" },
    keywords: [
      "survivorship", "survivor", "follow-up", "late effects", "lymphedema", "recurrence", "body image", "fertility", "الناجية", "بعد العلاج", "متابعة", "آثار متأخرة", "الوذمة اللمفية", "عودة المرض", "صورة الجسم", "خصوبة",
    ],
    content: {
      ar: "يوفر المعهد الوطني للسرطان معلومات عامة لمن يعشن بعد علاج سرطان الثدي، وتشمل زيارات المتابعة والفحوصات وخطط رعاية الناجيات والآثار الجسدية والعاطفية المتأخرة مثل الوذمة اللمفية والقلق وتغير صورة الجسم. تختلف خطة المتابعة حسب الحالة، لذلك ينبغي مناقشة التفاصيل مع فريق الرعاية.",
      en: "The National Cancer Institute provides patient education for people living after breast-cancer treatment, including follow-up visits and tests, survivorship care plans, and physical and emotional late effects such as lymphedema, anxiety, and body-image changes. Follow-up varies by individual situation and should be discussed with the care team.",
    },
  },
  {
    id: "nci-follow-up-care",
    organization: "National Cancer Institute",
    title: {
      ar: "المعهد الوطني للسرطان: المتابعة بعد علاج السرطان",
      en: "National Cancer Institute: Follow-up Care After Cancer Treatment",
    },
    url: "https://www.cancer.gov/about-cancer/coping/survivorship/follow-up-care",
    citationLabel: { ar: "[المعهد الوطني للسرطان — المتابعة]", en: "[NCI — follow-up care]" },
    keywords: ["follow-up care", "care plan", "treatment summary", "متابعة بعد العلاج", "خطة الرعاية", "ملخص العلاج", "فحوصات"],
    content: {
      ar: "بعد انتهاء العلاج قد تشمل المتابعة زيارات دورية وفحوصات وملخصًا للعلاج وخطة لرعاية الناجية. يعتمد توقيت الفحوصات وما يلزم منها على نوع السرطان والعلاجات السابقة والحالة الفردية، ويحدده فريق الرعاية.",
      en: "After treatment, follow-up may include periodic visits and tests, a treatment summary, and a survivorship care plan. The timing and type of follow-up depend on the cancer, previous treatments, and individual situation, and are determined with the care team.",
    },
  },
  {
    id: "acs-breast-survivorship",
    organization: "American Cancer Society",
    title: {
      ar: "الجمعية الأمريكية للسرطان: الحياة بعد علاج سرطان الثدي",
      en: "American Cancer Society: Living as a Breast Cancer Survivor",
    },
    url: "https://www.cancer.org/cancer/types/breast-cancer/living-as-a-breast-cancer-survivor.html",
    citationLabel: { ar: "[الجمعية الأمريكية للسرطان]", en: "[American Cancer Society]" },
    keywords: ["american cancer society", "survivor", "survivorship", "long-term side effects", "follow-up", "breastfeeding", "pregnancy", "الجمعية الأمريكية", "آثار جانبية طويلة", "حمل", "رضاعة", "دعم"],
    content: {
      ar: "تشرح الجمعية الأمريكية للسرطان موضوعات الحياة بعد علاج سرطان الثدي، مثل المتابعة والآثار الجانبية طويلة المدى والصحة النفسية وصورة الجسم والخصوبة والحمل والدعم والأسئلة التي يمكن مناقشتها مع فريق الرعاية. هذه معلومات تثقيفية عامة وليست خطة علاج شخصية.",
      en: "The American Cancer Society discusses life after breast-cancer treatment, including follow-up, long-term side effects, emotional health, body image, fertility, pregnancy, support, and questions to discuss with the care team. This is general education, not an individual treatment plan.",
    },
  },
  {
    id: "asco-survivorship-guidelines",
    organization: "American Society of Clinical Oncology",
    title: {
      ar: "الجمعية الأمريكية لعلم الأورام: إرشادات رعاية الناجيات",
      en: "ASCO: Breast Cancer Follow-up and Survivorship Guidelines",
    },
    url: "https://www.asco.org/news-initiatives/current-initiatives/cancer-care-initiatives/prevention-survivorship/survivorship-compendium/guidelines",
    citationLabel: { ar: "[الجمعية الأمريكية لعلم الأورام]", en: "[ASCO]" },
    keywords: ["asco", "clinical guideline", "survivorship care", "follow-up guideline", "إرشادات الأورام", "رعاية الناجيات", "متابعة سريرية"],
    content: {
      ar: "تجمع الجمعية الأمريكية لعلم الأورام إرشادات رعاية الناجيات والمتابعة بعد العلاج، بما في ذلك التواصل بين فريق الأورام والرعاية الأولية وتقييم الأعراض والآثار طويلة المدى وخطة الرعاية. تُستخدم هذه المعلومات لفهم موضوعات النقاش مع الطبيب وليست بديلًا عن التقييم الفردي.",
      en: "ASCO survivorship resources address follow-up after treatment, communication between oncology and primary-care teams, assessment of symptoms and long-term effects, and survivorship care planning. They help patients understand topics to discuss with clinicians and are not a substitute for individual assessment.",
    },
  },
  {
    id: "nccn-breast-cancer-patient-resources",
    organization: "National Comprehensive Cancer Network",
    title: {
      ar: "شبكة NCCN: موارد مرضى سرطان الثدي",
      en: "NCCN: Breast Cancer Resources for Patients",
    },
    url: "https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients/breast-cancer-resources",
    citationLabel: { ar: "[إرشادات NCCN للمرضى]", en: "[NCCN Patient Guidelines]" },
    keywords: ["nccn", "patient guideline", "dcis", "invasive breast cancer", "metastatic", "مراحل سرطان الثدي", "إرشادات المرضى", "سرطان منتشر"],
    content: {
      ar: "تقدم شبكة NCCN موارد وإرشادات للمرضى بلغة مبسطة حول أنواع ومراحل مختلفة من سرطان الثدي، لمساعدة المريضة ومقدم الرعاية على فهم المصطلحات والاستعداد للحوار مع الطبيب. يجب الرجوع إلى النسخة الحالية ومناقشة القرارات الشخصية مع فريق الأورام.",
      en: "NCCN provides patient resources and plain-language guidelines for different breast-cancer types and stages, helping patients and caregivers understand terms and prepare for conversations with clinicians. Use the current version and discuss personal decisions with the oncology team.",
    },
  },
  {
    id: "nci-treatment-overview",
    organization: "National Cancer Institute",
    title: {
      ar: "المعهد الوطني للسرطان: علاج سرطان الثدي",
      en: "National Cancer Institute: Breast Cancer Treatment",
    },
    url: "https://www.cancer.gov/types/breast/treatment",
    citationLabel: { ar: "[المعهد الوطني للسرطان]", en: "[NCI]" },
    keywords: [
      "treatment", "surgery", "radiation", "chemotherapy", "hormone", "targeted", "immunotherapy",
      "علاج", "جراحة", "إشعاع", "كيميائي", "هرموني", "موجّه", "مناعي",
    ],
    content: {
      ar: "يوضح المعهد الوطني للسرطان أن خطط علاج سرطان الثدي تختلف حسب النوع والمرحلة، وقد تجمع بين علاجات موضعية مثل الجراحة أو الإشعاع وعلاجات جهازية مثل العلاج الكيميائي أو الهرموني أو الموجّه. اختيار العلاج شخصي ويُتخذ مع فريق رعاية السرطان.",
      en: "NCI explains that breast-cancer plans vary by cancer type and stage and can combine local treatments, such as surgery or radiation, with systemic treatments, such as chemotherapy, hormone therapy, targeted therapy, or immunotherapy. Treatment choices are individualized with the cancer care team.",
    },
  },
  {
    id: "nci-infection-neutropenia",
    organization: "National Cancer Institute",
    title: {
      ar: "المعهد الوطني للسرطان: العدوى ونقص العدلات أثناء علاج السرطان",
      en: "National Cancer Institute: Infection and Neutropenia during Cancer Treatment",
    },
    url: "https://www.cancer.gov/about-cancer/treatment/side-effects/infection",
    citationLabel: { ar: "[المعهد الوطني للسرطان]", en: "[NCI]" },
    keywords: [
      "fever", "temperature", "infection", "chills", "redness", "swelling", "wound", "drainage", "pus", "pain", "breathing",
      "حمى", "حرارة", "عدوى", "قشعريرة", "احمرار", "تورم", "جرح", "إفراز", "صديد", "ألم", "تنفس",
    ],
    content: {
      ar: "يذكر المعهد الوطني للسرطان أن الحمى بدرجة 38° مئوية أو أعلى، أو القشعريرة، أو الاحمرار أو التورم قد تكون علامات عدوى أثناء علاج السرطان. العدوى قد تكون مهددة للحياة، لذا ينبغي الاتصال بفريق الرعاية الصحية عند ظهور علامات العدوى، وعدم الاعتماد على خافض حرارة لإخفاء الأعراض قبل استشارة الفريق.",
      en: "NCI lists fever of 38°C (100.5°F) or higher, chills, and redness or swelling among possible infection signs during cancer treatment. Infection can be life-threatening, so patients should contact their care team if signs occur and should not rely on fever-reducing medicine to mask symptoms before speaking with the team.",
    },
  },
  {
    id: "nccn-patient-guidelines",
    organization: "National Comprehensive Cancer Network",
    title: {
      ar: "شبكة NCCN: إرشادات المرضى",
      en: "NCCN Guidelines for Patients",
    },
    url: "https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients",
    citationLabel: { ar: "[إرشادات NCCN للمرضى]", en: "[NCCN Patient Guidelines]" },
    keywords: [
      "guidelines", "questions", "care team", "decision", "plan", "patient", "إرشادات", "أسئلة", "فريق", "قرار", "خطة", "مريض",
    ],
    content: {
      ar: "تقدم إرشادات NCCN للمرضى معلومات من الخبراء بلغة مبسطة لمساعدة المرضى ومقدمي الرعاية على مناقشة الخيارات مع الأطباء. هي مورد للتحضير للحوار الطبي وليست بديلاً عن خطة الرعاية الفردية.",
      en: "NCCN Guidelines for Patients present expert information in plain language to help people with cancer and caregivers discuss options with clinicians. They are a resource for preparing a medical conversation, not a substitute for an individual care plan.",
    },
  },
  {
    id: "baheya-egypt-patient-journey",
    organization: "Bahya Foundation Egypt",
    title: {
      ar: "مؤسسة بهية: رحلة المحاربة، الفروع، الحجز، والخدمات الداعمة",
      en: "Bahya Foundation Egypt: Patient journey, branches, booking, and support services",
    },
    url: "https://baheya.org/ar",
    citationLabel: { ar: "[مؤسسة بهية]", en: "[Bahya]" },
    keywords: [
      "Bahya", "baheya", "بهية", "Egypt", "مصر", "Giza", "Zayed", "Harām", "Haram",
      "booking", "appointment", "حجز", "موعد", "hotline", "16602", "خط ساخن", "خط",
      "branches", "فروع", "address", "عنوان", "location", "موقع",
      "support", "نفس", "دعم", "psychological", "psycho",
      "physiotherapy", "rehabilitation", "علاج طبيعي", "تأهيل", "تاهيل", "إعادة",
      "journey", "رحلة", "free", "مجانا", "مجانًا", "cost", "تكلفة", "donation", "تبرع",
      "screening", "early detection", "كشف", "مبكر",
    ],
    content: {
      ar: "مؤسسة بهية هي مؤسسة مصرية غير ربحية متخصصة في الاكتشاف المبكر وعلاج سرطان الثدي ودعم المحاربات من السيدات. الكشف والعلاج يُقدمان مجاناً، والدعم لا يقتصر على العلاج الطبي بل يشمل رحلة كاملة تمتد لما يصل إلى 10 سنوات. للحجز أو الاستفسار، يُتصل بالخط الساخن 16602 من الأحد إلى الخميس من 9 صباحاً إلى 5 مساءً. يمثل خدمة العملاء يطرح أسئلة لتقييم الحالة ثم يوجّه المحاربة إلى الكشف المبكر أو عيادة الجراحة. شروط الكشف المبكر: عمر 40 سنة فأكثر عند عدم وجود تاريخ وراثي، أو 35 فأكثر عند وجود تاريخ وراثي، دون أعراض ظاهرة؛ وإذا ظهرت أعراض فالفئة من 25 سنة فأكثر. أبرز الفروع: مستشفى بهية بالعجوزة (4 شارع علوبة متفرع من شارع الهرم، الجيزة) وفرع الشيخ زايد (الحي الأول، الشيخ زايد). تشمل خدمات بهية: الكشف المبكر بأحدث الأجهزة، الجراحة، العلاج الكيميائي والإشعاعي والهرموني، العلاج الطبيعي لإعادة تأهيل المحاربة بعد العمليات واستعادة حركة الذراع، وقسم دعم نفسي يعمل على رفع الروح المعنوية وتحسين جودة الحياة كجزء أساسي من رحلة العلاج. رسائل المؤسسة للمحاربات: «إنتِ مش لوحدك» و«بهية في ظهر كل ست مصرية». أي استفسار عن المواعيد أو الأهلية أو التكلفة يجب توجيهه رسمياً عبر الخط الساخن 16602.",
      en: "Bahya Foundation is a non-profit Egyptian institution specializing in early detection, treatment, and support for women facing breast cancer. Exams and treatment are provided free of charge, and support follows the patient through a journey that can span up to 10 years. For booking or inquiries, call the hotline 16602, Sunday through Thursday, 9 AM to 5 PM. A representative asks screening questions and refers the patient to early-detection screening or the surgery clinic. Early-detection eligibility: age 40+ without hereditary history, or 35+ with hereditary history, and no symptoms; with symptoms, eligibility starts at age 25. Main branches: Bahya Hospital in Agouza (4 Alouba St., off Haram St., Giza) and the Sheikh Zayed branch (First District, Sheikh Zayed). Services include modern early-detection imaging, surgery, chemotherapy, radiotherapy and hormone therapy, physiotherapy to restore arm movement after surgery, and a dedicated psychosocial support department that boosts morale and quality of life as part of the treatment journey. Bahya's messages to its patients: \"You are not alone\" and \"Bahya stands behind every Egyptian woman.\" Any question about appointments, eligibility, or costs should be directed officially through the hotline 16602.",
    },
  },
];

export function retrieveMedicalSources(query: string, limit = 3): MedicalSource[] {
  const normalizedQuery = query.toLowerCase();
  if (/حمى|حرارة|قشعريرة|عدوى|infection|fever|chills|redness|swelling|جرح|إفراز/i.test(normalizedQuery)) {
    const safetySource = MEDICAL_SOURCES.find(source => source.id === "nci-infection-neutropenia");
    return safetySource ? [safetySource] : MEDICAL_SOURCES.slice(0, 1);
  }
  if (/بعد\s*(انتهاء|إكمال)?\s*(العلاج|الجرعات)|المتابع(?:ة|ات)|رعاية\s*(الناجيات|ما بعد العلاج)|follow[- ]?up|survivorship|after\s*treatment/i.test(normalizedQuery)) {
    const survivorshipIds = new Set(["nci-follow-up-care", "acs-breast-survivorship"]);
    return MEDICAL_SOURCES.filter(source => survivorshipIds.has(source.id)).slice(0, Math.min(limit, 2));
  }
  const ranked = MEDICAL_SOURCES.map(source => ({
    source,
    score: source.keywords.reduce(
      (total, keyword) => total + (normalizedQuery.includes(keyword.toLowerCase()) ? 1 : 0),
      0,
    ),
  })).sort((a, b) => b.score - a.score);

  const matched = ranked.filter(item => item.score > 0).slice(0, limit).map(item => item.source);
  return matched.length > 0 ? matched : MEDICAL_SOURCES.slice(0, 2);
}

export function buildGroundingContext(sources: MedicalSource[], language: SupportedLanguage): string {
  return sources.map(source => (
    `${source.citationLabel[language]} ${source.title[language]}\n${source.content[language]}\nURL: ${source.url}`
  )).join("\n\n");
}
