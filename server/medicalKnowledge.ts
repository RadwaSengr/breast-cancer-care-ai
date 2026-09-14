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
 * Authoritative medical and local support sources for breast cancer care and aftercare.
 * Derived from official publications:
 * 1. Baheya Foundation: Psychosocial Support, Women Empowerment & Volunteering (https://baheya.org/ar/baheya_services/4)
 * 2. NCI: Infection and Neutropenia during Cancer Treatment (https://www.cancer.gov/about-cancer/treatment/side-effects/infection)
 * 3. NCCN: Guidelines for Patients - Breast Cancer & Supportive Care (https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients)
 * 4. Baheya Foundation: Booking, Branches, and Eligibility (https://baheya.org/ar/media_article/320)
 * 5. ASCO: Guidelines on Survivorship Care (https://www.asco.org/news-initiatives/current-initiatives/cancer-care-initiatives/prevention-survivorship/survivorship-compendium/guidelines)
 */
export const MEDICAL_SOURCES: MedicalSource[] = [
  {
    id: "baheya-psychosocial-volunteering",
    organization: "مؤسسة بهية",
    title: {
      ar: "مؤسسة بهية: قسم التطوع والدعم النفسي وتمكين المحاربات",
      en: "Baheya Foundation: Psychosocial Support, Women Empowerment & Volunteering",
    },
    url: "https://baheya.org/ar/baheya_services/4",
    citationLabel: { ar: "[مؤسسة بهية — الدعم النفسي]", en: "[Baheya — Psychosocial Support]" },
    keywords: [
      "دعم نفسي", "استشارة", "جلسات استشارة", "قلق", "اكتئاب", "صدمة", "جودة الحياة", "رحلات", "زيارات منزلية",
      "تمكين", "ورش", "خياطة", "إكسسوارات", "رسم", "بازار", "بازارات", "موسيقى", "دراما", "محو أمية", "لغة إنجليزية",
      "بوتيك بهية", "بوتيك", "ملابس", "قسائم", "تطوع", "متطوعين", "بهية", "16602",
      "psychosocial", "counseling", "anxiety", "depression", "quality of life", "home visits",
      "empowerment", "workshops", "sewing", "boutique", "vouchers", "volunteering", "volunteer", "bahya",
    ],
    content: {
      ar: "تقدم مستشفى بهية منظومة متكاملة من خدمات الدعم النفسي والمهني والترفيهي لمريضات سرطان الثدي طوال رحلة العلاج والتعافي:\n" +
        "1. الدعم النفسي: جلسات استشارة جماعية وفردية منتظمة لتقديم الدعم العاطفي للمريضات وأسرهن للتعامل مع الصدمة الأولية للتشخيص وتقليل القلق والاكتئاب وتحسين جودة الحياة وإعادة الأمل. كما تنظم المستشفى رحلات ترفيهية وفعاليات في جميع أنحاء مصر لتخفيف التوتر، وزيارات منزلية مخصصة للمريضات اللاتي ليس لديهن مقدمو رعاية.\n" +
        "2. تمكين السيدات: ورش تدريبية مهنية متنوعة في الخياطة وصناعة الإكسسوارات والرسم لتزويد المحاربات بمهارات تدعمهن مالياً مع المشاركة في البازارات لبيع منتجاتهن؛ جلسات الفنون الأدائية والموسيقى والدراما والأداء السنوي أمام الجمهور؛ دروس محو الأمية واللغة الإنجليزية؛ وجلسات التأمل واليوغا والتغذية الصحية.\n" +
        "3. مبادرة بوتيك بهية: مبادرة فريدة توفر ملابس مجانية راقية للمريضات وأسرهن لتعزيز الثقة بالنفس، حيث تُمنح 4 قسائم سنوياً للمحاربة لاختيار ما يناسبها بحرية تامة.\n" +
        "4. قسم التطوع: إتاحة الفرصة للمتطوعين لتقديم الدعم العاطفي والمرافقة والمساعدة في الحركة والتنقل.\n" +
        "جميع خدمات بهية تقدم بالمجان 100%، وللحجز أو الاستفسار اتصلي بالخط الساخن 16602 (من الأحد إلى الخميس من 9 ص إلى 5 م).",
      en: "Baheya Foundation provides a comprehensive system of psychosocial, vocational, and recreational support services for breast cancer patients:\n" +
        "1. Psychosocial Support: Regular individual and group counseling sessions for emotional support, helping patients and families cope with initial diagnosis shock, reducing anxiety and depression, and boosting quality of life. It also organizes recreational trips across Egypt to relieve stress and provides dedicated home visits for patients who lack caregivers.\n" +
        "2. Women Empowerment: Vocational workshops in sewing, accessory making, and painting to provide financial empowerment, alongside bazaar participation to sell handmade products. It also offers performing arts (music, drama, and annual theatrical performances), literacy and English classes, and regular meditation, yoga, and nutrition sessions.\n" +
        "3. Boutique Baheya: A unique initiative providing free high-quality clothing to patients and their families through 4 vouchers per year to foster self-esteem.\n" +
        "4. Volunteer Department: Enables volunteers to offer companionship, emotional encouragement, and mobility assistance.\n" +
        "All services are completely free. For inquiries or booking, call hotline 16602 (Sun-Thu 9 AM-5 PM).",
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
      "fever", "temperature", "infection", "chills", "neutropenia", "neutrophils", "catheter", "port", "redness", "swelling", "wound", "drainage", "pus", "pain", "breathing", "rash", "mouth sores", "tylenol", "aspirin", "ibuprofen", "handwashing", "food safety",
      "حمى", "حرارة", "سخونية", "عدوى", "قشعريرة", "نقص العدلات", "كرات الدم البيضاء", "مناعة", "قسطرة", "بورت", "احمرار", "تورم", "جرح", "إفراز", "صديد", "ألم", "طفح", "تقرحات فم", "خافض حرارة", "أسبرين", "باراسيتامول", "غسل اليدين", "سلامة الغذاء",
    ],
    content: {
      ar: "يوضح المعهد الوطني للسرطان (NCI) الإرشادات الحيوية للوقاية والتعامل مع العدوى ونقص العدلات (خلايا الدم البيضاء / Neutropenia) أثناء علاج السرطان:\n" +
        "• علامات العدوى التي تستوجب الاتصال الفوري بفريق الرعاية الصحية:\n" +
        "  - ارتفاع درجة الحرارة إلى 38° مئوية (100.5° فهرنهايت) أو أعلى.\n" +
        "  - قشعريرة أو رجفة بالجسم.\n" +
        "  - سعال أو ألم والتهاب في الحلق.\n" +
        "  - إسهال أو ألم في الأذن أو الجيوب الأنفية أو صداع وتصلب الرقبة.\n" +
        "  - طفح جلدي أو تقرحات وبقع بيضاء في الفم أو على اللسان.\n" +
        "  - احمرار أو تورم أو ألم أو صديد، خاصة حول موضع القسطرة/البورت (Catheter/Port) أو جرح العملية.\n" +
        "  - بول دموي أو عكر أو ألم وحرقة أثناء التبول.\n" +
        "• تحذير طبي حرج: العدوى أثناء علاج السرطان قد تهدد الحياة وتتطلب تدخلاً طبياً عاجلاً. اتصلي بفريقك الطبي فوراً، ولا تتناولي أدوية خافضة للحرارة مثل الأسبرين أو الباراسيتامول (تايلينول/بنادول) أو الإيبوبروفين قبل استشارة الطبيب أو الممرضة؛ لأنها قد تخفض الحرارة مؤقتاً وتخفي علامات عدوى خطيرة تتطلب علاجاً فورياً.\n" +
        "• الوقاية اليومية: غسل اليدين المتكرر بالماء الدافئ والصابون خاصة قبل الأكل؛ الحفاظ على نظافة وجفاف موضع القسطرة؛ تنظيف الأسنان وفحص الفم يومياً؛ تجنب الزحام والمصابين بنزلات البرد ومن تلقوا لقاحات حية حديثاً؛ والحرص على طهي اللحوم والبيض جيداً وغسل الخضروات والفواكه بعناية.",
      en: "NCI outlines critical guidance for preventing and managing infections and neutropenia (low white blood cell count) during cancer treatment:\n" +
        "• Signs of infection requiring immediate contact with your healthcare team:\n" +
        "  - Fever of 100.5°F (38°C) or higher.\n" +
        "  - Chills or sweats.\n" +
        "  - Cough or sore throat.\n" +
        "  - Diarrhea, ear pain, sinus pain, headache, or stiff neck.\n" +
        "  - Skin rash, or mouth sores / white coating on tongue.\n" +
        "  - Redness, swelling, pain, or pus, especially around catheter/port sites or surgical incisions.\n" +
        "  - Bloody or cloudy urine, or burning during urination.\n" +
        "• Critical Warning: Infections during cancer treatment can be life-threatening and require urgent medical care. Call your oncology team right away. DO NOT take fever reducers such as aspirin, acetaminophen (Tylenol), or ibuprofen before speaking with your doctor or nurse, as they can mask fever and hide severe underlying infection.\n" +
        "• Prevention tips: Wash hands thoroughly and frequently with warm water and soap; keep catheter sites clean and dry; brush teeth and check mouth for sores daily; avoid crowds, sick individuals, and recent live-vaccine recipients; follow food safety (cook meat/eggs thoroughly, wash/peel fruits and vegetables).",
    },
  },
  {
    id: "nccn-patient-guidelines",
    organization: "National Comprehensive Cancer Network",
    title: {
      ar: "شبكة NCCN: إرشادات شبكة السرطان الشاملة للمرضى (سرطان الثدي)",
      en: "NCCN Guidelines for Patients: Breast Cancer & Supportive Care",
    },
    url: "https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients",
    citationLabel: { ar: "[إرشادات NCCN للمرضى]", en: "[NCCN Patient Guidelines]" },
    keywords: [
      "nccn", "guidelines", "patient guideline", "breast cancer", "dcis", "invasive", "inflammatory", "metastatic", "screening", "fatigue", "distress", "low blood cell counts", "nausea", "survivorship",
      "إرشادات nccn", "إرشادات المرضى", "سرطان الثدي", "الموضعي", "الارتشاحي", "الالتهابي", "المنتشر", "المرحلة", "الكشف المبكر", "الإرهاق", "الضيق النفسي", "نقص كرات الدم", "الغثيان", "رعاية ما بعد العلاج",
    ],
    content: {
      ar: "توفر شبكة NCCN إرشادات موثوقة ومبسطة للمرضى ومقدمي الرعاية مدعومة بالرسوم التوضيحية والتعريفات لتمكينهم من اتخاذ قرارات علاجية مشتركة ومستنيرة مع أطبائهم:\n" +
        "• إرشادات أنواع ومراحل سرطان الثدي:\n" +
        "  - السرطان القنوي الموضعي في الموقع (DCIS).\n" +
        "  - سرطان الثدي الارتشاحي/الغازي (Invasive Breast Cancer).\n" +
        "  - سرطان الثدي الالتهابي (Inflammatory Breast Cancer).\n" +
        "  - سرطان الثدي النقيلي/المنتشر (Metastatic Breast Cancer).\n" +
        "  - إرشادات الفحص والتشخيص المبكر وتقييم المخاطر.\n" +
        "• إرشادات الرعاية التلطيفية والداعمة (Supportive Care):\n" +
        "  - إدارة الإرهاق والتعب المصاحب للسرطان (Cancer-Related Fatigue).\n" +
        "  - التعامل مع الضغط والاضطراب النفسي (Distress Management).\n" +
        "  - إدارة انخفاض خلايا الدم والمناعة والأنيميا (Low Blood Cell Counts).\n" +
        "  - السيطرة على الغثيان والقيء المصاحب للعلاج.\n" +
        "  - رعاية ما بعد العلاج والآثار المتأخرة وطويلة المدى (Survivorship Care).\n" +
        "هذه الإرشادات أداة تعليمية حوارية لتمكين المريضة ومساعدتها في إعداد أسئلتها لفريقها المعالج وليست بديلاً عن الخطة الطبية الفردية.",
      en: "NCCN Guidelines for Patients present expert, plain-language guidance with illustrations and definitions to empower patients and caregivers in shared decision-making with clinicians:\n" +
        "• Breast Cancer Types and Stages:\n" +
        "  - Ductal Carcinoma In Situ (DCIS).\n" +
        "  - Invasive Breast Cancer.\n" +
        "  - Inflammatory Breast Cancer.\n" +
        "  - Metastatic Breast Cancer.\n" +
        "  - Breast Cancer Screening and Diagnosis.\n" +
        "• Supportive Care Guidelines:\n" +
        "  - Cancer-Related Fatigue.\n" +
        "  - Distress Management during Cancer Care.\n" +
        "  - Low Blood Cell Counts (Neutropenia, Anemia).\n" +
        "  - Nausea and Vomiting control.\n" +
        "  - Survivorship Care for late and long-term effects.\n" +
        "These guidelines serve as an educational dialogue tool to prepare questions for your healthcare team, not a substitute for an individual treatment plan.",
    },
  },
  {
    id: "baheya-egypt-patient-journey",
    organization: "مؤسسة بهية",
    title: {
      ar: "مؤسسة بهية: خطوات حجز موعد كشف، الفروع، وشروط الأهلية",
      en: "Baheya Foundation: Booking Steps, Branches, and Eligibility Criteria",
    },
    url: "https://baheya.org/ar/media_article/320",
    citationLabel: { ar: "[مؤسسة بهية — حجز الكشف]", en: "[Baheya — Booking & Journey]" },
    keywords: [
      "Bahya", "baheya", "بهية", "Egypt", "مصر", "Giza", "Zayed", "Harām", "Haram", "علوبة",
      "booking", "appointment", "حجز", "موعد", "مواعيد", "hotline", "16602", "خط ساخن",
      "branches", "فروع", "address", "عنوان", "الهرم", "الشيخ زايد",
      "screening", "early detection", "كشف", "مبكر", "جراحة", "شروط", "أهلية", "سن", "تاريخ وراثي", "أعراض", "بطاقة", "مجانا", "مجانًا",
    ],
    content: {
      ar: "مؤسسة بهية هي صرح مصري خيري متخصص في الاكتشاف المبكر وعلاج سرطان الثدي ودعم المحاربات بالمجان تماماً («بهية في ظهر كل ست مصرية» / «إنتِ مش لوحدك»):\n" +
        "• خطوات حجز موعد كشف: الاتصال بالخط الساخن 16602 من الأحد إلى الخميس من 9 صباحاً إلى 5 مساءً. يقوم ممثل خدمة العملاء بالرد وطرح أسئلة لتحديد الحالة ثم توجيه المتصلة إلى الكشف المبكر أو عيادة الجراحة حسب المتاح.\n" +
        "• شروط حجز موعد للكشف المبكر (دون وجود أعراض):\n" +
        "  - العمر 35 سنة فأكثر في حال وجود تاريخ وراثي للمرض في العائلة.\n" +
        "  - العمر 40 سنة فأكثر في حال عدم وجود تاريخ وراثي.\n" +
        "• شروط حجز عيادة الجراحة:\n" +
        "  - عند ظهور أعراض (مثل وجود كتلة، إفرازات غير طبيعية، تغير في الحلمة أو الجلد).\n" +
        "  - العمر 25 سنة فما فوق.\n" +
        "• المستندات المطلوبة يوم الكشف: بطاقة الرقم القومي (البطاقة الشخصية) سارية.\n" +
        "• الفروع الرئيسية:\n" +
        "  - مركز بهية الهرم: 4 شارع علوبة، متفرع من أول شارع الهرم بجوار داري، الجيزة.\n" +
        "  - مستشفى بهية الشيخ زايد: قطعة 40، الحي الأول، الشيخ زايد، أمام كلية الهندسة.\n" +
        "جميع الفحوصات والتشخيص والعلاجات المتقدمة (جراحة، كيماوي، إشعاعي، هرموني، وتأهيل طبيعي) تقدم بالمجان 100%.",
      en: "Bahya Foundation is an Egyptian non-profit hospital specializing in early detection, free breast cancer treatment, and comprehensive support for women (\"Bahya stands behind every Egyptian woman\" / \"You are not alone\"):\n" +
        "• Booking Steps: Call the official hotline 16602, Sunday through Thursday, 9 AM to 5 PM. A customer service representative will evaluate your case through questions and route you to either Early Screening or the Surgery Clinic.\n" +
        "• Early Screening Eligibility (No symptoms present):\n" +
        "  - Age 35+ with a family/hereditary history of breast cancer.\n" +
        "  - Age 40+ without family history.\n" +
        "• Surgery Clinic Eligibility:\n" +
        "  - When symptoms are present (lump, discharge, nipple/skin changes).\n" +
        "  - Age 25 and older.\n" +
        "• Required Documents on visit day: Valid National ID card (بطاقة الرقم القومي).\n" +
        "• Main Branches:\n" +
        "  - Bahya Haram Center: 4 Alouba St., off beginning of Haram St., next to Dari, Giza.\n" +
        "  - Bahya Sheikh Zayed Hospital: Plot 40, First District, Sheikh Zayed, in front of Faculty of Engineering.\n" +
        "All screening, surgeries, chemotherapy, radiotherapy, hormone therapy, and physical therapy are 100% free of charge.",
    },
  },
  {
    id: "asco-survivorship-guidelines",
    organization: "American Society of Clinical Oncology",
    title: {
      ar: "الجمعية الأمريكية لعلم الأورام السريري (ASCO): إرشادات رعاية الناجيات من السرطان",
      en: "American Society of Clinical Oncology (ASCO): Guidelines on Survivorship Care",
    },
    url: "https://www.asco.org/news-initiatives/current-initiatives/cancer-care-initiatives/prevention-survivorship/survivorship-compendium/guidelines",
    citationLabel: { ar: "[الجمعية الأمريكية لعلم الأورام — ASCO]", en: "[ASCO — Survivorship Guidelines]" },
    keywords: [
      "asco", "survivorship", "guidelines", "fatigue", "anxiety", "depression", "neuropathy", "cipn", "surveillance", "recurrence", "mammography", "fertility", "follow-up",
      "الجمعية الأمريكية للأورام", "إرشادات رعاية الناجيات", "متابعة بعد العلاج", "الإرهاق", "القلق", "الاكتئاب", "الاعتلال العصبي", "تنميل الأطراف", "عودة المرض", "الماموجرام", "الخصوبة", "فحوصات دورية",
    ],
    content: {
      ar: "تضع الجمعية الأمريكية لعلم الأورام السريري (ASCO) إرشادات إكلينيكية مبنية على الأدلة لرعاية الناجيات من سرطان الثدي بعد انتهاء العلاج الأساسي:\n" +
        "1. فحص وإدارة الآثار الجانبية المتأخرة وطويلة المدى:\n" +
        "  - تقييم وإدارة الإرهاق المرتبط بالسرطان (Cancer-Related Fatigue) عبر النشاط البدني المعتدل والدعم النفسي والنوم الصحي.\n" +
        "  - تقييم ورعاية أعراض القلق والاكتئاب والضغوط النفسية للناجيات من خلال الاستشارات المتخصصة.\n" +
        "  - الوقاية من الاعتلال العصبي المحيطي الناتج عن العلاج الكيميائي (CIPN) وإدارته مثل تنميل ووخز الأطراف.\n" +
        "2. خطة مراقبة عدم عودة الورم (Surveillance for Recurrence):\n" +
        "  - إجراء الفحص السريري للثدي والتاريخ المرضي الدوري كل 3 إلى 6 أشهر في السنوات الأولى ثم كل 6 إلى 12 شهراً.\n" +
        "  - إجراء تصوير الماموجرام السنوي المنتظم لمتابعة صحة الثدي.\n" +
        "3. الحفاظ على الخصوبة وتنظيم الأسرة للمريضات الشابات وتنسيق خطة رعاية الناجيات المكتوبة بين أطباء الأورام وأطباء الرعاية الأولية.\n" +
        "هذه الإرشادات تساعد المحاربة على مناقشة خطة متابعتها مع طبيبها المعالج.",
      en: "ASCO provides evidence-based clinical practice guidelines for long-term screening, surveillance, and symptom management for cancer survivors:\n" +
        "1. Screening and management of late and long-term effects:\n" +
        "  - Screening, assessment, and management of Cancer-Related Fatigue through moderate physical activity, psychosocial support, and sleep hygiene.\n" +
        "  - Screening, assessment, and care of Anxiety and Depressive symptoms in adults with cancer.\n" +
        "  - Prevention and management of Chemotherapy-Induced Peripheral Neuropathy (CIPN), such as numbness and tingling in extremities.\n" +
        "2. Surveillance for Cancer Recurrence:\n" +
        "  - Regular clinical breast examinations and history every 3–6 months for the first years, then every 6–12 months.\n" +
        "  - Annual surveillance mammography.\n" +
        "3. Fertility preservation and survivorship care coordination between oncology teams and primary care.\n" +
        "These guidelines provide a structured framework for post-treatment survivorship care discussions with your doctor.",
    },
  },
  {
    id: "who-breast-cancer",
    organization: "World Health Organization",
    title: {
      ar: "منظمة الصحة العالمية: سرطان الثدي والتأهيل الشامل",
      en: "World Health Organization: Breast Cancer & Rehabilitation",
    },
    url: "https://www.who.int/news-room/fact-sheets/detail/breast-cancer",
    citationLabel: { ar: "[منظمة الصحة العالمية]", en: "[WHO]" },
    keywords: [
      "aftercare", "follow up", "follow-up", "recovery", "rehabilitation", "support", "lump", "wound",
      "الرعاية", "المتابعة", "التعافي", "التأهيل", "الدعم", "كتلة", "جرح", "الصحة العالمية",
    ],
    content: {
      ar: "تؤكد منظمة الصحة العالمية أن الرعاية الشاملة لسرطان الثدي تشمل التشخيص المبكر، الجراحة، والعلاجات الدوائية والإشعاعية، بالإضافة إلى التأهيل البدني والدعم النفسي والتغذوي بمشاركة فريق متعدد التخصصات. أي كتلة غير طبيعية أو تغير في جلد أو حلمة الثدي يستوجب تقييماً طبياً فورياً.",
      en: "WHO notes that comprehensive breast cancer care integrates early detection, surgery, radiation and systemic therapies, alongside physical rehabilitation and psychosocial support from a multidisciplinary team. Any abnormal breast lump or skin change requires prompt clinical evaluation.",
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
      ar: "بعد انتهاء العلاج تشمل المتابعة زيارات دورية وفحوصات منتظمة وملخصاً للعلاج وخطة لرعاية الناجية. يعتمد جدول الفحوصات على نوع ومرحلة السرطان والعلاجات السابقة والحالة الفردية ويحدده الفريق الطبي المعالج.",
      en: "After treatment, follow-up includes periodic visits, diagnostic tests, a treatment summary, and a survivorship care plan tailored to the cancer type, stage, previous therapies, and individual needs.",
    },
  },
  {
    id: "acs-breast-survivorship",
    organization: "American Cancer Society",
    title: {
      ar: "الجمعية الأمريكية للسرطان: الحياة بعد علاج سرطان الثدي",
      en: "American Cancer Society: Living as a Breast Cancer Survivor",
    },
    url: "https://www.cancer.gov/types/breast/breast-cancer-survivorship",
    citationLabel: { ar: "[الجمعية الأمريكية للسرطان]", en: "[American Cancer Society]" },
    keywords: ["american cancer society", "survivor", "survivorship", "long-term side effects", "follow-up", "breastfeeding", "pregnancy", "الجمعية الأمريكية", "آثار جانبية طويلة", "حمل", "رضاعة", "دعم"],
    content: {
      ar: "توضح الجمعية الأمريكية للسرطان سبل التعامل مع الآثار طويلة المدى بعد علاج سرطان الثدي مثل الوذمة اللمفية (Lymphedema)، وتغيرات صورة الجسم، والخصوبة، والدعم النفسي والاجتماعي، وأهمية ممارسة الرياضة المناسبة والتغذية المتوازنة.",
      en: "ACS discusses living after breast cancer treatment, managing long-term side effects including lymphedema, body-image adjustments, fertility, psychological support, and adopting a healthy lifestyle.",
    },
  },
  {
    id: "nci-treatment-overview",
    organization: "National Cancer Institute",
    title: {
      ar: "المعهد الوطني للسرطان: نظرة عامة على علاج سرطان الثدي",
      en: "National Cancer Institute: Breast Cancer Treatment Overview",
    },
    url: "https://www.cancer.gov/types/breast/treatment",
    citationLabel: { ar: "[المعهد الوطني للسرطان]", en: "[NCI]" },
    keywords: [
      "treatment", "surgery", "radiation", "chemotherapy", "hormone", "targeted", "immunotherapy",
      "علاج", "جراحة", "إشعاع", "كيميائي", "هرموني", "موجّه", "مناعي",
    ],
    content: {
      ar: "يوضح المعهد الوطني للسرطان أن علاج سرطان الثدي يُصمم حسب النوع والخصائص البيولوجية للمرض والمرحلة، ويشمل مزيجاً من العلاجات الموضعية (الجراحة والإشعاع) والعلاجات الجهازية (العلاج الكيميائي، الهرموني، الموجّه، والمناعي).",
      en: "NCI explains that breast cancer treatment is tailored based on stage and biological characteristics, combining local therapies (surgery, radiotherapy) and systemic therapies (chemotherapy, endocrine therapy, targeted therapy, immunotherapy).",
    },
  },
];

export function retrieveMedicalSources(query: string, limit = 3): MedicalSource[] {
  const normalizedQuery = query.toLowerCase();

  // Safety & Urgent symptoms: fever, chills, infection, catheter, wound, drainage
  if (/حمى|حمي|حرارة|سخونية|قشعريرة|عدوى|التهاب|صديد|إفراز|افراز|جرح|قسطرة|بورت|fever|chills|infection|redness|swelling|wound|drainage|pus|catheter|port/i.test(normalizedQuery)) {
    const safetySource = MEDICAL_SOURCES.find(source => source.id === "nci-infection-neutropenia");
    return safetySource ? [safetySource] : MEDICAL_SOURCES.slice(0, 1);
  }

  // Baheya booking, branches, phone number 16602, eligibility, early screening vs surgery clinic
  if (/بهية|bahya|baheya|16602|حجز|احجز|موعد|مواعيد|فرع|فروع|الهرم|الشيخ زايد|علوبة|كشف مبكر|عيادة الجراحة|تاريخ وراثي|شروط الحجز|booking|appointment|hotline/i.test(normalizedQuery)) {
    const bookingSource = MEDICAL_SOURCES.find(source => source.id === "baheya-egypt-patient-journey");
    const supportSource = MEDICAL_SOURCES.find(source => source.id === "baheya-psychosocial-volunteering");
    if (/دعم\s*نفسي|تطوع|بوتيك|ورش|خياطة|قلق|اكتئاب|صدمة|psychosocial|support|volunteer|boutique/i.test(normalizedQuery)) {
      return supportSource && bookingSource ? [supportSource, bookingSource] : [supportSource || bookingSource || MEDICAL_SOURCES[0]];
    }
    return bookingSource ? [bookingSource] : MEDICAL_SOURCES.slice(0, 1);
  }

  // Psychosocial support, emotional wellbeing, Baheya support services, boutique, volunteering
  if (/دعم\s*نفسي|دعم\s*معنوي|استشارة|جلسات|قلق|خوف|خايفة|اكتئاب|صدمة|حزن|بوتيك|تطوع|ورش|خياطة|ترفيه|رحلات|زيارات منزلية|تمكين|psychosocial|counseling|anxiety|depression|distress|boutique|volunteer/i.test(normalizedQuery)) {
    const supportSource = MEDICAL_SOURCES.find(source => source.id === "baheya-psychosocial-volunteering");
    const ascoSource = MEDICAL_SOURCES.find(source => source.id === "asco-survivorship-guidelines");
    const matched = [supportSource, ascoSource].filter((s): s is MedicalSource => Boolean(s));
    return matched.length ? matched.slice(0, limit) : MEDICAL_SOURCES.slice(0, 1);
  }

  // Survivorship, post-treatment, neuropathy (CIPN), fatigue, recurrence monitoring
  if (/بعد\s*(انتهاء|إكمال)?\s*(العلاج|الجرعات|الكيماوي)|المتابع(?:ة|ات)|رعاية\s*(الناجيات|ما بعد العلاج)|تنميل|اعتلال عصبي|إرهاق|تعب|عودة الورم|ماموجرام سنوي|follow[- ]?up|survivorship|after\s*treatment|neuropathy|cipn|fatigue|recurrence/i.test(normalizedQuery)) {
    const survivorshipIds = new Set(["asco-survivorship-guidelines", "nci-follow-up-care", "acs-breast-survivorship"]);
    const found = MEDICAL_SOURCES.filter(source => survivorshipIds.has(source.id));
    return found.length ? found.slice(0, Math.min(limit, 2)) : MEDICAL_SOURCES.slice(0, 2);
  }

  // Breast cancer stages & types (DCIS, invasive, inflammatory, metastatic) or NCCN guidelines
  if (/dcis|موضعي|ارتشاحي|غازي|التهابي|نقيلي|منتشر|مراحل|أنواع سرطان الثدي|nccn|guidelines|إرشادات/i.test(normalizedQuery)) {
    const nccnSource = MEDICAL_SOURCES.find(source => source.id === "nccn-patient-guidelines");
    return nccnSource ? [nccnSource] : MEDICAL_SOURCES.slice(0, 1);
  }

  // General ranking by keyword overlap
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
