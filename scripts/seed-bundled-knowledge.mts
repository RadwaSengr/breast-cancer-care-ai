import "dotenv/config";
import { ensureBundledKnowledgeBase } from "../server/rag";

try {
  const result = await ensureBundledKnowledgeBase();
  console.log("[RAG] Bundled knowledge base ready:", JSON.stringify(result));
} catch (error) {
  console.error("[RAG] Bundled knowledge base seeding failed:", error);
  process.exitCode = 1;
}
