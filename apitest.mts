import { createAftercareResponse } from './server/aftercareChat';
const r = await createAftercareResponse({ question: "What should I do if I feel very tired after my treatment?", language: "en", sessionId: "test-session-1", history: [] });
console.log("answer head:", JSON.stringify(r.answer.slice(0, 400)));
