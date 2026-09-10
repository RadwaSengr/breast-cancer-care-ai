import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import {
  ArrowLeft,
  BrainCircuit,
  CheckCircle2,
  Database,
  FileSearch,
  FileText,
  Loader2,
  LockKeyhole,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Split,
  Upload,
  Workflow,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";

const copy = {
  en: {
    back: "Back to overview", language: "العربية", eyebrow: "Medical RAG transparency", title: "From trusted PDF to a grounded answer.",
    body: "A visible, source-controlled RAG pipeline for the hackathon demonstration. Every indexed document is parsed, segmented, embedded, stored as a vector, retrieved by semantic similarity, and provided to the answer model as traceable context.",
    scope: "Safety scope", included: "Included", excluded: "Excluded", pipeline: "Pipeline", pipelineCaption: "The answer model receives only the retrieved context plus the patient’s question and system safety rules.",
    documents: "Knowledge base", documentsCaption: "Only trusted WHO, NCI, and NCCN source URLs may enter the index.", sourceUrl: "Source URL", status: "Status", chunks: "Chunks", pages: "Pages", empty: "No PDFs have been indexed yet. An administrator can add a trusted source below.",
    retrieval: "Retrieval sandbox", retrievalBody: "Try a question to inspect the nearest indexed chunks and their cosine distance before generation.", retrievalPlaceholder: "e.g., What should I report if I have a fever after treatment?", noMatches: "Index a trusted PDF to see vector retrieval results.",
    administrator: "Administrator ingestion", adminBody: "Restricted to project administrators. Upload only trusted PDF guidance and include the original canonical URL for provenance.", signIn: "Sign in as administrator", titleLabel: "Document title", organization: "Organization", ingestUrl: "Ingest trusted PDF from URL", uploadPdf: "Upload trusted PDF", selectPdf: "Select a PDF", uploadReady: "Ready to index", inProgress: "Parsing, chunking, embedding, and indexing…", success: "PDF indexed successfully.",
    statsDocs: "Indexed documents", statsChunks: "Indexed chunks", statsVectors: "Vector dimension", vectorDb: "TiDB HNSW index", sourceControl: "Source-controlled", sourceControlBody: "HTTPS sources are restricted to WHO, NCI, and NCCN. Personal records and unvetted materials are rejected.",
  },
  ar: {
    back: "العودة إلى الصفحة التعريفية", language: "English", eyebrow: "شفافية Medical RAG", title: "من PDF موثوق إلى إجابة منضبطة بالمصادر.",
    body: "خط RAG واضح ومحكوم بالمصادر لعرض الهاكاثون. يُحلل كل مستند مفهرس، ويُقسّم، ويحوّل إلى تمثيل متجهي، ويُخزّن كمتجه، ثم يُسترجع بالتشابه الدلالي ويُمرر للنموذج كسياق قابل للتتبع.",
    scope: "نطاق السلامة", included: "ضمن النطاق", excluded: "خارج النطاق", pipeline: "خط المعالجة", pipelineCaption: "لا يتلقى نموذج الإجابة إلا السياق المسترجع مع سؤال المريضة وقواعد السلامة النظامية.",
    documents: "قاعدة المعرفة", documentsCaption: "لا يدخل الفهرس إلا رابط مصدر موثوق من WHO أو NCI أو NCCN.", sourceUrl: "رابط المصدر", status: "الحالة", chunks: "المقاطع", pages: "الصفحات", empty: "لم تُفهرس أي ملفات PDF بعد. يمكن للمشرف إضافة مصدر موثوق أدناه.",
    retrieval: "مختبر الاسترجاع", retrievalBody: "جرّبي سؤالاً لمعاينة أقرب المقاطع المفهرسة ومسافة cosine قبل التوليد.", retrievalPlaceholder: "مثال: ما الأعراض التي أبلغ عنها إذا أصبت بحمى بعد العلاج؟", noMatches: "فهرسي PDF موثوقًا لمشاهدة نتائج الاسترجاع المتجهي.",
    administrator: "إدخال المشرف", adminBody: "مقيد بمشرف المشروع. ارفعي إرشاد PDF موثوقًا فقط مع الرابط الأصلي لإثبات المصدر.", signIn: "تسجيل الدخول كمشرف", titleLabel: "عنوان المستند", organization: "المنظمة", ingestUrl: "فهرسة PDF موثوق من رابط", uploadPdf: "رفع PDF موثوق", selectPdf: "اختيار PDF", uploadReady: "جاهز للفهرسة", inProgress: "يجري التحليل والتقسيم والتمثيل المتجهي والفهرسة…", success: "تمت فهرسة PDF بنجاح.",
    statsDocs: "المستندات المفهرسة", statsChunks: "المقاطع المفهرسة", statsVectors: "أبعاد المتجه", vectorDb: "فهرس TiDB HNSW", sourceControl: "مصادر مضبوطة", sourceControlBody: "تُقبل فقط مصادر HTTPS من WHO وNCI وNCCN. تُرفض السجلات الشخصية والمواد غير المدققة.",
  },
} as const;

const stageIcons = [ShieldCheck, FileText, Split, BrainCircuit, Database, Search, Sparkles];
const stageNames = {
  en: ["Scope gate", "PDF intake", "Parse & normalize", "64D embeddings", "TiDB HNSW", "Top-k retrieval", "Grounded LLM"],
  ar: ["بوابة النطاق", "إدخال PDF", "تحليل وتنظيف", "تمثيلات 64D", "TiDB HNSW", "استرجاع Top-k", "LLM منضبط"],
};

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read the selected PDF."));
    reader.onload = () => resolve(String(reader.result).replace(/^data:application\/pdf;base64,/, ""));
    reader.readAsDataURL(file);
  });
}

export default function RagPipeline() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<"ar" | "en">(() => new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en");
  const isArabic = language === "ar";
  const t = copy[language];
  const { user, isAuthenticated } = useAuth();
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("Facing Forward: Life After Cancer Treatment");
  const [organization, setOrganization] = useState("National Cancer Institute");
  const [sourceUrl, setSourceUrl] = useState("https://www.cancer.gov/publications/patient-education/life-after-treatment.pdf");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  const overview = trpc.rag.overview.useQuery();
  const retrieval = trpc.rag.previewRetrieval.useQuery({ query }, { enabled: query.trim().length >= 2 });
  const utils = trpc.useUtils();
  const ingestUrl = trpc.rag.ingestFromUrl.useMutation({
    onSuccess: () => { setNotice(t.success); void utils.rag.overview.invalidate(); },
    onError: error => setNotice(error.message),
  });
  const ingestPdf = trpc.rag.ingestPdf.useMutation({
    onSuccess: () => { setNotice(t.success); setSelectedFile(null); void utils.rag.overview.invalidate(); },
    onError: error => setNotice(error.message),
  });
  const busy = ingestUrl.isPending || ingestPdf.isPending;
  const stages = useMemo(() => stageNames[language], [language]);

  const changeLanguage = () => {
    const next = language === "en" ? "ar" : "en";
    setLanguage(next);
    window.history.replaceState({}, "", `/rag?lang=${next}`);
  };

  const beginUpload = async () => {
    if (!selectedFile) return;
    setNotice("");
    const pdfBase64 = await fileToBase64(selectedFile);
    ingestPdf.mutate({ title, organization, sourceUrl, fileName: selectedFile.name, pdfBase64 });
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={cn("brand-pink min-h-screen bg-[#fff8fb] text-slate-900", isArabic && "font-arabic")}>
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur"><div className="container grid grid-cols-[1fr_auto_1fr] items-center py-4"><button onClick={() => navigate(`/?lang=${language}`)} className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800"><ArrowLeft className={cn("size-4 transition group-hover:-translate-x-0.5", isArabic && "rotate-180 group-hover:translate-x-0.5")} />{t.back}</button><div className="hidden items-center gap-2 sm:flex"><span className="flex size-8 items-center justify-center rounded-xl bg-teal-700 text-white"><Network className="size-4" /></span><span><strong className="font-display block text-sm leading-4 tracking-tight">BreastCancerCare RAG</strong><span className="block text-[0.55rem] font-bold uppercase tracking-[0.14em] text-teal-700">Evidence pipeline</span></span></div><button onClick={changeLanguage} className="ms-auto rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-teal-200 hover:text-teal-800">{t.language}</button></div></header>
      <main className="container max-w-6xl py-8 sm:py-12">
        <section className="rounded-[2rem] border border-slate-100 bg-white px-6 py-8 shadow-[0_20px_50px_-30px_rgba(15,47,73,0.3)] sm:px-10 sm:py-11"><p className="eyebrow">{t.eyebrow}</p><h1 className="font-display mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">{t.title}</h1><p className="mt-5 max-w-3xl text-base leading-8 text-slate-600">{t.body}</p><div className="mt-8 grid gap-3 sm:grid-cols-4">{[{ label: t.statsDocs, value: overview.data?.indexedDocumentCount ?? 0, icon: FileText }, { label: t.statsChunks, value: overview.data?.indexedChunkCount ?? 0, icon: Split }, { label: t.statsVectors, value: overview.data?.dimensions ?? 64, icon: BrainCircuit }, { label: t.vectorDb, value: "cosine", icon: Database }].map(item => <div key={item.label} className="rounded-2xl border border-teal-100 bg-teal-50/55 px-4 py-3"><item.icon className="size-4 text-teal-700" /><p className="mt-2 font-display text-xl font-bold text-slate-900">{item.value}</p><p className="mt-0.5 text-xs font-medium text-slate-500">{item.label}</p></div>)}</div></section>

        <section className="mt-8"><div className="mb-4 flex items-end justify-between gap-4"><div><p className="eyebrow">{t.pipeline}</p><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{t.pipelineCaption}</p></div><Workflow className="size-7 text-teal-700" /></div><div className="grid gap-3 md:grid-cols-7">{stages.map((stage, index) => { const Icon = stageIcons[index]; return <div key={stage} className="relative rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><span className="flex size-8 items-center justify-center rounded-xl bg-slate-100 text-teal-800"><Icon className="size-4" /></span><p className="mt-3 text-sm font-bold text-slate-800">{stage}</p>{index < stages.length - 1 && <span className="absolute -end-2 top-1/2 z-10 hidden size-4 -translate-y-1/2 rounded-full bg-teal-600 text-center text-[10px] leading-4 text-white md:block">›</span>}</div>})}</div></section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2"><div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm"><p className="eyebrow">{t.scope}</p><div className="mt-5 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl bg-teal-50 p-4"><h2 className="flex items-center gap-2 font-display font-bold text-teal-900"><CheckCircle2 className="size-4" />{t.included}</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-teal-900/80">{overview.data?.scope.included.map(item => <li key={item}>• {item}</li>)}</ul></div><div className="rounded-2xl bg-rose-50 p-4"><h2 className="flex items-center gap-2 font-display font-bold text-rose-900"><LockKeyhole className="size-4" />{t.excluded}</h2><ul className="mt-3 space-y-2 text-sm leading-6 text-rose-900/80">{overview.data?.scope.excluded.map(item => <li key={item}>• {item}</li>)}</ul></div></div></div><div className="rounded-[1.5rem] border border-teal-100 bg-teal-50/65 p-6"><p className="eyebrow">{t.sourceControl}</p><p className="mt-4 text-sm leading-7 text-slate-600">{t.sourceControlBody}</p><div className="mt-5 flex items-center gap-3 rounded-2xl border border-teal-100 bg-white px-4 py-3 text-sm font-semibold text-teal-900"><ShieldCheck className="size-5 text-teal-700" />WHO · NCI · NCCN</div></div></section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]"><div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm"><p className="eyebrow">{t.retrieval}</p><p className="mt-3 text-sm leading-7 text-slate-600">{t.retrievalBody}</p><div className="mt-5 flex gap-2"><Input value={query} onChange={event => setQuery(event.target.value)} placeholder={t.retrievalPlaceholder} className="h-11 rounded-xl border-slate-200" /><Button className="h-11 rounded-xl bg-teal-700 text-white"><Search className="size-4" /></Button></div><div className="mt-5 space-y-3">{retrieval.isFetching ? <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="size-4 animate-spin" />{t.inProgress}</div> : retrieval.data?.chunks.map(chunk => <div key={chunk.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-800">{chunk.title}</p><span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-bold text-teal-800">d={chunk.distance.toFixed(3)}</span></div><p className="mt-2 text-sm leading-6 text-slate-600">{chunk.content.slice(0, 260)}…</p><p className="mt-2 text-xs font-semibold text-teal-800">{chunk.organization} · p. {chunk.pageFrom}</p></div>)}{!retrieval.isFetching && (!retrieval.data || retrieval.data.chunks.length === 0) && <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">{t.noMatches}</p>}</div></div>
          <div className="rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm"><p className="eyebrow">{t.documents}</p><p className="mt-3 text-sm leading-7 text-slate-600">{t.documentsCaption}</p><div className="mt-5 space-y-3">{overview.data?.documents.map(document => <a key={document.id} href={document.storageUrl} target="_blank" rel="noreferrer" className="block rounded-2xl border border-slate-100 p-4 transition hover:border-teal-200 hover:bg-teal-50/40"><div className="flex items-center justify-between gap-3"><p className="font-semibold text-slate-800">{document.title}</p><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">{document.status}</span></div><p className="mt-2 text-xs text-slate-500">{document.organization} · {document.pageCount} {t.pages} · {document.chunkCount} {t.chunks}</p></a>)}{!overview.data?.documents.length && <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">{t.empty}</p>}</div></div></section>

        <section className="mt-10 rounded-[1.5rem] border border-slate-100 bg-slate-950 p-6 text-white shadow-xl sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="eyebrow !text-teal-300">{t.administrator}</p><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">{t.adminBody}</p></div>{!isAuthenticated && <Button onClick={startLogin} className="shrink-0 rounded-xl bg-teal-400 text-slate-950 hover:bg-teal-300"><LockKeyhole className="size-4" />{t.signIn}</Button>}</div>{isAuthenticated && user?.role === "admin" && <div className="mt-7 grid gap-3 md:grid-cols-2"><Input value={title} onChange={event => setTitle(event.target.value)} placeholder={t.titleLabel} className="h-11 border-white/15 bg-white/10 text-white placeholder:text-slate-400" /><Input value={organization} onChange={event => setOrganization(event.target.value)} placeholder={t.organization} className="h-11 border-white/15 bg-white/10 text-white placeholder:text-slate-400" /><Input value={sourceUrl} onChange={event => setSourceUrl(event.target.value)} placeholder={t.sourceUrl} className="h-11 border-white/15 bg-white/10 text-white placeholder:text-slate-400 md:col-span-2" /><div className="flex flex-wrap items-center gap-3 md:col-span-2"><Button disabled={busy} onClick={() => ingestUrl.mutate({ title, organization, sourceUrl })} className="rounded-xl bg-teal-400 text-slate-950 hover:bg-teal-300">{busy ? <Loader2 className="size-4 animate-spin" /> : <FileSearch className="size-4" />}{t.ingestUrl}</Button><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white"><Upload className="size-4" />{selectedFile ? selectedFile.name : t.selectPdf}<input type="file" accept="application/pdf" className="hidden" onChange={event => setSelectedFile(event.target.files?.[0] ?? null)} /></label><Button disabled={busy || !selectedFile} onClick={beginUpload} variant="outline" className="rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10">{t.uploadPdf}</Button></div>{notice && <p className="text-sm text-teal-200 md:col-span-2">{notice}</p>}</div>}{isAuthenticated && user?.role !== "admin" && <p className="mt-5 text-sm text-amber-200">Administrator role required for ingestion.</p>}</section>
      </main>
    </div>
  );
}
