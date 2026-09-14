import {
  generateClinicalConsultation,
  isBreastCancerScope,
  type ClinicalCitation,
  type ClinicalConsultationResult,
} from "../../../server/clinicalConsultation";
import { type SupportedLanguage } from "../../../server/medicalKnowledge";

export type StaticCitation = ClinicalCitation;
export type StaticAnswer = ClinicalConsultationResult;

const suggestions = {
  ar: [
    "ما المتابعة المطلوبة بعد علاج سرطان الثدي؟",
    "ما الأعراض التي ينبغي أن أبلغ عنها فريقي؟",
    "ما أشكال الدعم المتاحة خلال التعافي في بهية؟",
  ],
  en: [
    "What follow-up is needed after breast-cancer treatment?",
    "Which symptoms should I report to my care team?",
    "What support is available during recovery at Baheya?",
  ],
} as const;

export function answerFromBundledSources(question: string, language: SupportedLanguage): StaticAnswer {
  return generateClinicalConsultation(question, language);
}

export { isBreastCancerScope as isInScope, suggestions as STATIC_SUGGESTIONS };
