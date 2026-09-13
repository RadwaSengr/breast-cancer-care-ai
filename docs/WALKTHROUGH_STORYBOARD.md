# AfterCare Walkthrough Storyboard

## Purpose

This walkthrough is designed for the hackathon team. It demonstrates the public patient-education experience, the bounded medical-safety role, source-grounded RAG, and complete English/Arabic interface support. It must not imply diagnosis, treatment advice, or affiliation with any hospital.

| Scene | Approx. duration | Visual | Key point |
|---|---:|---|---|
| Product opening | 0:00–0:08 | Generated motion opening with the AfterCare pink and navy visual system | Calm, source-grounded after-care education |
| English landing | 0:08–0:14 | English LTR landing page | Purpose, limitations, WHO/NCI/NCCN source framing |
| English chat | 0:14–0:22 | English chat interface | Educational-only banner, question entry, citations, feedback, privacy control |
| Medical safety | 0:22–0:28 | Urgent alert treatment in the chat experience | Red-flag escalation is visible and never acts as diagnosis |
| RAG transparency | 0:28–0:38 | English RAG evidence pipeline | Trusted PDF → parsing → chunks → 64D embeddings → TiDB HNSW → retrieval → grounded LLM |
| Arabic switch | 0:38–0:46 | Arabic RTL landing and chat | Complete right-to-left layout and Arabic patient-facing copy |
| Arabic RAG | 0:46–0:54 | Arabic RTL RAG pipeline | Same traceable source pipeline for Arabic interaction |
| Closing | 0:54–1:00 | Navy closing panel | “AfterCare — Calm, traceable patient education.” |

## Verified Product Screens

The real product screenshots confirm the warm blush-pink interface, dark navy evidence panels, high-contrast text, distinct amber/red urgent-symptom treatment, English LTR layout, and Arabic RTL layout. The English landing page visibly presents source cards for WHO, NCI, and NCCN. The Arabic landing page mirrors the navigation and presents the same scope and safety content in Arabic. The RAG page visibly presents the NCI *Facing Forward: Life After Cancer Treatment* PDF, its 68 pages, 112 chunks, 64-dimensional vector layer, TiDB HNSW index, and the grounded LLM pipeline.

The fallback composition uses verified live-product captures: English landing (`webdev-preview-root-1787043370990773909-1391.png`), Arabic landing (`webdev-preview-root-1787043371179451150-5845.png`), English chat (`webdev-preview-chat-1787043370484504336-2610.png`), and Arabic chat (`webdev-preview-chat-1787043374587009561-5893.png`). These preserve the actual application interface rather than a generated approximation.

The RAG scenes are English (`webdev-preview-rag-1787043371311271314-6803.png`) and Arabic (`webdev-preview-rag-1787043370779784087-9580.png`). They visibly show the PDF intake, parser and normalization stage, 64D embeddings, TiDB HNSW, top-k retrieval, grounded LLM, and trusted-source restrictions.

## Recording Notes

Use slow, deliberate zooms and transitions. Keep every on-screen claim short and source-focused. Display the urgent-symptom alert only as guidance to contact the care team; do not animate or narrate a diagnosis. When demonstrating language, visually transition from the English language toggle to the Arabic right-to-left page rather than presenting Arabic as a separate product.

## Delivered Fallback Asset

`aftercare_team_walkthrough.mp4` is a 32.5-second, 1280×720 H.264 walkthrough. It starts with the generated AfterCare opening motion, then transitions through the real English landing, English chat, English RAG, Arabic landing, Arabic chat, and Arabic RAG product captures. This fallback was assembled because the daily AI-video generation allowance permitted only one generated clip.

## Preferred Live Recording

`aftercare_live_walkthrough.mp4` is the preferred delivery asset. It is a 70.60-second, 1280×720 H.264 browser recording created through live Chromium interaction, not a slideshow. It visibly scrolls the real English landing page, clicks into the chat, writes a general after-care question, waits for the source-grounded RAG answer and citations, records a feedback click, writes a fever-and-wound-concern question to show the urgent safety alert, returns through the real interface, opens the RAG pipeline, and clicks into the Arabic right-to-left view.

Visual review of the final recording confirmed the English landing and chat interactions, long-form RAG response panels with source chips, the urgent-safety response sequence, and the Arabic RTL RAG page with its 1 document / 112 chunks / 64-dimensional-vector / cosine-TiDB-HNSW summary.
