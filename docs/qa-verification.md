# QA Verification Notes

The landing page and chat page were reviewed in both supported interface languages. The Arabic routes render translated copy with `dir="rtl"`, mirrored navigation, and Noto Kufi Arabic typography. The English routes retain the corresponding left-to-right layout. The AfterCare mark now appears consistently in the landing and chat headers.

The browser-visible chat composer remains mounted while the session-history request resolves, avoiding a full-screen blocking state. Direct API verification confirmed that a general educational query returns a readable inline NCI Markdown citation. A red-flag test message mentioning a fever of 38°C and wound redness returned an `urgent` alert that directs the patient to contact their care team. Database verification confirmed that the same test session stored two messages and persisted a complete alert payload.

The interactive browser check submitted the same red-flag message through the visible composer. At the time of the initial screen capture, the model response was still being generated; the deterministic server-side alert path was separately verified through the API and automated tests.

The completed browser response subsequently showed the urgent alert above the assistant message, readable NCI citations inside the answer and in the source strip, the per-message educational-only footer, and guided follow-up questions. Mobile viewport review at 375×812 confirmed that the Arabic landing page keeps legible hierarchy and touch-friendly controls, while the Arabic chat route preserves RTL alignment and its safety banner without horizontal overflow. The final TypeScript check and Vitest suite completed successfully with 8 passing tests.

## Remaining Hackathon-Demo Limitations

This prototype uses a deliberately small, curated source set and keyword-based retrieval rather than a comprehensive, continuously updated clinical guideline corpus. It must not be presented as a clinical decision-support tool, an emergency service, a diagnostic system, or a replacement for a licensed clinician. Source records should be clinically reviewed, versioned, expanded, and monitored before any real-world patient use.

The red-flag detector is a conservative text-pattern safety layer. It highlights certain common urgent concepts but cannot determine the seriousness of an individual patient's symptoms, confirm a diagnosis, or cover every possible emergency presentation. The assistant stores conversation history by browser session; the prototype does not yet provide patient accounts, consent management, retention controls, audit logs, or the privacy and security review required for protected health information.

The interface makes live model calls, so response latency varies. Production use would require formal evaluation against clinician-authored test sets, systematic safety monitoring, accessibility validation with users, regional emergency-routing policy, and legal/privacy governance.

## Feedback and Session-Privacy Update

The chat interface now exposes bilingual thumbs-up and thumbs-down controls under each saved assistant response, as well as a bilingual checkbox for automatically clearing the current browser-session conversation when the user leaves. Browser review confirmed that the controls render beneath a sourced assistant answer and the toggle is reachable above the conversation. API validation confirmed an `up` feedback selection persisted to the selected message, and an isolated session-clear request removed its conversation record.

Arabic RTL review confirmed the privacy label, helper copy, the per-message feedback prompt, and both feedback button labels render in Arabic while preserving the mirrored layout. Existing English-language conversation content remains in its original language by design; newly created messages use the language selected at the time they are sent.

The browser was reopened on the same saved session after selecting an up-vote. The corresponding Arabic “مفيدة” control was rendered with its selected teal state, confirming that the persisted feedback value was restored into the chat UI.

For the auto-clear flow, the Arabic privacy checkbox was enabled and the user exited through the page’s back action. The app navigated to the Arabic landing page through the clear-enabled exit path; the final state is verified separately against the browser session identifier and database record.

Final end-to-end verification confirmed that the browser session identifier was absent after exit and that the matching conversation count in the database was zero. This confirms that the enabled preference clears both the local session reference and its persisted conversation on normal in-app exit.

## RAG Pipeline Verification

The official NCI *Facing Forward: Life After Cancer Treatment* PDF was processed through the live ingestion path. The result recorded 68 pages, 112 text chunks, and 112 stored `VECTOR(64)` embeddings. A live after-care query returned `retrieval.mode = vector` with four retrieved chunk IDs and a single displayed NCI document citation, confirming that the model receives multiple page-level chunks while the user-facing citation list remains deduplicated.

After applying the inline-link normalizer, the same retrieval-backed answer preserved the four chunk IDs and its single citation record while the PDF URL appeared only once in the answer body and once in the structured citation payload.

The RAG pipeline page was reviewed in English and Arabic. It displays the live index counts, the fixed 64-dimensional vector design, the HNSW/cosine stage, safety scope, source-control rule, the indexed NCI PDF, a retrieval sandbox, and administrator-only ingestion controls. Both directions retained the intended clinical-editorial hierarchy.

An interactive retrieval-sandbox query about follow-up care displayed four nearest NCI PDF chunks with cosine-distance values and page-level provenance. The most relevant chunk surfaced NCI follow-up-care guidance from page 17, followed by other related page-level context.

The final retrieval-backed chat verification returned unique user-facing references for `p.11 · chunk 17`, `p.17 · chunk 28`, `p.17 · chunk 29`, and `p.39 · chunk 62`, while the response’s retrieval object retained source URL, document ID, page range, and cosine distance for every chunk.

The final type check and Vitest run passed with 14 tests, including the typed `VECTOR(64)` table model and page/chunk provenance checks.

An additional mocked retrieval-backed chat test now exercises the full response assembly path. It verifies that every returned vector chunk has a matching page/chunk citation and that the response preserves document ID, source URL, page range, and similarity distance for all retrieved evidence. The final suite passed with 15 tests.

The visible chat interface was exercised with the indexed follow-up-care question. It rendered the user message and the source-grounded generation state while the RAG-backed response was being produced; API and automated checks independently verify the returned page/chunk provenance payload.

The final live RAG response was rechecked after citation cleanup. Its answer now transitions directly to the rendered `National Cancer Institute p.11` Markdown link, without the previous orphaned raw source label. The related automated test suite passed with 17 tests.
