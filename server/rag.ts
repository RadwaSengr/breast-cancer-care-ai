import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { knowledgeChunks, knowledgeChunkVectors, knowledgeDocuments } from "../drizzle/schema";
import { getDb } from "./db";
import { storagePut } from "./storage";
import { BAHYA_KNOWLEDGE_SOURCES } from "./bahyaKnowledge";

export const RAG_EMBEDDING_DIMENSIONS = 64;
export const RAG_EMBEDDING_MODEL = "semantic-hash-64-v1";
export const RAG_SCOPE = {
  included: [
    "General breast-cancer after-care education and survivorship support",
    "Appointment preparation, follow-up care, rehabilitation, support, and source-backed escalation guidance",
  ],
  excluded: [
    "Diagnosis, individualized prognosis, treatment selection, medication doses, and procedural wound-care instructions",
    "Unvetted sources, personal medical records, and documents without a trusted source URL",
  ],
} as const;

export type ParsedPdf = {
  pageCount: number;
  pages: Array<{ pageNumber: number; text: string }>;
  normalizedText: string;
};

export type RagChunk = {
  id: number;
  documentId: number;
  title: string;
  organization: string;
  sourceUrl: string;
  content: string;
  pageFrom: number;
  pageTo: number;
  distance: number;
};

const TRUSTED_SOURCE_HOSTS = new Set([
  "cancer.gov",
  "www.cancer.gov",
  "who.int",
  "www.who.int",
  "nccn.org",
  "www.nccn.org",
  "stacks.cdc.gov",
  "www.cdc.gov",
  "pubmed.ncbi.nlm.nih.gov",
]);

function stripPdfText(text: string) {
  return text
    .replace(/\u0000/g, " ")
    .replace(/[\t\f\v]+/g, " ")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/\s{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Page-level cleanup used right after extraction. Unlike stripPdfText, this
 * intentionally preserves single/double newlines so that paragraph boundaries
 * survive into the chunking stage (see splitIntoParagraphs below).
 */
function cleanExtractedPageText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function assertTrustedPdfSource(sourceUrl: string) {
  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    throw new Error("A valid HTTPS source URL is required.");
  }
  if (url.protocol !== "https:" || !TRUSTED_SOURCE_HOSTS.has(url.hostname)) {
    throw new Error("Only trusted HTTPS sources from WHO, NCI, or NCCN can be indexed.");
  }
}

export async function parsePdfBuffer(buffer: Buffer): Promise<ParsedPdf> {
  // pdf-parse v2 exposes a PDFParse class whose getText() resolves per-page
  // text (result.pages: [{ num, text }]), which keeps page boundaries and
  // natural line breaks so downstream paragraph-based chunking works well.
  const { PDFParse } = await import("pdf-parse") as any;
  const parser = new PDFParse({ data: new Uint8Array(buffer) });

  let result: { pages: Array<{ num: number; text: string }>; total?: number };
  try {
    result = await parser.getText();
  } finally {
    await parser.destroy();
  }

  const pages: Array<{ pageNumber: number; text: string }> = result.pages
    .map(page => ({ pageNumber: page.num, text: cleanExtractedPageText(page.text || "") }))
    .filter(page => page.text.length > 0);

  const normalizedText = pages.map(page => page.text).join("\n\n");
  if (normalizedText.length < 180) {
    throw new Error("The PDF does not contain enough extractable text for safe indexing.");
  }

  return { pageCount: result.total ?? pages.length, pages, normalizedText };
}

/**
 * Splits a page's text into paragraphs on blank lines or the start of a new
 * heading/bullet line, mirroring the standalone parsing/chunking pipeline.
 */
function splitIntoParagraphs(text: string) {
  return text
    .split(/\n{2,}|\n(?=[A-Z•\-])/)
    .map(paragraph => paragraph.trim())
    .filter(paragraph => paragraph.length > 0);
}

/**
 * Greedily packs paragraphs into ~maxCharacters chunks, carrying a small
 * overlap of the previous chunk's tail into the next one so information that
 * lands on a chunk boundary isn't lost from the surrounding context.
 */
function groupParagraphsIntoChunks(paragraphs: string[], maxCharacters: number, overlapCharacters: number) {
  const chunks: string[] = [];
  let current = "";

  for (const paragraph of paragraphs) {
    if (paragraph.length > maxCharacters) {
      if (current) {
        chunks.push(current);
        current = "";
      }
      for (let index = 0; index < paragraph.length; index += Math.max(1, maxCharacters - overlapCharacters)) {
        chunks.push(paragraph.slice(index, index + maxCharacters));
      }
      continue;
    }

    if ((current + "\n\n" + paragraph).length > maxCharacters && current) {
      chunks.push(current);
      const overlapText = current.slice(-overlapCharacters);
      current = overlapText + "\n\n" + paragraph;
    } else {
      current = current ? current + "\n\n" + paragraph : paragraph;
    }
  }

  if (current) chunks.push(current);
  return chunks;
}

export function chunkParsedPdf(parsed: ParsedPdf, maxCharacters = 800, overlapCharacters = 150) {
  const chunks: Array<{ content: string; normalizedContent: string; pageFrom: number; pageTo: number; position: number }> = [];
  let position = 0;

  for (const page of parsed.pages) {
    const paragraphs = splitIntoParagraphs(page.text);
    const pageChunks = groupParagraphsIntoChunks(paragraphs, maxCharacters, overlapCharacters);

    for (const chunkText of pageChunks) {
      const content = chunkText.trim();
      // Skip near-empty fragments (e.g. a lone heading) so they don't add noise.
      if (content.length < 40) continue;
      chunks.push({
        content,
        normalizedContent: stripPdfText(content).toLocaleLowerCase(),
        pageFrom: page.pageNumber,
        pageTo: page.pageNumber,
        position,
      });
      position += 1;
    }
  }

  if (!chunks.length) throw new Error("No indexable text chunks were created from the PDF.");
  return chunks;
}

function hashToken(token: string) {
  let hash = 2166136261;
  for (let index = 0; index < token.length; index += 1) {
    hash ^= token.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function expandClinicalAliases(text: string) {
  const aliases: Array<[RegExp, string]> = [
    [/حمى|حرارة/g, " fever infection"],
    [/جرح|شق|عملية/g, " wound surgery incision"],
    [/احمرار|تورم|إفراز|صديد/g, " redness swelling drainage infection"],
    [/متابعة|موعد/g, " follow-up appointment care team"],
    [/تعاف|تأهيل/g, " recovery rehabilitation support"],
    [/ألم/g, " pain symptom"],
    [/سرطان الثدي/g, " breast cancer"],
    [/بهية|bahya|16602|حجز|احجز|فروع|فرع|الشيخ زايد|العجوزة|الهرم|خدمات محلية|خدمة محلية|دعم نفسي|دعم اجتماعي/g, " bahya booking hotline branch local services egypt psychosocial support"],
  ];
  return aliases.reduce((expanded, [pattern, replacement]) => expanded.replace(pattern, replacement), text);
}

/**
 * A deterministic, normalized 64D semantic projection. It keeps the hackathon
 * pipeline self-contained while TiDB stores and searches a real VECTOR column.
 */
export function createEmbedding(text: string) {
  const expanded = expandClinicalAliases(text.toLocaleLowerCase());
  const tokens = expanded.match(/[A-Za-z0-9\u0600-\u06FF]{2,}/g) ?? [];
  const vector = new Array<number>(RAG_EMBEDDING_DIMENSIONS).fill(0);

  for (const token of tokens) {
    const hash = hashToken(token);
    const dimension = hash % RAG_EMBEDDING_DIMENSIONS;
    const sign = (hash >>> 6) & 1 ? 1 : -1;
    vector[dimension] += sign * (1 + Math.min(token.length, 12) / 12);
  }

  const norm = Math.sqrt(vector.reduce((total, value) => total + value * value, 0)) || 1;
  return vector.map(value => Number((value / norm).toFixed(8)));
}

function embeddingText(embedding: number[]) {
  return `[${embedding.join(",")}]`;
}

export async function indexTrustedPdf(input: {
  title: string;
  organization: string;
  sourceUrl: string;
  fileName: string;
  bytes: Buffer;
  uploadedByUserId?: number;
}) {
  assertTrustedPdfSource(input.sourceUrl);
  if (input.bytes.length > 10 * 1024 * 1024) throw new Error("The PDF exceeds the 10 MB ingestion limit.");
  if (!input.bytes.subarray(0, 4).equals(Buffer.from("%PDF"))) throw new Error("The uploaded file is not a valid PDF.");

  const db = await getDb();
  if (!db) throw new Error("Database connection unavailable.");
  const existing = await db.select().from(knowledgeDocuments).where(eq(knowledgeDocuments.sourceUrl, input.sourceUrl)).limit(1);
  if (existing[0]) throw new Error("This trusted source has already been indexed.");

  const parsed = await parsePdfBuffer(input.bytes);
  const chunks = chunkParsedPdf(parsed);
  const stored = await storagePut(
    `medical-rag/${Date.now()}-${input.fileName.replace(/[^a-zA-Z0-9._-]/g, "-")}`,
    input.bytes,
    "application/pdf",
  );

  await db.insert(knowledgeDocuments).values({
    title: input.title,
    organization: input.organization,
    sourceUrl: input.sourceUrl,
    storageKey: stored.key,
    storageUrl: stored.url,
    status: "processing",
    pageCount: parsed.pageCount,
    characterCount: parsed.normalizedText.length,
    embeddingModel: RAG_EMBEDDING_MODEL,
    uploadedByUserId: input.uploadedByUserId ?? null,
    ingestionNotes: "Trusted PDF parsed, normalized, chunked, and indexed through the Medical RAG pipeline.",
  });
  const document = (await db.select().from(knowledgeDocuments).where(eq(knowledgeDocuments.sourceUrl, input.sourceUrl)).limit(1))[0];
  if (!document) throw new Error("The knowledge document could not be created.");

  try {
    for (const chunk of chunks) {
      await db.insert(knowledgeChunks).values({
        documentId: document.id,
        position: chunk.position,
        pageFrom: chunk.pageFrom,
        pageTo: chunk.pageTo,
        content: chunk.content,
        normalizedContent: chunk.normalizedContent,
        characterCount: chunk.content.length,
        tokenEstimate: Math.max(1, Math.ceil(chunk.content.length / 4)),
      });
      const savedChunk = (await db.select().from(knowledgeChunks)
        .where(and(eq(knowledgeChunks.documentId, document.id), eq(knowledgeChunks.position, chunk.position))).limit(1))[0];
      if (!savedChunk) throw new Error("A knowledge chunk could not be persisted.");
      await db.insert(knowledgeChunkVectors).values({
        chunkId: savedChunk.id,
        embedding: createEmbedding(chunk.normalizedContent),
        dimensions: RAG_EMBEDDING_DIMENSIONS,
        embeddingModel: RAG_EMBEDDING_MODEL,
      });
    }

    await db.update(knowledgeDocuments).set({
      status: "indexed",
      chunkCount: chunks.length,
      indexedAt: new Date(),
    }).where(eq(knowledgeDocuments.id, document.id));
  } catch (error) {
    await db.update(knowledgeDocuments).set({ status: "failed", ingestionNotes: error instanceof Error ? error.message : "Indexing failed." }).where(eq(knowledgeDocuments.id, document.id));
    throw error;
  }

  return { documentId: document.id, pageCount: parsed.pageCount, chunkCount: chunks.length, storageUrl: stored.url };
}

export async function indexTrustedPdfFromUrl(input: {
  title: string;
  organization: string;
  sourceUrl: string;
  uploadedByUserId?: number;
}) {
  assertTrustedPdfSource(input.sourceUrl);
  const response = await fetch(input.sourceUrl, { redirect: "follow" });
  if (!response.ok) throw new Error(`The source PDF could not be downloaded (${response.status}).`);
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("pdf")) throw new Error("The trusted source URL did not return a PDF file.");
  const bytes = Buffer.from(await response.arrayBuffer());
  const fileName = new URL(input.sourceUrl).pathname.split("/").pop() || "trusted-source.pdf";
  return indexTrustedPdf({ ...input, fileName, bytes });
}

export async function indexOfficialBahyaSources() {
  const db = await getDb();
  if (!db) throw new Error("Database connection unavailable.");

  const indexed: Array<{ sourceUrl: string; documentId: number; chunkCount: number }> = [];
  for (const source of BAHYA_KNOWLEDGE_SOURCES) {
    const existing = await db.select().from(knowledgeDocuments).where(eq(knowledgeDocuments.sourceUrl, source.sourceUrl)).limit(1);
    if (existing[0]) {
      indexed.push({ sourceUrl: source.sourceUrl, documentId: existing[0].id, chunkCount: existing[0].chunkCount });
      continue;
    }

    const stored = await storagePut(
      `medical-rag/official-bahya-${Date.now()}.txt`,
      source.content,
      "text/plain; charset=utf-8",
    );
    await db.insert(knowledgeDocuments).values({
      title: source.title,
      organization: source.organization,
      sourceUrl: source.sourceUrl,
      storageKey: stored.key,
      storageUrl: stored.url,
      mimeType: "text/plain",
      status: "processing",
      pageCount: 1,
      characterCount: source.content.length,
      embeddingModel: RAG_EMBEDDING_MODEL,
      ingestionNotes: "Verified official Bahya local-services source captured on 2026-08-23 and indexed as a text source.",
    });
    const document = (await db.select().from(knowledgeDocuments).where(eq(knowledgeDocuments.sourceUrl, source.sourceUrl)).limit(1))[0];
    if (!document) throw new Error("The Bahya source document could not be created.");

    await db.insert(knowledgeChunks).values({
      documentId: document.id,
      position: 0,
      pageFrom: 1,
      pageTo: 1,
      heading: source.title,
      content: source.content,
      normalizedContent: stripPdfText(source.content).toLocaleLowerCase(),
      characterCount: source.content.length,
      tokenEstimate: Math.max(1, Math.ceil(source.content.length / 4)),
    });
    const savedChunk = (await db.select().from(knowledgeChunks)
      .where(and(eq(knowledgeChunks.documentId, document.id), eq(knowledgeChunks.position, 0))).limit(1))[0];
    if (!savedChunk) throw new Error("The Bahya source chunk could not be persisted.");
    await db.insert(knowledgeChunkVectors).values({
      chunkId: savedChunk.id,
      embedding: createEmbedding(savedChunk.normalizedContent),
      dimensions: RAG_EMBEDDING_DIMENSIONS,
      embeddingModel: RAG_EMBEDDING_MODEL,
    });
    await db.update(knowledgeDocuments).set({
      status: "indexed",
      chunkCount: 1,
      indexedAt: new Date(),
    }).where(eq(knowledgeDocuments.id, document.id));
    indexed.push({ sourceUrl: source.sourceUrl, documentId: document.id, chunkCount: 1 });
  }

  return indexed;
}

export async function getIndexedBahyaChunks(): Promise<RagChunk[]> {
  const db = await getDb();
  if (!db) return [];
  const documents = (await db.select().from(knowledgeDocuments).where(eq(knowledgeDocuments.status, "indexed")))
    .filter(document => document.sourceUrl.includes("baheya.org"));
  if (!documents.length) return [];
  const documentIds = documents.map(document => document.id);
  const chunkRows = await db.select({ chunk: knowledgeChunks, document: knowledgeDocuments })
    .from(knowledgeChunks)
    .innerJoin(knowledgeDocuments, eq(knowledgeChunks.documentId, knowledgeDocuments.id))
    .where(inArray(knowledgeChunks.documentId, documentIds));

  return chunkRows
    .map(row => ({
      id: row.chunk.id,
      documentId: row.document.id,
      title: row.document.title,
      organization: row.document.organization,
      sourceUrl: row.document.sourceUrl,
      content: row.chunk.content,
      pageFrom: row.chunk.pageFrom,
      pageTo: row.chunk.pageTo,
      distance: 0,
    }))
    .sort((left, right) => left.documentId - right.documentId);
}

export async function retrieveRelevantChunks(query: string, limit = 4): Promise<RagChunk[]> {
  const db = await getDb();
  if (!db) return [];
  const vector = embeddingText(createEmbedding(query));
  const raw = await db.execute(sql`
    SELECT v.chunkId, VEC_COSINE_DISTANCE(v.embedding, ${vector}) AS distance
    FROM knowledge_chunk_vectors v
    ORDER BY VEC_COSINE_DISTANCE(v.embedding, ${vector}) ASC
    LIMIT ${limit}
  `);
  const resultRows = (Array.isArray(raw) && Array.isArray(raw[0]) ? raw[0] : raw) as unknown as Array<{ chunkId: number; distance: number }>;
  const rows = resultRows.map(row => ({
    chunkId: Number(row.chunkId), distance: Number(row.distance),
  }));
  if (!rows.length) return [];

  const chunkRows = await db.select({ chunk: knowledgeChunks, document: knowledgeDocuments })
    .from(knowledgeChunks)
    .innerJoin(knowledgeDocuments, eq(knowledgeChunks.documentId, knowledgeDocuments.id))
    .where(and(inArray(knowledgeChunks.id, rows.map(row => row.chunkId)), eq(knowledgeDocuments.status, "indexed")));
  const order = new Map(rows.map(row => [row.chunkId, row.distance]));
  return chunkRows
    .map(row => ({
      id: row.chunk.id,
      documentId: row.document.id,
      title: row.document.title,
      organization: row.document.organization,
      sourceUrl: row.document.sourceUrl,
      content: row.chunk.content,
      pageFrom: row.chunk.pageFrom,
      pageTo: row.chunk.pageTo,
      distance: order.get(row.chunk.id) ?? 1,
    }))
    .sort((left, right) => left.distance - right.distance);
}

export async function getRagPipelineOverview() {
  const db = await getDb();
  if (!db) return { documents: [], indexedDocumentCount: 0, indexedChunkCount: 0, embeddingModel: RAG_EMBEDDING_MODEL, dimensions: RAG_EMBEDDING_DIMENSIONS };
  const documents = await db.select().from(knowledgeDocuments).orderBy(desc(knowledgeDocuments.createdAt));
  const indexedDocumentCount = documents.filter(document => document.status === "indexed").length;
  const indexedChunkCount = documents.reduce((total, document) => total + document.chunkCount, 0);
  return { documents, indexedDocumentCount, indexedChunkCount, embeddingModel: RAG_EMBEDDING_MODEL, dimensions: RAG_EMBEDDING_DIMENSIONS };
}
