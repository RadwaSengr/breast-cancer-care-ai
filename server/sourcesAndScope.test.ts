import { describe, expect, it } from "vitest";
import { MEDICAL_SOURCES, retrieveMedicalSources } from "./medicalKnowledge";
import { createAftercareResponse } from "./aftercareChat";
import { answerFromBundledSources } from "../client/src/lib/staticRag";

describe("5 Authoritative RAG Sources Integrity", () => {
  it("contains all 5 user-requested authoritative source URLs", () => {
    const urls = MEDICAL_SOURCES.map(source => source.url);
    expect(urls).toContain("https://baheya.org/ar/baheya_services/4");
    expect(urls).toContain("https://www.cancer.gov/about-cancer/treatment/side-effects/infection");
    expect(urls).toContain("https://www.nccn.org/patientresources/patient-resources/guidelines-for-patients");
    expect(urls).toContain("https://baheya.org/ar/media_article/320");
    expect(urls).toContain("https://www.asco.org/news-initiatives/current-initiatives/cancer-care-initiatives/prevention-survivorship/survivorship-compendium/guidelines");
  });

  it("includes hotline 16602, eligibility criteria and branches in Baheya booking source", () => {
    const bookingSource = MEDICAL_SOURCES.find(s => s.url === "https://baheya.org/ar/media_article/320");
    expect(bookingSource).toBeDefined();
    expect(bookingSource!.content.ar).toContain("16602");
    expect(bookingSource!.content.ar).toContain("35");
    expect(bookingSource!.content.ar).toContain("40");
    expect(bookingSource!.content.ar).toContain("25");
    expect(bookingSource!.content.ar).toContain("الهرم");
    expect(bookingSource!.content.ar).toContain("الشيخ زايد");
  });

  it("includes counseling, boutique, and volunteering in Baheya psychosocial support source", () => {
    const supportSource = MEDICAL_SOURCES.find(s => s.url === "https://baheya.org/ar/baheya_services/4");
    expect(supportSource).toBeDefined();
    expect(supportSource!.content.ar).toContain("بوتيك بهية");
    expect(supportSource!.content.ar).toContain("استشارة");
    expect(supportSource!.content.ar).toContain("تمكين");
    expect(supportSource!.content.ar).toContain("التطوع");
  });

  it("warns about fever threshold >= 38C and avoiding fever reducers in NCI infection source", () => {
    const nciSource = MEDICAL_SOURCES.find(s => s.url === "https://www.cancer.gov/about-cancer/treatment/side-effects/infection");
    expect(nciSource).toBeDefined();
    expect(nciSource!.content.ar).toContain("38°");
    expect(nciSource!.content.ar).toContain("خافضة للحرارة");
    expect(nciSource!.content.en).toContain("100.5°F (38°C)");
    expect(nciSource!.content.en).toContain("acetaminophen");
  });

  it("routes fever queries specifically to NCI infection and neutropenia", () => {
    const sources = retrieveMedicalSources("عندي سخونية وحرارة بعد الكيماوي");
    expect(sources[0]?.id).toBe("nci-infection-neutropenia");
  });

  it("routes booking queries specifically to Baheya booking source", () => {
    const sources = retrieveMedicalSources("عايزة احجز كشف مبكر في بهية فرع الشيخ زايد");
    expect(sources[0]?.id).toBe("baheya-egypt-patient-journey");
  });
});

describe("Strict Domain Scope & Anti-Hallucination Guardrails", () => {
  it("strictly rejects completely unrelated questions in createAftercareResponse", async () => {
    const outOfScopeQuestions = [
      "طريقة عمل كب كيك بالشوكولاتة",
      "What is the capital of France?",
      "اكتب لي كود بايثون لحساب الضرائب",
      "عندي وجع شديد في أسناني وضرس العقل",
      "من فاز في مباراة كرة القدم أمس؟",
    ];

    for (const question of outOfScopeQuestions) {
      const response = await createAftercareResponse({ question, language: "ar", history: [] });
      expect(response.answer).toContain("خارج هذا السياق");
      expect(response.citations).toHaveLength(0);
    }
  });

  it("rejects out-of-scope questions in static client RAG fallback", () => {
    const res = answerFromBundledSources("طريقة تصليح موتور السيارة", "ar");
    expect(res.answer).toContain("خارج هذا السياق");
    expect(res.citations).toHaveLength(0);
  });

  it("greets patients warmly and introduces breast cancer care scope on greetings in static RAG", () => {
    const res = answerFromBundledSources("السلام عليكم", "ar");
    expect(res.answer).toContain("إنتِ مش لوحدك");
    expect(res.answer).toContain("16602");
    expect(res.citations.length).toBeGreaterThan(0);
  });
});

describe("Clinical Consultation Quality & Patient Safety (No Harmful Prescriptions)", () => {
  it("answers lump concerns with reassuring scientific guidance, no drug prescription, and Baheya referral", () => {
    const res = answerFromBundledSources("حاسة بكتلة في صدري وخايفة جداً تكون ورم خبيث، أعمل إيه؟", "ar");
    // Empathetic reassurance
    expect(res.answer).toContain("إنتِ مش لوحدك");
    expect(res.answer).toContain("حميدة");
    // Enforces doctor clinical exam rather than self-ordering tests or self-medicating
    expect(res.answer).toContain("الفحص السريري");
    expect(res.answer).toContain("16602");
    // Cites NCCN and Baheya
    expect(res.citations.some(c => c.url.includes("nccn.org"))).toBe(true);
    expect(res.citations.some(c => c.url.includes("baheya.org"))).toBe(true);
    // Has 3 suggested questions
    expect(res.suggestedQuestions).toHaveLength(3);
  });

  it("provides urgent safety alert for fever without prescribing antipyretics", () => {
    const res = answerFromBundledSources("عندي سخونية 38.5 بعد جلسة الكيماوي وقشعريرة، آخذ بنادول؟", "ar");
    expect(res.answer).toContain("تنبيه طبي عاجل");
    expect(res.answer).toContain("38°");
    // Strictly forbids taking antipyretics before doctor consultation
    expect(res.answer).toContain("لا تتناولي أي أدوية خافضة للحرارة");
    expect(res.citations.some(c => c.url.includes("cancer.gov"))).toBe(true);
  });

  it("provides full booking, branch and eligibility details for Baheya inquiries", () => {
    const res = answerFromBundledSources("عايزة أعرف شروط حجز الكشف المجاني في مستشفى بهية والفروع", "ar");
    expect(res.answer).toContain("16602");
    expect(res.answer).toContain("40");
    expect(res.answer).toContain("35");
    expect(res.answer).toContain("25");
    expect(res.answer).toContain("الهرم");
    expect(res.answer).toContain("الشيخ زايد");
    expect(res.answer).toContain("مجاناً");
  });

  it("provides comprehensive psychological and emotional support from Baheya & ASCO", () => {
    const res = answerFromBundledSources("نفسيتي مدمرة وخايفة ومش قادرة أتحمل صدمة تشخيص السرطان", "ar");
    expect(res.answer).toContain("إنتِ مش لوحدك");
    expect(res.answer).toContain("جلسات الاستشارة النفسية");
    expect(res.answer).toContain("بوتيك بهية");
    expect(res.answer).toContain("16602");
    expect(res.citations.some(c => c.url.includes("baheya_services/4"))).toBe(true);
  });

  it("explains chemotherapy side effects safely without prescribing drugs", () => {
    const res = answerFromBundledSources("شعري بيقع وعندي تنميل في صوابع إيدي ورجلي وإرهاق بعد الكيماوي", "ar");
    expect(res.answer).toContain("تساقط الشعر");
    expect(res.answer).toContain("تنميل");
    expect(res.answer).toContain("أبلغي طبيب الأورام");
    expect(res.answer).toContain("المشي");
    expect(res.citations.some(c => c.url.includes("asco.org"))).toBe(true);
  });
});
