CREATE EXTENSION IF NOT EXISTS vector;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "user_role" AS ENUM ('user', 'admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "conversation_language" AS ENUM ('ar', 'en');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "message_role" AS ENUM ('user', 'assistant');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "alert_level" AS ENUM ('urgent', 'emergency');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "feedback" AS ENUM ('up', 'down');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
DO $$ BEGIN
  CREATE TYPE "document_status" AS ENUM ('processing', 'indexed', 'failed', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversationId" integer NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"citationsJson" text,
	"questionSourcesJson" text,
	"suggestedQuestionsJson" text,
	"alertLevel" "alert_level",
	"alertJson" text,
	"feedback" "feedback",
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"sessionId" varchar(64) NOT NULL,
	"userId" integer,
	"language" "conversation_language" DEFAULT 'en' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_chunk_vectors" (
	"chunkId" integer PRIMARY KEY NOT NULL,
	"embedding" vector(64) NOT NULL,
	"dimensions" integer DEFAULT 64 NOT NULL,
	"embeddingModel" varchar(128) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_chunks" (
	"id" serial PRIMARY KEY NOT NULL,
	"documentId" integer NOT NULL,
	"position" integer NOT NULL,
	"pageFrom" integer NOT NULL,
	"pageTo" integer NOT NULL,
	"heading" varchar(512),
	"content" text NOT NULL,
	"normalizedContent" text NOT NULL,
	"characterCount" integer NOT NULL,
	"tokenEstimate" integer NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "knowledge_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(512) NOT NULL,
	"organization" varchar(256) NOT NULL,
	"sourceUrl" varchar(2048) NOT NULL,
	"storageKey" varchar(512) NOT NULL,
	"storageUrl" varchar(768) NOT NULL,
	"mimeType" varchar(128) DEFAULT 'application/pdf' NOT NULL,
	"status" "document_status" DEFAULT 'processing' NOT NULL,
	"pageCount" integer DEFAULT 0 NOT NULL,
	"chunkCount" integer DEFAULT 0 NOT NULL,
	"characterCount" integer DEFAULT 0 NOT NULL,
	"embeddingModel" varchar(128),
	"ingestionNotes" text,
	"uploadedByUserId" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"indexedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSignedIn" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId")
);
--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "public"."conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunk_vectors" ADD CONSTRAINT "knowledge_chunk_vectors_chunkId_knowledge_chunks_id_fk" FOREIGN KEY ("chunkId") REFERENCES "public"."knowledge_chunks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_chunks" ADD CONSTRAINT "knowledge_chunks_documentId_knowledge_documents_id_fk" FOREIGN KEY ("documentId") REFERENCES "public"."knowledge_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "knowledge_documents" ADD CONSTRAINT "knowledge_documents_uploadedByUserId_users_id_fk" FOREIGN KEY ("uploadedByUserId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chat_messages_conversation_id_idx" ON "chat_messages" USING btree ("conversationId");--> statement-breakpoint
CREATE UNIQUE INDEX "conversations_session_id_unique" ON "conversations" USING btree ("sessionId");--> statement-breakpoint
CREATE INDEX "conversations_user_id_idx" ON "conversations" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_chunks_document_position_unique" ON "knowledge_chunks" USING btree ("documentId","position");--> statement-breakpoint
CREATE INDEX "knowledge_chunks_document_id_idx" ON "knowledge_chunks" USING btree ("documentId");--> statement-breakpoint
CREATE UNIQUE INDEX "knowledge_documents_source_url_unique" ON "knowledge_documents" USING btree ("sourceUrl");--> statement-breakpoint
CREATE INDEX "knowledge_documents_status_idx" ON "knowledge_documents" USING btree ("status");--> statement-breakpoint
CREATE INDEX "knowledge_chunk_vectors_embedding_hnsw_idx" ON "knowledge_chunk_vectors" USING hnsw ("embedding" vector_cosine_ops);
