import { createAftercareResponse } from "../server/aftercareChat";

async function main() {
  const response = await createAftercareResponse({
    question: "إزاي أحجز كشف في بهية وما الدعم النفسي اللي عندهم؟",
    language: "ar",
    history: [],
  });

  console.log(JSON.stringify({
    answer: response.answer,
    citations: response.citations,
    questionSources: response.questionSources,
    retrieval: response.retrieval,
  }));
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
