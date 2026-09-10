export type LocalGuideLanguage = "ar" | "en";

export const bahyaSources = {
  booking: "https://baheya.org/ar/media_article/320",
  support: "https://baheya.org/ar/baheya_services/4",
  rehabilitation: "https://baheya.org/ar/show-department/16",
  contact: "https://baheya.org/ar/contact-us",
  home: "https://baheya.org/ar",
  physiotherapy: "https://baheya.org/ar/news/335",
} as const;

export const bahyaHospitalInfo = {
  name: { ar: "مؤسسة بهية لسرطان الثدي", en: "Baheya Breast Cancer Foundation" },
  type: { ar: "مؤسسة مصرية غير ربحية", en: "A non-profit Egyptian institution" },
  description: {
    ar: "مؤسسة بهية هي مؤسسة مصرية خيرية متخصصة منذ تأسيسها في الاكتشاف المبكر لسرطان الثدي وعلاجه ودعم المريضات وعائلاتهن مجانًا. تعتبر بهية من المؤسسات الرائدة في المنطقة في مجال أبحاث وخدمات سرطان الثدي، وتعمل على دعم كل مريضة من لحظة التشخيص وحتى ما بعد التعافي — وهو ما تسميه المؤسسة \"رحلة المحاربة\".",
    en: "Baheya is an Egyptian charitable institution that has specialized since its founding in the early detection of breast cancer, its treatment, and the support of patients and their families — free of charge. Baheya is among the leading institutions in the region in breast-cancer research and services, and it supports every patient from diagnosis through beyond recovery, which the institution calls \"the warrior’s journey\".",
  },
  pillars: {
    ar: [
      { icon: "Microscope", title: "الاكتشاف المبكر والعلاج", detail: "تصوير تشخيصي حديث، جراحة، علاج كيميائي وإشعاعي وعلاج بالهرمونات.", source: "rehabilitation" },
      { icon: "HeartPulse", title: "الدعم النفسي والاجتماعي", detail: "جلسات فردية وجماعية ودعم للأزواج والأسرة لرفع الروح المعنوية أثناء الرحلة.", source: "support" },
      { icon: "Activity", title: "العلاج الطبيعي وإعادة التأهيل", detail: "تأهيل الذراع بعد الجراحة، برامج تثقيف ودعم، وعلاج طبيعي عن بعد.", source: "physiotherapy" },
      { icon: "GraduationCap", title: "التوعية والبحث العلمي", detail: "حملات توعية مجتمعية بالمصري ومشاركة في أبحاث سرطان الثدي.", source: "home" },
    ],
    en: [
      { icon: "Microscope", title: "Early detection & treatment", detail: "Modern diagnostic imaging, surgery, chemotherapy, radiotherapy, and hormone therapy.", source: "rehabilitation" },
      { icon: "HeartPulse", title: "Psychosocial support", detail: "Individual and group sessions plus support for spouses and families along the journey.", source: "support" },
      { icon: "Activity", title: "Physiotherapy & rehabilitation", detail: "Post-surgery arm rehabilitation, education and support programs, and remote physiotherapy.", source: "physiotherapy" },
      { icon: "GraduationCap", title: "Awareness & research", detail: "Community awareness campaigns in Egyptian Arabic and participation in breast-cancer research.", source: "home" },
    ],
  },
  highlights: {
    ar: [
      { label: "تقدم خدماتها", value: "مجانًا" },
      { label: "تساند المحاربات", value: "حتى 10 سنوات" },
      { label: "خط ساخن موحد", value: "16602" },
      { label: "فروع", value: "فرعان" },
    ],
    en: [
      { label: "Services offered", value: "Free of charge" },
      { label: "Patient support span", value: "Up to 10 years" },
      { label: "Unified hotline", value: "16602" },
      { label: "Branches", value: "2" },
    ],
  },
  motto: {
    ar: "\"إنتِ مش لوحدك\" — بهية في ظهر كل ست مصرية.",
    en: "\"You are not alone.\" — Baheya stands behind every Egyptian woman.",
  },
} as const;

export const bahyaLocalGuide = {
  verifiedOn: "2026-08-18",
  hotline: "16602",
  email: "info@baheya.org",
  locations: [
    {
      id: "haram",
      mapUrl: "https://maps.app.goo.gl/oUDabd5E4NouSF786",
      ar: { title: "مستشفى بهية — الهرم/العجوزة، الجيزة", address: "4 شارع علوبة، متفرع من شارع الهرم، الجيزة (المقر الرئيسي)" },
      en: { title: "Bahya Hospital — Haram/Agouza, Giza", address: "4 Allouba St., off El Haram St., Giza (main site)" },
    },
    {
      id: "zayed",
      mapUrl: "https://maps.app.goo.gl/qUeqFCmNUNCgarck6",
      ar: { title: "بهية — الشيخ زايد، الجيزة", address: "الحي الأول، الشيخ زايد، الجيزة (فرع حديث)" },
      en: { title: "Bahya — Sheikh Zayed, Giza", address: "First District, Sheikh Zayed City, Giza (modern branch)" },
    },
  ],
  screeningConditions: {
    ar: [
      { age: "40 سنة فأكثر", history: "دون تاريخ وراثي", note: "بدون أعراض ظاهرة — للكشف المبكر" },
      { age: "35 سنة فأكثر", history: "مع تاريخ وراثي", note: "بدون أعراض ظاهرة — للكشف المبكر" },
      { age: "25 سنة فأكثر", history: "عند ظهور أعراض", note: "تحويل إلى عيادة الجراحة بعد تقييم ممثل الخدمة" },
    ],
    en: [
      { age: "Age 40+", history: "No hereditary history", note: "No symptoms — early-detection screening" },
      { age: "Age 35+", history: "With hereditary history", note: "No symptoms — early-detection screening" },
      { age: "Age 25+", history: "When symptoms appear", note: "Referred to the surgery clinic after the representative’s assessment" },
    ],
  },
} as const;

export const isOfficialBahyaSource = (url: string) => new URL(url).hostname === "baheya.org";
