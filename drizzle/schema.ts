import { customType, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

const tidbVector = customType<{
  data: number[];
  driverData: string;
  config: { dimensions: number };
}>({
  dataType(config) {
    return `VECTOR(${config?.dimensions ?? 64})`;
  },
  toDriver(value) {
    return `[${value.join(",")}]`;
  },
  fromDriver(value) {
    return JSON.parse(String(value)) as number[];
  },
});

/** Core user table backing the optional Manus OAuth flow. */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  userId: int("userId").references(() => users.id, { onDelete: "set null" }),
  language: mysqlEnum("language", ["ar", "en"]).notNull().default("en"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("conversations_session_id_unique").on(table.sessionId),
  index("conversations_user_id_idx").on(table.userId),
]);

export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  citationsJson: text("citationsJson"),
  questionSourcesJson: text("questionSourcesJson"),
  suggestedQuestionsJson: text("suggestedQuestionsJson"),
  alertLevel: mysqlEnum("alertLevel", ["urgent", "emergency"]),
  alertJson: text("alertJson"),
  feedback: mysqlEnum("feedback", ["up", "down"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("chat_messages_conversation_id_idx").on(table.conversationId)]);

export const knowledgeDocuments = mysqlTable("knowledge_documents", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 512 }).notNull(),
  organization: varchar("organization", { length: 256 }).notNull(),
  sourceUrl: varchar("sourceUrl", { length: 2048 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 768 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull().default("application/pdf"),
  status: mysqlEnum("status", ["processing", "indexed", "failed", "rejected"]).notNull().default("processing"),
  pageCount: int("pageCount").notNull().default(0),
  chunkCount: int("chunkCount").notNull().default(0),
  characterCount: int("characterCount").notNull().default(0),
  embeddingModel: varchar("embeddingModel", { length: 128 }),
  ingestionNotes: text("ingestionNotes"),
  uploadedByUserId: int("uploadedByUserId").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  indexedAt: timestamp("indexedAt"),
}, table => [
  uniqueIndex("knowledge_documents_source_url_unique").on(table.sourceUrl),
  index("knowledge_documents_status_idx").on(table.status),
]);

export const knowledgeChunks = mysqlTable("knowledge_chunks", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull().references(() => knowledgeDocuments.id, { onDelete: "cascade" }),
  position: int("position").notNull(),
  pageFrom: int("pageFrom").notNull(),
  pageTo: int("pageTo").notNull(),
  heading: varchar("heading", { length: 512 }),
  content: text("content").notNull(),
  normalizedContent: text("normalizedContent").notNull(),
  characterCount: int("characterCount").notNull(),
  tokenEstimate: int("tokenEstimate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("knowledge_chunks_document_position_unique").on(table.documentId, table.position),
  index("knowledge_chunks_document_id_idx").on(table.documentId),
]);

export const knowledgeChunkVectors = mysqlTable("knowledge_chunk_vectors", {
  chunkId: int("chunkId").primaryKey().references(() => knowledgeChunks.id, { onDelete: "cascade" }),
  embedding: tidbVector("embedding", { dimensions: 64 }).notNull(),
  dimensions: int("dimensions").notNull().default(64),
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
  distanceFunction: "VEC_COSINE_DISTANCE",
  indexAlgorithm: "HNSW",
} as const;
