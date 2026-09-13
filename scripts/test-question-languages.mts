import { createAftercareResponse, detectQuestionLanguage } from "../server/aftercareChat";

const cases = [
  { question: "ما الدعم النفسي المتاح في بهية؟", interfaceLanguage: "en" as const },
  { question: "How do I book an appointment at Bahya?", interfaceLanguage: "ar" as const },
];

async function main() {
  const results = [];
  for (const testCase of cases) {
    const responseLanguage = detectQuestionLanguage(testCase.question, testCase.interfaceLanguage);
    const response = await createAftercareResponse({
      question: testCase.question,
      language: responseLanguage,
      history: [],
    });
    results.push({
      question: testCase.question,
      interfaceLanguage: testCase.interfaceLanguage,
      responseLanguage,
      answer: response.answer,
      citations: response.citations.map(citation => citation.label),
    });
  }
  console.log(JSON.stringify(results));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
