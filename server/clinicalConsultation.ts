import { MEDICAL_SOURCES, type MedicalSource, type SupportedLanguage } from "./medicalKnowledge";

export type ClinicalCitation = {
  id: string;
  organization: string;
  title: string;
  url: string;
  label: string;
};

export type ClinicalConsultationResult = {
  answer: string;
  suggestedQuestions: string[];
  citations: ClinicalCitation[];
};

function formatCitation(source: MedicalSource, language: SupportedLanguage): ClinicalCitation {
  return {
    id: source.id,
    organization: source.organization,
    title: source.title[language],
    url: source.url,
    label: source.citationLabel[language],
  };
}

function linkCitations(sources: MedicalSource[], language: SupportedLanguage): string {
  return sources
    .map(s => `[${s.citationLabel[language].replace(/[\[\]]/g, "")}](${s.url})`)
    .join(" · ");
}

const EXPLICIT_OUT_OF_SCOPE = /كب\s*كيك|cupcake|وصفة\s*(أكل|طبخ|طعام)?|طبخ|طبيخ|\brecipe\b|\bcook(?:ing)?\b|برمج(?:ة|ات)|\bكود\b|\bpython\b|\bjavascript\b|\bjava\b|\bc\+\+\b|\bhtml\b|\bcss\b|\bsql\b|عاصم(?:ة|ات)|\bcapital of\b|كرة\s*(قدم|سلة)|ماتش|مباراة|دوري|أهلي|زمالك|\bfootball\b|\bsoccer\b|سيار(?:ة|ات)|\bcars?\b|أسنان|ضرس|\btooth\b|\bteeth\b|\bdental\b|حيوان|حيوانات|\banimals?\b|\bpets?\b|طقس|\bweather\b|فيلم|أفلام|مسلسل|\bmovie\b|\bsong\b|أغني(?:ة|ات)|سياس(?:ة|ي)|\bpolitics\b|بورصة|سهم|أسهم|\bcrypto\b|بيتكوين/iu;

export function isBreastCancerScope(question: string): boolean {
  const normalized = question.toLowerCase();
  if (EXPLICIT_OUT_OF_SCOPE.test(normalized)) return false;

  const isGreeting = /^(?:السلام\s*عليكم|صباح\s*الخير|مساء\s*الخير|أهلا|اهلا|مرحبا|هاي|ازيك|ازيكو|عاملة\s*ايه|hello|hi|hey|good\s*morning|good\s*evening)[\s!.]*$/iu.test(normalized);
  if (isGreeting) return true;

  // Direct oncology, breast health, treatments, and Baheya services
  const directTerms = /سرطان|ورم|أورام|الثدي|صدر|حلمة|كتلة|خزعة|ماموجرام|مامو|سونار|كيماوي|كيميائي|إشعاع|اشعاع|هرموني|استئصال|ماستكتومي|جراحة|بورت|قسطرة|بهية|16602|ناجي(?:ة|ات)|تعاف|الوذمة|تورم\s*(الذراع|اليد)|نقص\s*العدلات|neutropen|chemo|radiation|oncology|biopsy|mammogram|lumpectomy|mastectomy|lymphedema|baheya/iu;
  if (directTerms.test(normalized)) return true;

  // Oncology-related side effects, infection warnings, and psychological distress
  const clinicalSymptoms = /سخونية|حمى|حمي|حرارة|قشعريرة|تنميل|تساقط\s*الشعر|شعري|إرهاق|تعب|غثيان|ترجيع|نفسيتي|خايفة|خوف|قلق|صدمة|بوتيك|دعم\s*نفسي|جلسات\s*دعم|fever|chills|neuropathy|hair\s*loss|fatigue|nausea|psychological|distress/iu;
  const healthContext = /مريض(?:ة)?|علاج|جلس(?:ة|ات)|دكتور|طبيب|كشف|فحص|تحليل|أشعة|أدوية|دواء|مستشفى|صحة|أعراض|doctor|clinic|treatment|hospital|symptom|care/iu;

  return clinicalSymptoms.test(normalized) && healthContext.test(normalized);
}

/**
 * Intelligent clinical consultation engine.
 * Synthesizes grounded, empathetic, and scientifically validated answers based on the 5 official sources.
 * Strictly adheres to patient safety: NO prescribing of treatments/medications and NO ordering of specific tests.
 */
export function generateClinicalConsultation(question: string, language: SupportedLanguage): ClinicalConsultationResult {
  const normalized = question.trim().toLowerCase();

  // 1. Check for greeting
  const isGreeting = /^(?:السلام\s*عليكم|صباح\s*الخير|مساء\s*الخير|أهلا|اهلا|مرحبا|هاي|ازيك|ازيكو|عاملة\s*ايه|hello|hi|hey|good\s*morning|good\s*evening)[\s!.]*$/iu.test(normalized);
  if (isGreeting) {
    const sources = MEDICAL_SOURCES.filter(s => ["baheya-egypt-patient-journey", "baheya-psychosocial-volunteering"].includes(s.id));
    const links = linkCitations(sources, language);
    return {
      answer: language === "ar"
        ? `أهلاً بيكِ يا حبيبتي، وعليكم السلام ورحمة الله. إنتِ مش لوحدك، أنا رفيقتكِ الذكية المتخصصة في الاستشارات والتثقيف الصحي لسرطان الثدي، ومراحل العلاج والتعافي، والخدمات المجانية لمؤسسة بهية (الخط الساخن 16602).\n\nيسعدني جداً الإجابة على استفساراتكِ ومساعدتكِ في:\n• الفحص السريري، وشروط الحجز والكشف المجاني في بهية.\n• فهم الأعراض والتحضير لمقابلة الطبيب.\n• التعامل الآمن مع الآثار الجانبية للعلاج (الكيماوي، الإشعاعي، والهرموني).\n• خدمات الدعم النفسي والتمكين وبوتيك بهية.\n• إرشادات المتابعة ورعاية الناجيات بعد انتهاء العلاج.\n\nطمنيني عليكِ، حابة تسألي عن إيه النهاردة؟\n\nالمصادر المعتمدة: ${links}`
        : `Hello and welcome! You are not alone. I am your specialized AI companion for breast cancer patient education, treatment and recovery guidance, and Baheya Foundation free services in Egypt (hotline 16602).\n\nI can assist you with:\n• Clinical screening eligibility and booking at Baheya.\n• Understanding symptoms and preparing for doctor visits.\n• Safe coping strategies for treatment side effects.\n• Psychosocial support, counseling, and empowerment workshops.\n• Survivorship follow-up care and recurrence monitoring.\n\nHow can I support you today?\n\nVerified sources: ${links}`,
      suggestedQuestions: language === "ar"
        ? ["كيف أحجز كشفاً مبكراً في بهية عبر 16602؟", "ما الأعراض التي تستوجب فحص الثدي لدى الطبيب؟", "ما خدمات الدعم النفسي والتمكين المتاحة؟"]
        : ["How do I book an early screening at Baheya via 16602?", "What symptoms require clinical breast examination?", "What psychosocial support services are available?"],
      citations: sources.map(s => formatCitation(s, language)),
    };
  }

  // 2. Check out-of-scope
  if (!isBreastCancerScope(question)) {
    const safeQuestion = question.replace(/[\r\n]+/g, " ").trim().slice(0, 160);
    return {
      answer: language === "ar"
        ? `آسفة يا حبيبتي، مش هقدر أجاوب على «${safeQuestion}». أنا هنا مخصوصة فقط للرد على الاستشارات والمعلومات الطبية الموثوقة عن سرطان الثدي، مراحل العلاج والتعافي، والدعم النفسي وخدمات مؤسسة بهية. السبب إني بامتنع عن الموضوعات اللي برا المجال ده هو حماية معلوماتك من معلومات ممكن تكون مضللة، وتركيز المساعدة على سلامتكِ. تقدري تسأليني عن الفحوصات، الأعراض، التعامل مع الآثار الجانبية، أو الحجز في بهية. سؤالك خارج هذا السياق.`
        : `I’m sorry, but I can’t answer “${safeQuestion}.” I am dedicated specifically to verified breast cancer education, treatment and recovery guidance, and Baheya Foundation support services. Restricting my answers to breast cancer protects you from misleading information and keeps the focus strictly on your health and safety. I can help with breast cancer symptoms, recovery, or appointment questions. This question is outside my scope.`,
      suggestedQuestions: language === "ar"
        ? ["ما المتابعة المطلوبة بعد علاج سرطان الثدي؟", "ما الأعراض التي ينبغي أن أبلغ عنها فريقي؟", "ما أشكال الدعم المتاحة خلال التعافي؟"]
        : ["What follow-up is needed after breast-cancer treatment?", "Which symptoms should I report to my care team?", "What support is available during recovery?"],
      citations: [],
    };
  }

  // 3. Urgent / Fever / Infection / Catheter / Port (NCI Source)
  if (/حمى|حمي|حرارة|سخونية|قشعريرة|عدوى|التهاب|صديد|جرح|قسطرة|بورت|fever|chills|infection|redness|pus|catheter|port/i.test(normalized)) {
    const nciSource = MEDICAL_SOURCES.find(s => s.id === "nci-infection-neutropenia")!;
    const links = linkCitations([nciSource], language);
    return {
      answer: language === "ar"
        ? `⚠️ **تنبيه طبي عاجل لسلامتكِ (وفق إرشادات المعهد الوطني للسرطان NCI):**\n\n` +
          `ارتفاع درجة الحرارة إلى **38° مئوية (100.5° فهرنهايت) أو أعلى** أثناء الخضوع للعلاج الكيماوي يُعد حالة طارئة تُعرف بـ **حمى نقص العدلات (Neutropenic Fever)**؛ نتيجة انخفاض كرات الدم البيضاء التي تدافع عن جسمكِ ضد الميكروبات.\n\n` +
          `🛑 **تحذير حرج لسلامتكِ:**\n` +
          `• **لا تتناولي أي أدوية خافضة للحرارة من تلقاء نفسكِ** (مثل الباراسيتامول/البنادول، الأسبرين، أو البروفين/الإيبوبروفين) قبل الاتصال بطبيبكِ أو ممرضة الأورام؛ لأن خافض الحرارة قد يخفي العلامة الحقيقية للعدوى ويؤخر بدء المضادات الحيوية التي قد تحتاجينها فوراً.\n\n` +
          `🏥 **ما الذي يجب عليكِ فعله فوراً؟**\n` +
          `1. **الاتصال الفوري بفريق الأورام المعالج** أو التوجه لأقرب قسم طوارئ مجهز للتعامل مع مرضى الأورام اليوم.\n` +
          `2. فحص موضع القسطرة (البورت) وموضع الجراحة: إذا لاحظتِ أي احمرار، سخونة موضعية، تورم، أو إفرازات صديدية، أبلغي الطبيب فوراً.\n` +
          `3. احرصي دائماً على غسل اليدين بالماء الدافئ والصابون بانتظام، وتجنبي مخالطة المصابين بنزلات البرد.\n\n` +
          `المصادر المعتمدة: ${links}`
        : `⚠️ **Urgent Medical Safety Warning (per National Cancer Institute - NCI):**\n\n` +
          `A fever of **100.5°F (38°C) or higher** during cancer treatment is a critical medical emergency called **Neutropenic Fever**, caused by low infection-fighting white blood cells (neutrophils).\n\n` +
          `🛑 **Critical Safety Warning:**\n` +
          `• **DO NOT take fever-reducing medications** (such as acetaminophen/Tylenol, aspirin, or ibuprofen/Advil) before speaking with your doctor or oncology nurse. These medications can mask fever and delay urgent, potentially life-saving antibiotic therapy.\n\n` +
          `🏥 **Immediate Actions Required:**\n` +
          `1. **Contact your oncology team immediately** or proceed to an emergency department today.\n` +
          `2. Check your catheter/port insertion site and any surgical incisions. Report any redness, swelling, pain, or drainage right away.\n` +
          `3. Practice thorough handwashing and avoid crowds and anyone with contagious illnesses.\n\n` +
          `Verified sources: ${links}`,
      suggestedQuestions: language === "ar"
        ? ["متى أتوجه للطوارئ فوراً إذا ارتفعت حرارتي بعد الكيماوي؟", "ما الرقم المباشر لفريق الأورام عند حدوث طوارئ؟", "كيف أعتني بموضع القسطرة (البورت) لمنع العدوى؟"]
        : ["When should I go to the emergency room for fever?", "What is the emergency contact for my oncology team?", "How do I care for my catheter/port site to prevent infection?"],
      citations: [formatCitation(nciSource, language)],
    };
  }

  // 4. Breast Lumps, Discharge, Suspected Tumors, Skin Changes (NCCN + Baheya)
  if (/كتلة|ورم|حلمة|إفراز|افراز|جلد|انكماش|تغير في الثدي|وجع في الثدي|ألم في الصدر|شك|lump|mass|nipple|discharge|breast change|skin dimpling/i.test(normalized)) {
    const nccnSource = MEDICAL_SOURCES.find(s => s.id === "nccn-patient-guidelines")!;
    const baheyaSource = MEDICAL_SOURCES.find(s => s.id === "baheya-egypt-patient-journey")!;
    const sources = [nccnSource, baheyaSource];
    const links = linkCitations(sources, language);
    return {
      answer: language === "ar"
        ? `ألف سلامة عليكِ يا حبيبتي، وإنتِ مش لوحدك. من الطبيعي جداً أن تشعري بالقلق أو الخوف عند ملاحظة أي كتلة أو تغير في الثدي، لكن حابة أطمنك إن **أكثر من 80% من كتل وتغيرات الثدي تكون أوراماً وتغيرات حميدة تماماً** (مثل التكيسات البسيطة أو الأورام الغدية الليفية Fibroadenomas).\n\n` +
          `🩺 **التوجيه الطبي العلمي السليم (وفق إرشادات NCCN للمرضى):**\n` +
          `• **الفحص السريري هو الأساس**: لا يمكن تقييم الكتلة أو التغير عبر الإنترنت أو من خلال الفحص الذاتي وحده. الخطوة الصحيحة والوحيدة هي حجز فحص سريري مباشر لدى طبيب جراحة أورام متخصص.\n` +
          `• **تجنبي طلب تحاليل أو أشعة عشوائية من نفسكِ**: الطبيب المتخصص هو وحده من يحدد نوع الفحص التصويري المطلوب بدقة (مثل الماموجرام أو السونار) بناءً على عمركِ وتكوين نسيج الثدي؛ لضمان الفحص الدقيق وتجنب القلق والتحاليل غير الضرورية.\n\n` +
          `🌸 **الخدمة المجانية بمستشفى بهية (مصر):**\n` +
          `إذا كنتِ في مصر وعمرك **25 سنة فما فوق ولديكِ أعراض ظاهرة** (مثل كتلة أو إفرازات من الحلمة)، يحق لكِ حجز موعد سريري في **«عيادة الجراحة» بمستشفى بهية للكشف والتقييم بالمجان تماماً 100%**.\n` +
          `• للحجز: اتصلي بالخط الساخن **16602** (من الأحد للخميس، 9 ص - 5 م).\n` +
          `• المطلوب يوم الكشف: بطاقة الرقم القومي سارية.\n\n` +
          `المصادر المعتمدة: ${links}`
        : `You are not alone, and it is completely understandable to feel anxious when you notice a breast lump or change. Importantly, **over 80% of breast lumps turn out to be completely benign** (such as fluid-filled cysts or fibroadenomas).\n\n` +
          `🩺 **Scientific Guidance (per NCCN Patient Guidelines):**\n` +
          `• **Clinical examination is the essential first step**: A lump cannot be safely diagnosed online or through self-exam alone. You should have an in-person clinical breast exam by a breast specialist.\n` +
          `• **Avoid self-ordering random lab tests or scans**: Your doctor will determine the exact imaging needed (such as diagnostic mammogram or ultrasound) tailored to your age and tissue density, preventing unnecessary tests or anxiety.\n\n` +
          `🌸 **Free Care at Baheya Foundation (Egypt):**\n` +
          `If you are in Egypt, aged **25 or older with noticeable symptoms** (lump, discharge, skin changes), you can book a free clinical evaluation at **Baheya Hospital's Surgery Clinic (100% free of charge)**.\n` +
          `• Call the hotline: **16602** (Sunday–Thursday, 9 AM–5 PM).\n` +
          `• Bring your valid National ID card on visit day.\n\n` +
          `Verified sources: ${links}`,
      suggestedQuestions: language === "ar"
        ? ["كيف أحجز موعداً في عيادة الجراحة بمستشفى بهية عبر 16602؟", "ما الأسئلة التي يجب أن أطرحها على الطبيب أثناء فحص الكتلة؟", "ما الفرق بين فحص السونار وأشعة الماموجرام؟"]
        : ["How do I book an appointment at Baheya's Surgery Clinic via 16602?", "What questions should I ask my doctor about a breast lump?", "What is the difference between ultrasound and mammogram?"],
      citations: sources.map(s => formatCitation(s, language)),
    };
  }

  // 5. Baheya Booking, Branches, Hotline 16602, Eligibility (Baheya Booking Source)
  if (/حجز|احجز|موعد|مواعيد|16602|خط ساخن|فرع|فروع|الهرم|الشيخ زايد|علوبة|كشف مبكر|عيادة الجراحة|تاريخ وراثي|شروط|مجانا|مجان|booking|appointment|hotline/i.test(normalized)) {
    const baheyaSource = MEDICAL_SOURCES.find(s => s.id === "baheya-egypt-patient-journey")!;
    const links = linkCitations([baheyaSource], language);
    return {
      answer: language === "ar"
        ? `لحجز موعد بمستشفى بهية للاكتشاف المبكر وعلاج سرطان الثدي بالمجان في مصر:\n\n` +
          `📞 **خطوات الحجز:**\n` +
          `• الاتصال بالخط الساخن **16602**.\n` +
          `• مواعيد الاتصال: من الأحد إلى الخميس، من الساعة **9:00 صباحاً حتى 5:00 مساءً**.\n` +
          `• سيقوم ممثل خدمة العملاء بطرح أسئلة لتحديد حالتكِ وتوجيهكِ للمسار الصحيح المتاح.\n\n` +
          `📋 **شروط حجز المواعيد المعتمدة ببهية:**\n` +
          `1. **الكشف المبكر (فحص دوري وقائي دون وجود أي أعراض ظاهرة):**\n` +
          `   - سن **40 سنة فأكثر**: في حال عدم وجود تاريخ وراثي للمرض في العائلة.\n` +
          `   - سن **35 سنة فأكثر**: في حال وجود تاريخ عائلي/وراثي لسرطان الثدي (مثل إصابة الأم أو الأخت أو الخالة).\n` +
          `2. **عيادة الجراحة (عند ظهور أعراض):**\n` +
          `   - سن **25 سنة فما فوق** عند ملاحظة أي كتلة، إفرازات، أو تغيرات في الحلمة أو الجلد.\n\n` +
          `📍 **المستندات المطلوبة والفروع:**\n` +
          `• المستند المطلوب يوم الكشف: **بطاقة الرقم القومي (سارية)**.\n` +
          `• **فرع مركز الهرم**: 4 شارع علوبة، متفرع من أول شارع الهرم بجوار داري، الجيزة.\n` +
          `• **فرع مستشفى الشيخ زايد**: قطعة 40، الحي الأول، الشيخ زايد، أمام كلية الهندسة.\n` +
          `• الفحص والتشخيص والجراحة وجلسات الكيماوي والإشعاعي والدعم تقدم **مجاناً 100%** («بهية دائماً في ظهر كل ست مصرية»).\n\n` +
          `المصادر المعتمدة: ${links}`
        : `To book an appointment at Baheya Foundation for free breast cancer early screening and care in Egypt:\n\n` +
          `📞 **Booking Steps:**\n` +
          `• Call the official hotline: **16602**.\n` +
          `• Working hours: Sunday through Thursday, **9:00 AM to 5:00 PM**.\n` +
          `• A customer service agent will assess your case and schedule you appropriately.\n\n` +
          `📋 **Official Eligibility Criteria:**\n` +
          `1. **Early Screening Clinic (preventive screening with NO symptoms):**\n` +
          `   - Age **40 and older** without hereditary/family history.\n` +
          `   - Age **35 and older** with a family history of breast cancer.\n` +
          `2. **Surgery Clinic (when symptoms are present):**\n` +
          `   - Age **25 and older** if you notice a lump, nipple discharge, or skin changes.\n\n` +
          `📍 **Branches & Documents:**\n` +
          `• Required on visit day: Valid National ID card (بطاقة الرقم القومي).\n` +
          `• **Haram Center**: 4 Alouba St., off begin of Haram St., near Dari, Giza.\n` +
          `• **Sheikh Zayed Hospital**: Plot 40, 1st District, Sheikh Zayed, opposite Faculty of Engineering.\n` +
          `• All screenings, surgeries, chemotherapy, radiotherapy, and support are **100% free of charge**.\n\n` +
          `Verified sources: ${links}`,
      suggestedQuestions: language === "ar"
        ? ["ما شروط حجز الكشف المبكر لمن لديها تاريخ وراثي؟", "ما مواعيد عمل الخط الساخن 16602؟", "أين يقع فرع مستشفى بهية بالشيخ زايد؟"]
        : ["What are the screening criteria with family history?", "What are the working hours of hotline 16602?", "Where is Baheya Sheikh Zayed branch located?"],
      citations: [formatCitation(baheyaSource, language)],
    };
  }

  // 6. Psychological Support, Fear, Anxiety, Depression, Empowerment, Boutique (Baheya Support + ASCO)
  if (/خوف|خايفة|مرعوبة|قلق|قلقانة|صدمة|اكتئاب|حزن|تعبت|نفسي|دعم نفسي|استشارة|جلسات|بوتيك|ورش|خياطة|تطوع|تمكين|psychosocial|counseling|anxiety|depression|distress|boutique|volunteer/i.test(normalized)) {
    const baheyaSupport = MEDICAL_SOURCES.find(s => s.id === "baheya-psychosocial-volunteering")!;
    const ascoSource = MEDICAL_SOURCES.find(s => s.id === "asco-survivorship-guidelines")!;
    const sources = [baheyaSupport, ascoSource];
    const links = linkCitations(sources, language);
    return {
      answer: language === "ar"
        ? `يا حبيبتي، إنتِ مش لوحدك أبداً، وكل مشاعر الخوف، القلق، أو الصدمة النفسية اللي حاسة بيها طبيعية ومفهومة جداً وبتمر بيها كل محاربة في بداية الطريق. صحتكِ النفسية ورفع روحكِ المعنوية جزء أساسي ومثبت علمياً في نجاح خطة العلاج.\n\n` +
          `🌸 **منظومة الدعم الشاملة المتاحة لكِ في مستشفى بهية (بالمجان 100%):**\n` +
          `1. **جلسات الاستشارة النفسية:** جلسات فردية وجماعية منتظمة للمريضات وأسرهن لمساعدتكِ في تجاوز صدمة التشخيص، تقليل التوتر والاكتئاب، واستعادة الأمل والمتعة في الحياة.\n` +
          `2. **الرحلات الترفيهية والزيارات المنزلية:** تنظيم رحلات ترفيهية دورية لتخفيف الضغط العصبي، بالإضافة لزيارات منزلية متخصصة للمريضات اللاتي ليس لديهن مقدمو رعاية لمساندتهن.\n` +
          `3. **ورش التمكين المهني:** ورش تدريبية على الخياطة، صناعة الإكسسوارات، والرسم، لتزويدكِ بمهارات تمكنكِ من بيع منتجاتكِ في البازارات وتحقيق دخل مالي واستعادة الثقة.\n` +
          `4. **مبادرة «بوتيك بهية»:** مبادرة فريدة تمنح المحاربة 4 قسائم سنوياً لاختيار ملابس راقية مجاناً لها ولأسرتها لتعزيز تقدير الذات والبهجة.\n` +
          `5. **فنون وتأهيل:** جلسات دراما وموسيقى، دروس محو أمية ولغة إنجليزية، وجلسات تأمل ويوغا وإرشاد غذائي.\n\n` +
          `🤝 **التوجيه العلمي (وفق إرشادات ASCO):** الجمعية الأمريكية لعلم الأورام تؤكد أن برامج الدعم النفسي المنظمة تقلل أعراض الإرهاق وتحسن جودة الحياة. للاستفادة من هذه الخدمات، اتصلي بالخط الساخن **16602**.\n\n` +
          `المصادر المعتمدة: ${links}`
        : `You are not alone. Experiencing shock, anxiety, or sadness is a completely normal response to a cancer diagnosis. Psychological wellbeing is an evidence-based, vital pillar of your recovery journey.\n\n` +
          `🌸 **Comprehensive Free Support Services at Baheya Hospital:**\n` +
          `1. **Psychosocial Counseling:** Regular individual and group sessions for patients and families to alleviate anxiety and depression, process initial shock, and build resilience.\n` +
          `2. **Recreational Outings & Home Visits:** Stress-relieving trips across Egypt and dedicated home visits for patients without family caregivers.\n` +
          `3. **Women Empowerment Workshops:** Vocational training in sewing, jewelry-making, and painting, with bazaar participation to sell crafts and achieve financial independence.\n` +
          `4. **Boutique Baheya Initiative:** Four vouchers annually providing complimentary quality clothing to uplift self-esteem and morale.\n` +
          `5. **Arts & Wellbeing:** Music, drama, literacy classes, yoga, meditation, and nutritional counseling.\n\n` +
          `🤝 **Scientific Context (ASCO Guidelines):** Clinical oncology guidelines recommend structured psychosocial care to manage fatigue and emotional distress. Call hotline **16602** to join.\n\n` +
          `Verified sources: ${links}`,
      suggestedQuestions: language === "ar"
        ? ["كيف أنضم لجلسات الدعم النفسي المجانية في مستشفى بهية؟", "ما هي مبادرة بوتيك بهية وكيف أستفيد منها؟", "كيف أتعامل مع نوبات القلق والخوف أثناء رحلة العلاج؟"]
        : ["How do I join free counseling sessions at Baheya?", "What is Boutique Baheya and how do I benefit from it?", "How can I manage anxiety and fear during cancer treatment?"],
      citations: sources.map(s => formatCitation(s, language)),
    };
  }

  // 7. Chemo / Radiation / Side Effects (Hair loss, neuropathy, nausea, fatigue) (ASCO + NCCN)
  if (/شعر|تساقط|كيماوي|كيميائي|إشعاع|غثيان|ترجيع|تنميل|أطراف|إرهاق|تعب|فقدان الشهية|hair loss|neuropathy|cipn|nausea|fatigue|radiation/i.test(normalized)) {
    const ascoSource = MEDICAL_SOURCES.find(s => s.id === "asco-survivorship-guidelines")!;
    const nccnSource = MEDICAL_SOURCES.find(s => s.id === "nccn-patient-guidelines")!;
    const sources = [ascoSource, nccnSource];
    const links = linkCitations(sources, language);
    return {
      answer: language === "ar"
        ? `الآثار الجانبية للعلاج مثل تساقط الشعر، الإرهاق، وتنميل الأطراف هي تفاعلات شائعة ومؤقتة، ويمكن إدارتها بفاعلية من خلال الخطوات الطبية الآمنة.\n\n` +
          `💡 **إرشادات التعامل الآمنة وفق أدلة ASCO و NCCN:**\n` +
          `• **تنميل وخدر الأطراف (الاعتلال العصبي CIPN):** أبلغي طبيب الأورام بدرجة التنميل في كل جلسة؛ فالطبيب وحده المؤهل لضبط الجرعات لحماية الأعصاب. تجنبي التعرض لبرودة أو سخونة شديدة، وارتدي أحذية وجوارب قطنية مريحة.\n` +
          `• **تساقط الشعر:** يبدأ عادة بعد أسبوعين إلى 3 أسابيع من بدء العلاج الكيماوي، وهو تساقط مؤقت وينمو الشعر مجدداً بعد إتمام الجرعات. احرصي على ارتداء أغطية رأس قطنية ناعمة لحماية فروة الرأس.\n` +
          `• **الغثيان:** يصف طبيب الأورام أدوية وقائية مخصصة قبل وبعد الجلسة تسيطر على الغثيان بنسبة عالية. تناولي وجبات صغيرة متكررة خفيفة، ولا تتناولي أي أدوية دون وصفة طبيبك.\n` +
          `• **الإرهاق العام:** المشي الخفيف يومياً لمدة 15 إلى 20 دقيقة مع فترات راحة هو الوسيلة الأكثر فاعلية علمياً ومثبتة من ASCO لتخفيف إرهاق العلاج وتنشيط الدورة الدموية.\n\n` +
          `🛑 **تنبيه سلامة:** لا تتناولي أي مكملات غذائية أو أعشاب دون استشارة طبيب الأورام؛ لأن بعضها قد يقلل من فاعلية جلسات العلاج.\n\n` +
          `المصادر المعتمدة: ${links}`
        : `Side effects such as hair loss, fatigue, and peripheral neuropathy are common, temporary reactions to cancer treatment that can be managed effectively with safe guidelines.\n\n` +
          `💡 **Evidence-Based Coping (ASCO & NCCN Guidelines):**\n` +
          `• **Peripheral Neuropathy (CIPN numbness/tingling):** Inform your oncologist at every visit; your doctor may adjust dosage to protect nerves. Avoid extreme heat or cold and wear supportive footwear.\n` +
          `• **Hair Loss:** Typically starts 2–3 weeks after starting chemotherapy and is temporary. Hair regrows robustly after treatment completion. Protect sensitive scalp skin with soft cotton covers.\n` +
          `• **Nausea:** Oncologists prescribe specific preventative antiemetic medications. Eat frequent small, light meals. Do not self-medicate without your doctor's order.\n` +
          `• **Cancer-Related Fatigue:** Moderate physical activity (e.g., 15–20 minutes of daily walking) is clinically proven by ASCO to significantly reduce fatigue.\n\n` +
          `🛑 **Safety Notice:** Never take unprescribed herbal supplements without oncologist approval, as they can interact with chemotherapy or radiation.\n\n` +
          `Verified sources: ${links}`,
      suggestedQuestions: language === "ar"
        ? ["كيف أتعامل مع تنميل اليدين والقدمين الناتج عن الكيماوي؟", "متى يبدأ الشعر بالنمو مجدداً بعد انتهاء العلاج؟", "ما التمارين الخفيفة المناسبة لتخفيف الإرهاق؟"]
        : ["How do I manage chemotherapy-induced peripheral neuropathy?", "When does hair regrow after completing chemotherapy?", "What light exercises are safe to reduce fatigue?"],
      citations: sources.map(s => formatCitation(s, language)),
    };
  }

  // 8. Survivorship, Follow-up Care, Recurrence Surveillance (ASCO + NCI Follow-up)
  if (/بعد\s*(انتهاء|إكمال)|متابعة|ناجية|رعاية الناجيات|عودة الورم|فحوصات دورية|ماموجرام سنوي|تورم الذراع|الوذمة|تأهيل|follow[- ]?up|survivorship|after treatment|recurrence|lymphedema/i.test(normalized)) {
    const ascoSource = MEDICAL_SOURCES.find(s => s.id === "asco-survivorship-guidelines")!;
    const nciFollowup = MEDICAL_SOURCES.find(s => s.id === "nci-follow-up-care")!;
    const sources = [ascoSource, nciFollowup];
    const links = linkCitations(sources, language);
    return {
      answer: language === "ar"
        ? `حمداً لله على سلامتكِ ووصولكِ لمرحلة التعافي والنجاة. خطة المتابعة بعد انتهاء العلاج تهدف للاطمئنان الدوري ومراقبة عدم عودة المرض والحفاظ على صحتكِ العامة.\n\n` +
          `📋 **جدول المتابعة الموصى به علمياً (وفق إرشادات ASCO لرعاية الناجيات):**\n` +
          `1. **الفحص السريري الدوري:** زيارة طبيب الأورام للفحص السريري ومراجعة الأعراض كل **3 إلى 6 أشهر** خلال أول 3 سنوات، ثم كل **6 إلى 12 شهراً** حتى السنة الخامسة، ثم سنوياً بعد ذلك.\n` +
          `2. **أشعة الماموجرام السنوية:** إجراء تصوير الماموجرام مرة واحدة كل سنة لمتابعة الثدي الآخر أو الأنسجة المتبقية.\n` +
          `3. **الوقاية من تورم الذراع (الوذمة اللمفية Lymphedema):** تجنبي قياس الضغط، الحقن الوريدي، وسحب الدم من الذراع في جهة الجراحة، واحرصي على تمارين العلاج الطبيعي والتأهيل الحركي بانتظام (متوفرة بالمجان في بهية).\n` +
          `4. **نمط الحياة الصحي:** الحفاظ على وزن صحي، ممارسة رياضة خفيفة، وتناول غذاء متوازن غني بالخضروات.\n\n` +
          `🚨 **متى تتصلين بطبيبكِ فوراً؟** عند ملاحظة أي كتلة جديدة، ألم مستمر بالعظام، ضيق غير معتاد بالتنفس، أو صداع شديد مستمر.\n\n` +
          `المصادر المعتمدة: ${links}`
        : `Congratulations on reaching the recovery and survivorship phase. Post-treatment survivorship care is designed for regular reassurance, surveillance for recurrence, and maintaining your long-term health.\n\n` +
          `📋 **Recommended Survivorship Schedule (per ASCO Guidelines):**\n` +
          `1. **Clinical Follow-up Visits:** History and physical examination every **3 to 6 months** for the first 3 years, then every **6 to 12 months** through year 5, then annually.\n` +
          `2. **Annual Surveillance Mammography:** An annual mammogram is recommended for remaining breast tissue.\n` +
          `3. **Lymphedema Prevention:** Avoid blood pressure cuffs, blood draws, and heavy lifting on the affected surgical arm, and practice prescribed physical therapy.\n` +
          `4. **Healthy Lifestyle:** Moderate exercise, balanced nutrition, and maintaining a healthy weight.\n\n` +
          `🚨 **When to contact your oncologist:** Any new lump, persistent bone pain, unexplained shortness of breath, or persistent severe headaches.\n\n` +
          `Verified sources: ${links}`,
      suggestedQuestions: language === "ar"
        ? ["ما جدول الفحوصات الدورية الموصى به بعد التعافي؟", "كيف أحمي ذراعي من التورم اللمفاوي بعد الجراحة؟", "ما الأعراض التي تستوجب مراجعة طبيب الأورام فوراً؟"]
        : ["What is the recommended follow-up schedule after recovery?", "How do I protect my arm from lymphedema after surgery?", "What symptoms require immediate contact with my oncologist?"],
      citations: sources.map(s => formatCitation(s, language)),
    };
  }

  // 9. General Breast Cancer Types, Stages, or Diagnosis (NCCN + WHO)
  const defaultSources = MEDICAL_SOURCES.filter(s => ["nccn-patient-guidelines", "who-breast-cancer"].includes(s.id));
  const links = linkCitations(defaultSources, language);
  return {
    answer: language === "ar"
      ? `شكرًا لمشاركتك سؤالكِ. أقدم لكِ هذا التوجيه التثقيفي الموثق علمياً وفق إرشادات شبكة NCCN ومنظمة الصحة العالمية (WHO):\n\n` +
        `• خطط رعاية سرطان الثدي تختلف وتُصمم بشكل فردي لكل حالة حسب نوع الخلايا ومرحلة المرض والخصائص البيولوجية للورم.\n` +
        `• تشمل مسارات العلاج تكاملاً بين الحلول الموضعية (الجراحة والعلاج الإشعاعي) والعلاجات الجهازية (العلاج الكيميائي، الهرموني، الموجّه، والمناعي).\n` +
        `• القاعدة الطبية الذهبية هي دائماً الرجوع لطبيب الأورام لمناقشة الخيارات المناسبة لحالتكِ وعدم الاعتماد على تشخيصات ذاتية.\n\n` +
        `المصادر المعتمدة: ${links}`
      : `Thank you for sharing your question. Here is evidence-based educational guidance per NCCN and WHO guidelines:\n\n` +
        `• Breast cancer care plans are individualized based on cellular characteristics, biological markers, and cancer stage.\n` +
        `• Care integrates local treatments (surgery, radiotherapy) and systemic therapies (chemotherapy, endocrine therapy, targeted therapy, immunotherapy).\n` +
        `• Decisions should always be discussed directly with your oncology team rather than relying on self-diagnosis.\n\n` +
        `Verified sources: ${links}`,
    suggestedQuestions: language === "ar"
      ? ["كيف أستعد لموعدي الطبي القادم؟", "ما الأسئلة التي يجب أن أطرحها على فريق الأورام؟", "كيف أحجز كشفاً مجانياً في بهية عبر 16602؟"]
      : ["How do I prepare for my next medical appointment?", "What questions should I ask my oncology team?", "How do I book a free appointment at Baheya via 16602?"],
    citations: defaultSources.map(s => formatCitation(s, language)),
  };
}
