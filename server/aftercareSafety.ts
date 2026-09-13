import type { SupportedLanguage } from "./medicalKnowledge";

export type SafetyAlert = {
  level: "urgent" | "emergency";
  title: string;
  body: string;
  action: string;
};

const EMERGENCY_PATTERNS = [
  /trouble\s+breathing|can't\s+breathe|cannot\s+breathe|shortness\s+of\s+breath|chest\s+pain|uncontrolled\s+bleeding|passed\s+out|fainting/i,
  /ضيق\s*(في\s*)?التنفس|لا\s*أستطيع\s*التنفس|ألم\s*في\s*الصدر|نزيف\s*(شديد|لا\s*يتوقف)|إغماء|فقدت\s*الوعي/i,
];

const URGENT_PATTERNS = [
  /fever|temperature\s*(of|is|over|above)?\s*(38|100\.5)|chills|severe\s+pain|worsening\s+pain|wound\s+(opened|opening)|pus|foul\s*(smell|drainage)|spreading\s+redness|warmth|swelling/i,
  /حمى|حرارة|قشعريرة|ألم\s*(شديد|متزايد)|الجرح\s*(فتح|مفتوح|ينزف)|صديد|إفرازات\s*(كريهة|ذات\s*رائحة)|احمرار\s*(متزايد|منتشر)|سخونة|تورم/i,
];

export function detectSafetyAlert(message: string, language: SupportedLanguage): SafetyAlert | null {
  const isEmergency = EMERGENCY_PATTERNS.some(pattern => pattern.test(message));
  if (isEmergency) {
    return language === "ar"
      ? {
          level: "emergency",
          title: "قد تكون هناك حالة طارئة",
          body: "الأعراض المذكورة قد تحتاج تقييماً عاجلاً ولا ينبغي انتظار رد الدردشة.",
          action: "اتصلي بخدمات الطوارئ المحلية الآن أو توجهي إلى أقرب قسم طوارئ، ثم أبلغي فريق علاجك.",
        }
      : {
          level: "emergency",
          title: "This may be an emergency",
          body: "The symptoms you described may need urgent assessment and should not wait for a chat response.",
          action: "Call local emergency services now or go to the nearest emergency department, then inform your cancer care team.",
        };
  }

  const isUrgent = URGENT_PATTERNS.some(pattern => pattern.test(message));
  if (isUrgent) {
    return language === "ar"
      ? {
          level: "urgent",
          title: "تواصلي مع فريق رعايتك اليوم",
          body: "قد تشير الأعراض المذكورة إلى مشكلة تحتاج تقييماً من فريق الرعاية، خصوصاً أثناء العلاج أو بعد إجراء طبي.",
          action: "اتصلي بفريق الأورام أو الجراحة أو رقم الرعاية العاجلة المتاح لك الآن. إذا كانت الأعراض شديدة أو تتفاقم، اطلبي رعاية طارئة.",
        }
      : {
          level: "urgent",
          title: "Contact your care team today",
          body: "The symptoms you mentioned may need assessment by your care team, particularly during treatment or after a procedure.",
          action: "Call your oncology or surgical team, or the urgent-care number you were given, now. Seek emergency care if symptoms are severe or worsening.",
        };
  }

  return null;
}
