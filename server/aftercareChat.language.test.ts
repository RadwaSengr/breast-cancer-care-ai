import { describe, expect, it } from "vitest";
import { buildRetrievedCitations, detectQuestionLanguage, removeOrphanedSourceLabels } from "./aftercareChat";

describe("question-language detection", () => {
  it("selects Arabic for an Arabic question even when the interface fallback is English", () => {
    expect(detectQuestionLanguage("ما الدعم النفسي المتاح في بهية؟", "en")).toBe("ar");
  });

  it("selects English for an English question even when the interface fallback is Arabic", () => {
    expect(detectQuestionLanguage("How do I book an appointment at Bahya?", "ar")).toBe("en");
  });

  it("uses the interface language only when the message has no detectable letters", () => {
    expect(detectQuestionLanguage("12345", "ar")).toBe("ar");
  });

  it("localizes Bahya source labels and titles for an English response", () => {
    const [citation] = buildRetrievedCitations([{
      id: 1,
      documentId: 1,
      title: "مؤسسة بهية: حجز الكشف والخدمات المحلية",
      organization: "مؤسسة بهية",
      sourceUrl: "https://baheya.org/ar/media_article/320",
      content: "Official booking information.",
      pageFrom: 1,
      pageTo: 1,
      distance: 0,
    }], "en");

    expect(citation).toMatchObject({
      organization: "Bahya Foundation",
      label: "[Bahya Foundation · official source]",
      title: "Bahya Foundation: booking and local services",
    });
  });

  it("removes a repeated Bahya label immediately following its source link", () => {
    expect(removeOrphanedSourceLabels("[Bahya Foundation](https://baheya.org/ar/media_article/320) Bahya Foundation"))
      .toBe("[Bahya Foundation](https://baheya.org/ar/media_article/320)");
  });
});
