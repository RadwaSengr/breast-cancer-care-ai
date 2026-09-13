import { customType, index, integer, pgEnum, pgTable, serial, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

const pgVector = customType<{
  data: number[];
  driverData: string;
  config: { dimensions: number };
}>({
  dataType(config) {
    return `vector(${config?.dimensions ?? 64})`;
  },
  toDriver(value) {
    return `[${value.join(",")}]`;
  },
  fromDriver(value) {
    const raw = String(value).replace(/^\[/, "").replace(/\]$/, "");
    return raw ? raw.split(",").map(Number) : [];
  },
});

const userRole = pgEnum("user_role", ["user", "admin"]);
const conversationLanguage = pgEnum("conversation_language", ["ar", "en"]);
const messageRole = pgEnum("message_role", ["user", "assistant"]);
const alertLevel = pgEnum("alert_level", ["urgent", "emergency"]);
const feedback = pgEnum("feedback", ["up", "down"]);
const documentStatus = pgEnum("document_status", ["processing", "indexed", "failed", "rejected"]);

/** Core user table backing the optional Manus OAuth flow. */
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: integer("userId").references(() => users.id, { onDelete: "set null" }),
  language: conversationLanguage("language").notNull().default("en"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("conversations_session_id_unique").on(table.sessionId),
  index("conversations_user_id_idx").on(table.userId),
]);

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversationId").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: messageRole("role").notNull(),
  content: text("content").notNull(),
  citationsJson: text("citationsJson"),
  questionSourcesJson: text("questionSourcesJson"),
  suggestedQuestionsJson: text("suggestedQuestionsJson"),
  alertLevel: alertLevel("alertLevel"),
  alertJson: text("alertJson"),
  feedback: feedback("feedback"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("chat_messages_conversation_id_idx").on(table.conversationId)]);

export const knowledgeDocuments = pgTable("knowledge_documents", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  organization: varchar("organization", { length: 256 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 2048 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 768 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull().default("application/pdf"),
  status: documentStatus("status").notNull().default("processing"),
  pageCount: integer("pageCount").notNull().default(0),
  chunkCount: integer("chunkCount").notNull().default(0),
  characterCount: integer("characterCount").notNull().default(0),
  embeddingModel: varchar("embeddingModel", { length: 128 }),
  ingestionNotes: text("ingestionNotes"),
  uploadedByUserId: integer("uploadedByUserId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  indexedAt: timestamp("indexedAt"),
}, table => [
  uniqueIndex("knowledge_documents_source_url_unique").on(table.sourceUrl),
  index("knowledge_documents_status_idx").on(table.status),
]);

export const knowledgeChunks = pgTable("knowledge_chunks", {
  id: serial("id").primaryKey(),
  documentId: integer("documentId").notNull().references(() => knowledgeDocuments.id, { onDelete: "cascade" }),
  position: integer("position").notNull(),
  pageFrom: integer("pageFrom").notNull(),
  pageTo: integer("pageTo").notNull(),
  heading: varchar("heading", { length: 512 }),
  content: text("content").notNull(),
  normalizedContent: text("normalizedContent").notNull(),
  characterCount: integer("characterCount").notNull(),
  tokenEstimate: integer("tokenEstimate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("knowledge_chunks_document_position_unique").on(table.documentId, table.position),
  index("knowledge_chunks_document_id_idx").on(table.documentId),
]);

export const knowledgeChunkVectors = pgTable("knowledge_chunk_vectors", {
  chunkId: integer("chunkId").primaryKey().references(() => knowledgeChunks.id, { onDelete: "cascade" }),
  embedding: pgVector("embedding", { dimensions: 64 }).notNull(),
  dimensions: integer("dimensions").notNull().default(64),
  embeddingModel: varchar("embeddingModel", { length: 128 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Conversation = typeof conversations.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type KnowledgeDocument = typeof knowledgeDocuments.$inferSelect;
export type KnowledgeChunk = typeof knowledgeChunks.$inferSelect;
export type KnowledgeChunkVector = typeof knowledgeChunkVectors.$inferSelect;
export type InsertKnowledgeChunkVector = typeof knowledgeChunkVectors.$inferInsert;
export const knowledgeChunkVectorModel = {
  tableName: "knowledge_chunk_vectors",
  dimensions: 64,
  distanceFunction: "cosine_distance",
  indexAlgorithm: "HNSW",
} as const;
