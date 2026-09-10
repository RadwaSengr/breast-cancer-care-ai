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
