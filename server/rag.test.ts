import { describe, expect, it } from "vitest";
import { knowledgeChunkVectors } from "../drizzle/schema";
import { assertTrustedPdfSource, chunkParsedPdf, createEmbedding, RAG_EMBEDDING_DIMENSIONS } from "./rag";

describe("Medical RAG helpers", () => {
  it("accepts canonical trusted-source HTTPS URLs and rejects unvetted hosts", () => {
    expect(() => assertTrustedPdfSource("https://www.cancer.gov/publications/patient-education/life-after-treatment.pdf")).not.toThrow();
    expect(() => assertTrustedPdfSource("https://example.com/medical-guide.pdf")).toThrow(/trusted HTTPS sources/i);
  });

  it("creates ordered, page-traceable chunks from parsed PDF text", () => {
    const parsed = {
      pageCount: 2,
      normalizedText: "A".repeat(1900),
      pages: [
        { pageNumber: 1, text: "A".repeat(1750) },
        { pageNumber: 2, text: "B".repeat(650) },
      ],
    };
    const chunks = chunkParsedPdf(parsed, 700, 120);
    expect(chunks.length).toBeGreaterThan(2);
    expect(chunks[0]?.pageFrom).toBe(1);
    expect(chunks.at(-1)?.pageFrom).toBe(2);
    expect(chunks.map(chunk => chunk.position)).toEqual(chunks.map((_, index) => index));
  });

  it("creates fixed-length normalized embeddings and expands Arabic clinical concepts", () => {
    const vector = createEmbedding("لدي حمى واحمرار حول جرح العملية");
    expect(vector).toHaveLength(RAG_EMBEDDING_DIMENSIONS);
    const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
    expect(norm).toBeCloseTo(1, 5);
    expect(vector.some(value => value !== 0)).toBe(true);
  });

  it("exposes the TiDB VECTOR storage table through a typed Drizzle model", () => {
    expect(knowledgeChunkVectors.embedding.getSQLType()).toBe("VECTOR(64)");
    expect(knowledgeChunkVectors.dimensions.name).toBe("dimensions");
  });
});
