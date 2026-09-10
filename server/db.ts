import { and, asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { chatMessages, conversations, InsertUser, users } from "../drizzle/schema";
import { ENV } from "./_core/env";
import type { Citation, QuestionSource } from "./aftercareChat";
import type { SafetyAlert } from "./aftercareSafety";
import type { SupportedLanguage } from "./medicalKnowledge";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId, lastSignedIn: user.lastSignedIn ?? new Date() };
  const updateSet: Record<string, unknown> = { lastSignedIn: values.lastSignedIn };
  (["name", "email", "loginMethod"] as const).forEach(field => {
    if (user[field] !== undefined) {
      values[field] = user[field] ?? null;
      updateSet[field] = user[field] ?? null;
    }
  });
  values.role = user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user");
  updateSet.role = values.role;
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getOrCreateConversation(input: { sessionId: string; language: SupportedLanguage; userId?: number }) {
  const db = await getDb();
  if (!db) return undefined;

  const existing = await db.select().from(conversations).where(eq(conversations.sessionId, input.sessionId)).limit(1);
  if (existing[0]) return existing[0];

  await db.insert(conversations).values({
    sessionId: input.sessionId,
    language: input.language,
    userId: input.userId ?? null,
  });
  const created = await db.select().from(conversations).where(eq(conversations.sessionId, input.sessionId)).limit(1);
  return created[0];
}

export async function findConversationBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(conversations).where(eq(conversations.sessionId, sessionId)).limit(1);
  return result[0];
}

export async function listChatMessages(conversationId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(chatMessages).where(eq(chatMessages.conversationId, conversationId)).orderBy(asc(chatMessages.createdAt));
}

export async function saveChatMessage(input: {
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  questionSources?: QuestionSource[];
  suggestedQuestions?: string[];
  alert?: SafetyAlert | null;
}) {
  const db = await getDb();
  if (!db) return;
  await db.insert(chatMessages).values({
    conversationId: input.conversationId,
    role: input.role,
    content: input.content,
    citationsJson: input.citations ? JSON.stringify(input.citations) : null,
    questionSourcesJson: input.questionSources ? JSON.stringify(input.questionSources) : null,
    suggestedQuestionsJson: input.suggestedQuestions ? JSON.stringify(input.suggestedQuestions) : null,
    alertLevel: input.alert?.level ?? null,
    alertJson: input.alert ? JSON.stringify(input.alert) : null,
  });
}

export async function setMessageFeedback(input: {
  sessionId: string;
  messageId: number;
  feedback: "up" | "down";
}) {
  const db = await getDb();
  if (!db) return false;
  const conversation = await findConversationBySession(input.sessionId);
  if (!conversation) return false;
  await db.update(chatMessages).set({ feedback: input.feedback }).where(and(
    eq(chatMessages.id, input.messageId),
    eq(chatMessages.conversationId, conversation.id),
  ));
  return true;
}

export async function clearConversationForSession(sessionId: string) {
  const db = await getDb();
  if (!db) return false;
  const conversation = await findConversationBySession(sessionId);
  if (!conversation) return true;
  await db.delete(conversations).where(eq(conversations.id, conversation.id));
  return true;
}
