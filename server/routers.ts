import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { createAftercareResponse, detectQuestionLanguage, type Citation, type QuestionSource } from "./aftercareChat";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import { clearConversationForSession, findConversationBySession, getOrCreateConversation, listChatMessages, saveChatMessage, setMessageFeedback } from "./db";
import type { ChatMessage } from "../drizzle/schema";
import { getRagPipelineOverview, indexTrustedPdf, indexTrustedPdfFromUrl, RAG_SCOPE, retrieveRelevantChunks } from "./rag";

const sessionSchema = z.string().uuid();
const chatSchema = z.object({
  sessionId: sessionSchema,
  language: z.enum(["ar", "en"]),
  message: z.string().trim().min(1).max(1600),
});

function parseArray<T>(raw: string | null): T[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as T[] : [];
  } catch {
    return [];
  }
}

export function deserializeSavedMessage(message: Pick<ChatMessage, "id" | "role" | "content" | "citationsJson" | "questionSourcesJson" | "suggestedQuestionsJson" | "alertJson" | "feedback" | "createdAt">) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    citations: parseArray<Citation>(message.citationsJson),
    questionSources: parseArray<QuestionSource>(message.questionSourcesJson),
    suggestedQuestions: parseArray<string>(message.suggestedQuestionsJson),
    alert: message.alertJson ? JSON.parse(message.alertJson) : null,
    feedback: message.feedback,
    createdAt: message.createdAt,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  aftercare: router({
    history: publicProcedure.input(z.object({ sessionId: sessionSchema })).query(async ({ input }) => {
      const conversation = await findConversationBySession(input.sessionId);
      if (!conversation) return { messages: [] };
      const messages = await listChatMessages(conversation.id);
      return {
        messages: messages.map(deserializeSavedMessage),
      };
    }),
    chat: publicProcedure.input(chatSchema).mutation(async ({ ctx, input }) => {
      const responseLanguage = detectQuestionLanguage(input.message, input.language);
      const conversation = await getOrCreateConversation({
        sessionId: input.sessionId,
        language: input.language,
        userId: ctx.user?.id,
      });
      const previousMessages = conversation ? await listChatMessages(conversation.id) : [];
      const history = previousMessages.slice(-6).map(message => ({ role: message.role, content: message.content }));
      const response = await createAftercareResponse({
        question: input.message,
        language: responseLanguage,
        history,
      });

      if (conversation) {
        await saveChatMessage({ conversationId: conversation.id, role: "user", content: input.message });
        await saveChatMessage({
          conversationId: conversation.id,
          role: "assistant",
          content: response.answer,
          citations: response.citations,
          questionSources: response.questionSources,
          suggestedQuestions: response.suggestedQuestions,
          alert: response.alert,
        });
      }
      const savedMessages = conversation ? await listChatMessages(conversation.id) : [];
      const savedAssistant = savedMessages.at(-1);
      return { ...response, messageId: savedAssistant?.id ?? null, responseLanguage };
    }),
    feedback: publicProcedure.input(z.object({
      sessionId: sessionSchema,
      messageId: z.number().int().positive(),
      feedback: z.enum(["up", "down"]),
    })).mutation(async ({ input }) => ({
      saved: await setMessageFeedback(input),
      feedback: input.feedback,
    })),
    clear: publicProcedure.input(z.object({ sessionId: sessionSchema })).mutation(async ({ input }) => ({
      cleared: await clearConversationForSession(input.sessionId),
    })),
  }),
  rag: router({
    overview: publicProcedure.query(async () => ({
      ...(await getRagPipelineOverview()),
      scope: RAG_SCOPE,
    })),
    previewRetrieval: publicProcedure.input(z.object({ query: z.string().trim().min(2).max(600) })).query(async ({ input }) => ({
      chunks: await retrieveRelevantChunks(input.query),
    })),
    ingestFromUrl: adminProcedure.input(z.object({
      title: z.string().trim().min(4).max(512),
      organization: z.string().trim().min(2).max(256),
      sourceUrl: z.string().url().max(2048),
    })).mutation(async ({ ctx, input }) => indexTrustedPdfFromUrl({ ...input, uploadedByUserId: ctx.user.id })),
    ingestPdf: adminProcedure.input(z.object({
      title: z.string().trim().min(4).max(512),
      organization: z.string().trim().min(2).max(256),
      sourceUrl: z.string().url().max(2048),
      fileName: z.string().trim().min(4).max(255),
      pdfBase64: z.string().min(200).max(14 * 1024 * 1024),
    })).mutation(async ({ ctx, input }) => {
      const bytes = Buffer.from(input.pdfBase64.replace(/^data:application\/pdf;base64,/, ""), "base64");
      return indexTrustedPdf({ ...input, bytes, uploadedByUserId: ctx.user.id });
    }),
  }),
});

export type AppRouter = typeof appRouter;
