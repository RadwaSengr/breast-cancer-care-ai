# Medical RAG Architecture

## Scope and guardrails

This prototype indexes only trusted patient-education PDFs from the World Health Organization, National Cancer Institute, and NCCN. It is limited to general breast-cancer after-care education, follow-up preparation, rehabilitation, support, and source-backed escalation guidance. It excludes diagnosis, individualized treatment choices, prognosis, medication dosing, procedure-specific wound instructions, personal health records, and unvetted sources.

## Pipeline

The system accepts a trusted PDF with a canonical HTTPS source URL, stores the original document, extracts page text with `pdf-parse`, normalizes whitespace while preserving paragraph breaks, splits each page into paragraphs and packs them into ~800-character chunks with a 150-character overlap (falling back to a hard character split for any single paragraph longer than the chunk size), creates normalized 64-dimensional semantic projections, stores the vectors in TiDB, retrieves top-k chunks by cosine distance, and sends only those chunks to the response model alongside existing safety rules. Each retrieved citation retains its document, organization, original URL, and page metadata.

## Vector database decision

The project database supports the TiDB `VECTOR(D)` type, `VEC_COSINE_DISTANCE`, and HNSW vector indexes. The implementation uses a fixed 64-dimensional `VECTOR(64)` column and an HNSW cosine index created with an on-demand columnar replica. The project verified `VEC_DIMS` and a vector-index creation path directly against the provisioned database.

The `knowledge_chunk_vectors` relation is represented by a typed Drizzle custom `VECTOR(64)` model for inserts and metadata, while retrieval retains explicit TiDB cosine SQL to use its native ANN index. This pairing keeps the native vector capability visible in the schema without sacrificing the vector-index query path.

TiDB describes vector search as semantic similarity over embeddings, with top-k nearest-neighbor retrieval serving RAG contexts. Its documentation states that fixed-dimensional vector columns can be indexed with HNSW and queried with `ORDER BY VEC_COSINE_DISTANCE(...) LIMIT k`. [1] [2] [3]

## Trusted demonstration PDF

The configured example is the National Cancer Institute’s *Facing Forward: Life After Cancer Treatment* booklet. NCI describes it as a resource for people who have completed cancer treatment, covering follow-up medical care, communication with clinicians, physical and emotional changes, and wellness. Its official PDF is available from the canonical NCI publication page. [4]

## References

[1]: https://docs.pingcap.com/tidb/stable/vector-search-overview/ "TiDB Vector Search Overview"
[2]: https://docs.pingcap.com/tidb/stable/vector-search-data-types/ "TiDB Vector Data Types"
[3]: https://docs.pingcap.com/tidb/stable/vector-search-index/ "TiDB Vector Search Index"
[4]: https://www.cancer.gov/publications/patient-education/facing-forward "NCI: Facing Forward: Life After Cancer Treatment"
