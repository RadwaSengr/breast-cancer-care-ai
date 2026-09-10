import { describe, expect, it, vi } from "vitest";

vi.mock("./rag", () => ({
  retrieveRelevantChunks: vi.fn(),
  getIndexedBahyaChunks: vi.fn(),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { createAftercareResponse, detectQuestionLanguage } from "./aftercareChat";
import { invokeLLM } from "./_core/llm";
import { retrieveRelevantChunks } from "./rag";

const nciChunk = {
  id: 17,
  documentId: 1,
  title: "Facing Forward",
  organization: "National Cancer Institute",
  sourceUrl: "https://www.cancer.gov/nci.pdf",
  content: "Recovery support can be discussed with your care team.",
  pageFrom: 11,
  pageTo: 11,
  distance: 0.12,
};

describe("response language through after-care chat", () => {
  it("produces an Arabic answer and Arabic suggestions for an Arabic question despite an English interface", async () => {
    vi.mocked(retrieveRelevantChunks).mockResolvedValue([nciChunk]);
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({
        answer: "الدعم خلال التعافي يمكن مناقشته مع فريق رعايتك. [National Cancer Institute](https://www.cancer.gov/nci.pdf)",
        suggestedQuestions: ["كيف أستعد لموعدي؟", "ما الدعم المتاح؟", "متى أتواصل مع فريقي؟"],
      }) } }],
    } as never);

    const response = await createAftercareResponse({
      question: "ما الدعم المتاح خلال التعافي؟",
      language: detectQuestionLanguage("ما الدعم المتاح خلال التعافي؟", "en"),
      history: [],
    });

    expect(response.answer).toMatch(/[\u0600-\u06FF]/);
    expect(response.suggestedQuestions.every(question => /[\u0600-\u06FF]/.test(question))).toBe(true);
  });

  it("produces an English answer and English suggestions for an English question despite an Arabic interface", async () => {
    vi.mocked(retrieveRelevantChunks).mockResolvedValue([nciChunk]);
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({
        answer: "Recovery support can be discussed with your care team. [National Cancer Institute](https://www.cancer.gov/nci.pdf)",
        suggestedQuestions: ["How do I prepare for an appointment?", "What support is available?", "When should I contact my team?"],
      }) } }],
    } as never);

    const response = await createAftercareResponse({
      question: "What support is available during recovery?",
      language: detectQuestionLanguage("What support is available during recovery?", "ar"),
      history: [],
    });

    expect(response.answer).toMatch(/[A-Za-z]/);
    expect(response.suggestedQuestions.every(question => /^[A-Za-z\s?]+$/.test(question))).toBe(true);
  });
});
