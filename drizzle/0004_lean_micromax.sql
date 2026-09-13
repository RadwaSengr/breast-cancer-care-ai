CREATE TABLE `knowledge_chunks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`documentId` int NOT NULL,
	`position` int NOT NULL,
	`pageFrom` int NOT NULL,
	`pageTo` int NOT NULL,
	`heading` varchar(512),
	`content` text NOT NULL,
	`normalizedContent` text NOT NULL,
	`characterCount` int NOT NULL,
	`tokenEstimate` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `knowledge_chunks_id` PRIMARY KEY(`id`),
	CONSTRAINT `knowledge_chunks_document_position_unique` UNIQUE(`documentId`,`position`)
);
--> statement-breakpoint
CREATE TABLE `knowledge_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(512) NOT NULL,
	`organization` varchar(256) NOT NULL,
	`sourceUrl` varchar(2048) NOT NULL,
	`storageKey` varchar(512) NOT NULL,
	`storageUrl` varchar(768) NOT NULL,
	`mimeType` varchar(128) NOT NULL DEFAULT 'application/pdf',
	`status` enum('processing','indexed','failed','rejected') NOT NULL DEFAULT 'processing',
	`pageCount` int NOT NULL DEFAULT 0,
	`chunkCount` int NOT NULL DEFAULT 0,
	`characterCount` int NOT NULL DEFAULT 0,
	`embeddingModel` varchar(128),
	`ingestionNotes` text,
	`uploadedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`indexedAt` timestamp,
	CONSTRAINT `knowledge_documents_id` PRIMARY KEY(`id`),
	CONSTRAINT `knowledge_documents_source_url_unique` UNIQUE(`sourceUrl`)
);
--> statement-breakpoint
ALTER TABLE `knowledge_chunks` ADD CONSTRAINT `knowledge_chunks_documentId_knowledge_documents_id_fk` FOREIGN KEY (`documentId`) REFERENCES `knowledge_documents`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `knowledge_documents` ADD CONSTRAINT `knowledge_documents_uploadedByUserId_users_id_fk` FOREIGN KEY (`uploadedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `knowledge_chunks_document_id_idx` ON `knowledge_chunks` (`documentId`);--> statement-breakpoint
CREATE INDEX `knowledge_documents_status_idx` ON `knowledge_documents` (`status`);
--> statement-breakpoint
CREATE TABLE `knowledge_chunk_vectors` (
  `chunkId` int NOT NULL,
  `embedding` VECTOR(64) NOT NULL,
  `dimensions` int NOT NULL DEFAULT 64,
  `embeddingModel` varchar(128) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT (now()),
  CONSTRAINT `knowledge_chunk_vectors_chunkId_pk` PRIMARY KEY(`chunkId`),
  CONSTRAINT `knowledge_chunk_vectors_chunkId_fk` FOREIGN KEY (`chunkId`) REFERENCES `knowledge_chunks`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
ALTER TABLE `knowledge_chunk_vectors` ADD VECTOR INDEX `knowledge_chunk_vectors_hnsw` ((VEC_COSINE_DISTANCE(`embedding`))) ADD_COLUMNAR_REPLICA_ON_DEMAND;
