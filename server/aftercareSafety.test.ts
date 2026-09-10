import { describe, expect, it } from "vitest";
import { buildFallbackResponse, buildRetrievedCitations, dedupeInlineSourceLinks, normalizeInlineCitations, removeOrphanedSourceLabels } from "./aftercareChat";
import { detectSafetyAlert } from "./aftercareSafety";
import { retrieveMedicalSources } from "./medicalKnowledge";
import { deserializeSavedMessage } from "./routers";

describe("aftercare safety guardrails", () => {
  it("raises an urgent Arabic alert for fever and wound-related symptoms", () => {
    const alert = detectSafetyAlert("لدي حرارة 38 مع احمرار حول الجرح", "ar");
    expect(alert?.level).toBe("urgent");
    expect(alert?.title).toContain("فريق رعايتك");
  });

  it("raises an emergency alert for breathing difficulty", () => {
    const alert = detectSafetyAlert("I have trouble breathing and chest pain", "en");
    expect(alert?.level).toBe("emergency");
    expect(alert?.action).toContain("emergency");
  });

  it("retrieves the infection source for a fever question and preserves an inline source link in fallback text", () => {
    const sources = retrieveMedicalSources("I have a fever and chills after treatment");
    expect(sources.some(source => source.id === "nci-infection-neutropenia")).toBe(true);

    const fallback = buildFallbackResponse("I have a fever", "en", sources);
    expect(fallback.answer).toContain("https://www.cancer.gov/about-cancer/treatment/side-effects/infection");
    expect(fallback.suggestedQuestions).toHaveLength(3);
  });

  it("converts a raw source URL into a readable inline citation", () => {
    const source = retrieveMedicalSources("fever").find(item => item.id === "nci-infection-neutropenia");
    expect(source).toBeDefined();
    const answer = normalizeInlineCitations(`Call your care team (${source?.url}).`, [source!], "en");
    expect(answer).toBe("Call your care team  [NCI](https://www.cancer.gov/about-cancer/treatment/side-effects/infection).");
  });

  it("converts an escaped source label and title into one inline citation", () => {
    const source = retrieveMedicalSources("fever").find(item => item.id === "nci-infection-neutropenia");
    expect(source).toBeDefined();
    const answer = normalizeInlineCitations(
      "Infection can be serious (\\[NCI\\] National Cancer Institute: Infection and Neutropenia during Cancer Treatment).",
      [source!],
      "en",
    );
    expect(answer).toBe("Infection can be serious ([NCI](https://www.cancer.gov/about-cancer/treatment/side-effects/infection)).");
  });

  it("keeps only one inline link when an answer cites the same document repeatedly", () => {
    const url = "https://www.cancer.gov/publications/patient-education/life-after-treatment.pdf";
    const answer = dedupeInlineSourceLinks(`[NCI](${url}) supports follow-up care. Review it with your clinician [NCI](${url}).`);
    expect(answer).toBe(`[NCI](${url}) supports follow-up care. Review it with your clinician NCI.`);
  });

  it("removes an orphaned raw source label before its page-level provenance link", () => {
    const url = "https://www.cancer.gov/nci.pdf";
    const answer = removeOrphanedSourceLabels(`General care may help. \\[National Cancer Institute\\] [National Cancer Institute p.11 · chunk 17](${url})`);
    expect(answer).toBe(`General care may help. [National Cancer Institute p.11 · chunk 17](${url})`);
  });

  it("also removes an orphaned raw label before a model-generated page citation without a chunk number", () => {
    const url = "https://www.cancer.gov/nci.pdf";
    const answer = removeOrphanedSourceLabels(`General care may help. [National Cancer Institute] [National Cancer Institute p.11](${url})`);
    expect(answer).toBe(`General care may help. [National Cancer Institute p.11](${url})`);
  });

  it("preserves page-level provenance for each retrieved chunk citation", () => {
    const citations = buildRetrievedCitations([
      { id: 21, documentId: 1, title: "Facing Forward", organization: "NCI", sourceUrl: "https://example.org/nci.pdf", content: "first", pageFrom: 11, pageTo: 11, distance: 0.1 },
      { id: 28, documentId: 1, title: "Facing Forward", organization: "NCI", sourceUrl: "https://example.org/nci.pdf", content: "second", pageFrom: 17, pageTo: 17, distance: 0.2 },
    ], "en");
    expect(citations.map(citation => citation.label)).toEqual(["[NCI p.11 · chunk 21]", "[NCI p.17 · chunk 28]"]);
    expect(citations.map(citation => citation.title)).toEqual(["Facing Forward — p. 11", "Facing Forward — p. 17"]);
  });

  it("keeps the fallback payload Arabic when Arabic is selected", () => {
    const sources = retrieveMedicalSources("لدي حمى وقشعريرة");
    const fallback = buildFallbackResponse("لدي حمى", "ar", sources);
    expect(fallback.answer).toContain("شكرًا لمشاركتك سؤالك");
    expect(fallback.answer).toContain("[المعهد الوطني للسرطان]");
    expect(fallback.suggestedQuestions).toHaveLength(3);
  });

  it("rehydrates saved citations, prompts, and the full urgent alert", () => {
    const restored = deserializeSavedMessage({
      id: 7,
      role: "assistant",
      content: "Educational response",
      citationsJson: JSON.stringify([{ id: "nci", organization: "NCI", title: "NCI", label: "[NCI]", url: "https://example.org" }]),
      suggestedQuestionsJson: JSON.stringify(["What should I ask next?"]),
      alertJson: JSON.stringify({ level: "urgent", title: "Contact your care team today", body: "Needs assessment", action: "Call now" }),
      feedback: "up",
      createdAt: new Date("2026-08-17T00:00:00.000Z"),
    });
    expect(restored.citations).toHaveLength(1);
    expect(restored.suggestedQuestions).toEqual(["What should I ask next?"]);
    expect(restored.alert).toMatchObject({ level: "urgent", action: "Call now" });
    expect(restored.feedback).toBe("up");
  });
});
