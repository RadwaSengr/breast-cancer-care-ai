import { describe, expect, it, vi } from "vitest";

vi.mock("./rag", () => ({
  retrieveRelevantChunks: vi.fn(),
  getIndexedBahyaChunks: vi.fn(),
}));

vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

import { createAftercareResponse } from "./aftercareChat";
import { invokeLLM } from "./_core/llm";
import { getIndexedBahyaChunks, retrieveRelevantChunks } from "./rag";

describe("retrieval-backed after-care chat", () => {
  it("returns one page/chunk citation and provenance record for every retrieved vector chunk", async () => {
    const retrieved = [
      { id: 17, documentId: 1, title: "Facing Forward", organization: "National Cancer Institute", sourceUrl: "https://www.cancer.gov/nci.pdf", content: "Choose a doctor for follow-up care.", pageFrom: 11, pageTo: 11, distance: 0.12 },
      { id: 28, documentId: 1, title: "Facing Forward", organization: "National Cancer Institute", sourceUrl: "https://www.cancer.gov/nci.pdf", content: "Follow-up guidelines support discussions with your doctor.", pageFrom: 17, pageTo: 17, distance: 0.18 },
    ];
    vi.mocked(retrieveRelevantChunks).mockResolvedValue(retrieved);
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({
        answer: "General follow-up planning can be discussed with your care team [NCI](https://www.cancer.gov/nci.pdf).",
        suggestedQuestions: ["Who coordinates follow-up?", "What should I bring?", "When is my next visit?"],
      }) } }],
    } as never);

    const response = await createAftercareResponse({
      question: "What is general follow-up care?",
      language: "en",
      history: [],
    });

    expect(response.retrieval.mode).toBe("vector");
    expect(response.retrieval.chunks).toEqual(retrieved.map(({ id, documentId, title, organization, sourceUrl, pageFrom, pageTo, distance }) => ({ id, documentId, title, organization, sourceUrl, pageFrom, pageTo, distance })));
    expect(response.citations.map(citation => citation.label)).toEqual([
      "[National Cancer Institute p.11 · chunk 17]",
      "[National Cancer Institute p.17 · chunk 28]",
    ]);
    expect(response.citations.every((citation, index) => citation.title.includes(`p. ${response.retrieval.chunks[index]?.pageFrom}`))).toBe(true);
    expect(response.questionSources).toEqual([
      {
        id: 17,
        documentId: 1,
        title: "Facing Forward",
        organization: "National Cancer Institute",
        sourceUrl: "https://www.cancer.gov/nci.pdf",
        pageFrom: 11,
        pageTo: 11,
        snippet: "Choose a doctor for follow-up care.",
      },
      {
        id: 28,
        documentId: 1,
        title: "Facing Forward",
        organization: "National Cancer Institute",
        sourceUrl: "https://www.cancer.gov/nci.pdf",
        pageFrom: 17,
        pageTo: 17,
        snippet: "Follow-up guidelines support discussions with your doctor.",
      },
    ]);
  });

  it("returns a source-grounded fallback with retrieved provenance when the model fails", async () => {
    const retrieved = [
      { id: 91, documentId: 7, title: "Facing Forward", organization: "National Cancer Institute", sourceUrl: "https://www.cancer.gov/nci.pdf", content: "Tell your care team about new or worsening symptoms.", pageFrom: 16, pageTo: 16, distance: 0.08 },
    ];
    vi.mocked(retrieveRelevantChunks).mockResolvedValue(retrieved);
    vi.mocked(invokeLLM).mockRejectedValue(new Error("billing unavailable"));

    const response = await createAftercareResponse({
      question: "Which symptoms should I report?",
      language: "en",
      history: [],
    });

    expect(response.answer).toContain("Thank you for sharing your question.");
    expect(response.answer).toContain("https://www.cancer.gov/nci.pdf");
    expect(response.citations).toEqual([
      expect.objectContaining({ label: "[National Cancer Institute p.16 · chunk 91]" }),
    ]);
    expect(response.questionSources).toEqual([
      expect.objectContaining({ id: 91, pageFrom: 16, snippet: "Tell your care team about new or worsening symptoms." }),
    ]);
  });

  it("includes official Bahya sources for local booking and support questions", async () => {
    const retrieved = [
      { id: 17, documentId: 1, title: "Facing Forward", organization: "National Cancer Institute", sourceUrl: "https://www.cancer.gov/nci.pdf", content: "Follow-up support can include rehabilitation.", pageFrom: 11, pageTo: 11, distance: 0.12 },
    ];
    const bahyaSources = [
      { id: 301, documentId: 30, title: "مؤسسة بهية: حجز الكشف والخدمات المحلية", organization: "مؤسسة بهية", sourceUrl: "https://baheya.org/ar/media_article/320", content: "للحجز أو الاستفسار اتصلي بالخط الساخن 16602.", pageFrom: 1, pageTo: 1, distance: 0 },
      { id: 302, documentId: 31, title: "مؤسسة بهية: الدعم النفسي والخدمات الداعمة", organization: "مؤسسة بهية", sourceUrl: "https://baheya.org/ar/baheya_services/4", content: "تقدم بهية جلسات استشارة فردية وجماعية منتظمة.", pageFrom: 1, pageTo: 1, distance: 0 },
    ];
    vi.mocked(retrieveRelevantChunks).mockResolvedValue(retrieved);
    vi.mocked(getIndexedBahyaChunks).mockResolvedValue(bahyaSources);
    vi.mocked(invokeLLM).mockResolvedValue({
      choices: [{ message: { content: JSON.stringify({
        answer: "للحجز أو الاستفسار عن خدمات بهية اتصلي بالخط الساخن 16602. [مؤسسة بهية](https://baheya.org/ar/media_article/320)",
        suggestedQuestions: ["ما شروط الحجز؟", "ما الدعم النفسي المتاح؟", "كيف أتواصل مع بهية؟"],
      }) } }],
    } as never);

    const response = await createAftercareResponse({
      question: "ما الخدمات والدعم المتاحان في بهية؟",
      language: "ar",
      history: [],
    });

    expect(response.citations.slice(0, 2).map(citation => citation.label)).toEqual([
      "[مؤسسة بهية · مصدر رسمي]",
      "[مؤسسة بهية · مصدر رسمي]",
    ]);
    expect(response.questionSources.slice(0, 2)).toEqual([
      expect.objectContaining({ id: 301, sourceUrl: "https://baheya.org/ar/media_article/320" }),
      expect.objectContaining({ id: 302, sourceUrl: "https://baheya.org/ar/baheya_services/4" }),
    ]);
  });
});
