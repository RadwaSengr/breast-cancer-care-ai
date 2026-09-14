import { AIChatBox, type PatientMessage } from "@/components/AIChatBox";
import { DoctorVisitPrepModal } from "@/components/DoctorVisitPrepModal";
import { cn } from "@/lib/utils";
import { answerFromBundledSources } from "@/lib/staticRag";
import { trpc } from "@/lib/trpc";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  HeartHandshake,
  Languages,
  Printer,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";

const copy = {
  en: {
    back: "Back to overview",
    language: "العربية",
    label: "Your BreastCancerCare AI conversation",
    title: "Ask with confidence.",
    subtitle: "This space is for general, source-grounded education—not diagnosis or individualized medical advice.",
    banner: "Educational assistant only. It does not replace your doctor, surgeon, oncology nurse, or emergency services.",
    privacy: "This conversation is saved to this browser session so you can return to it.",
    composerPlaceholder: "Type your question about breast cancer care…",
    send: "Send question",
    thinking: "Finding source-grounded guidance…",
    emptyTitle: "What would you like to understand?",
    emptyBody: "You can ask about preparing for appointments, general recovery support, or when to contact your care team.",
    suggestedTitle: "You may also want to ask",
    messageDisclaimer: "Educational information only. This answer does not diagnose symptoms or replace guidance from your own clinical team.",
    sources: "Sources in this answer",
    questionSources: "Question sources",
    questionSourcesNote: "Trusted source excerpts used to understand your question",
    feedbackPrompt: "Was this helpful?",
    feedbackUp: "Helpful",
    feedbackDown: "Not helpful",
    clearOnExit: "Clear this chat when I leave",
    clearOnExitHelp: "Keeps this browser-session conversation private after you exit.",
    historyLoading: "Restoring your conversation…",
    error: "We could not complete that response. Please try again. If your symptoms feel urgent, contact your care team now.",
    clearHistory: "Clear conversation",
    clearConfirm: "Are you sure you want to clear all messages in this session?",
    printChat: "Print for doctor visit",
    copyAnswer: "Copy answer",
    copied: "Copied!",
    voiceInput: "Voice input",
    voiceListening: "Listening… Speak now",
    voiceUnsupported: "Voice recognition is not supported in this browser",
    modeAi: "AI Companion Active",
    modeBundled: "Verified Knowledge Base",
  },
  ar: {
    back: "العودة إلى الصفحة التعريفية",
    language: "English",
    label: "محادثة BreastCancerCare AI",
    title: "اطرحي سؤالكِ بثقة.",
    subtitle: "هذه المساحة للتثقيف العام الموثق بالمصادر، وليست للتشخيص أو النصيحة الطبية الفردية.",
    banner: "هذا مساعد تعليمي فقط. لا يحل محل طبيبك أو الجرّاح أو ممرضة الأورام أو خدمات الطوارئ.",
    privacy: "يُحفظ هذا الحوار في جلسة المتصفح لتتمكني من العودة إليه.",
    composerPlaceholder: "اكتبي سؤالكِ عن رحلة سرطان الثدي أو اضغطي الميكروفون للتحدث…",
    send: "إرسال السؤال",
    thinking: "أبحث عن توجيه موثق بالمصادر…",
    emptyTitle: "ما الذي تودين فهمه؟",
    emptyBody: "يمكنكِ السؤال عن التحضير للمواعيد أو الدعم العام للتعافي أو متى تتواصلين مع فريق الرعاية.",
    suggestedTitle: "قد ترغبين أيضًا في السؤال",
    messageDisclaimer: "هذه معلومات تعليمية فقط. لا تشخّص الإجابة الأعراض ولا تحل محل إرشاد فريقكِ الطبي.",
    sources: "مصادر هذه الإجابة",
    questionSources: "مصادر السؤال",
    questionSourcesNote: "مقتطفات من مصادر موثوقة استُخدمت لفهم سؤالكِ",
    feedbackPrompt: "هل كانت هذه الإجابة مفيدة؟",
    feedbackUp: "مفيدة",
    feedbackDown: "غير مفيدة",
    clearOnExit: "امسحي هذه الدردشة عند المغادرة",
    clearOnExitHelp: "يبقي محادثة جلسة المتصفح هذه أكثر خصوصية بعد الخروج.",
    historyLoading: "أستعيد محادثتكِ…",
    error: "تعذر إكمال هذه الإجابة. حاولي مرة أخرى. إذا بدت الأعراض عاجلة، تواصلي مع فريق رعايتكِ الآن.",
    clearHistory: "مسح المحادثة",
    clearConfirm: "هل تودين مسح جميع رسائل هذه المحادثة؟",
    printChat: "طباعة المحادثة للموعد الطبي",
    copyAnswer: "نسخ الإجابة",
    copied: "تم النسخ!",
    voiceInput: "إدخال صوتي",
    voiceListening: "أستمع إليكِ الآن... تكلّمي",
    voiceUnsupported: "خاصية التعرف على الصوت غير مدعومة في هذا المتصفح",
    modeAi: "مساعد الذكاء الاصطناعي متصل",
    modeBundled: "قاعدة المعرفة الطبية الموثقة",
  },
} as const;

function newSessionId() {
  const key = "aftercare-session-id";
  const existing = typeof window !== "undefined" ? window.localStorage.getItem(key) : null;
  if (existing) return existing;
  const created = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  if (typeof window !== "undefined") window.localStorage.setItem(key, created);
  return created;
}

export default function Chat() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<"ar" | "en">(() =>
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en"
  );
  const isArabic = language === "ar";
  const t = copy[language];
  const [sessionId] = useState(newSessionId);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [clearOnExit, setClearOnExit] = useState(() =>
    typeof window !== "undefined" ? window.localStorage.getItem("aftercare-clear-on-exit") === "true" : false
  );
  const [isThinking, setIsThinking] = useState(false);
  const [engineMode, setEngineMode] = useState<"ai" | "bundled">("bundled");
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);

  const chatMutation = trpc.aftercare.chat.useMutation();
  const feedbackMutation = trpc.aftercare.feedback.useMutation();
  const clearMutation = trpc.aftercare.clear.useMutation();

  useEffect(() => {
    const saved = window.localStorage.getItem(`aftercare-static-messages-${sessionId}`);
    if (!saved) return;
    try {
      setMessages(JSON.parse(saved) as PatientMessage[]);
    } catch {
      window.localStorage.removeItem(`aftercare-static-messages-${sessionId}`);
    }
  }, [sessionId]);

  useEffect(() => {
    if (messages.length) {
      window.localStorage.setItem(`aftercare-static-messages-${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  useEffect(() => {
    if (!clearOnExit) return;
    const clearDuringPageExit = () => {
      window.localStorage.removeItem("aftercare-session-id");
      window.localStorage.removeItem(`aftercare-static-messages-${sessionId}`);
    };
    window.addEventListener("pagehide", clearDuringPageExit);
    return () => window.removeEventListener("pagehide", clearDuringPageExit);
  }, [clearOnExit, sessionId]);

  const send = async (message: string) => {
    if (!message.trim() || isThinking) return;
    const userMsg: PatientMessage = { id: `user-${Date.now()}`, role: "user", content: message };
    setMessages(current => [...current, userMsg]);
    setIsThinking(true);

    try {
      // First attempt full tRPC AI response
      const response = await chatMutation.mutateAsync({
        sessionId,
        language,
        message,
      });

      setEngineMode("ai");
      setMessages(current => [
        ...current,
        {
          id: response.messageId ?? `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          citations: response.citations,
          questionSources: response.questionSources,
          suggestedQuestions: response.suggestedQuestions,
          alert: response.alert,
          feedback: null,
        },
      ]);
    } catch {
      // Graceful instant fallback to bundled sources (works offline / static / no backend)
      setEngineMode("bundled");
      const response = answerFromBundledSources(message, language);
      setMessages(current => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: response.answer,
          citations: response.citations,
          suggestedQuestions: response.suggestedQuestions,
          feedback: null,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleFeedback = (messageId: string | number, feedback: "up" | "down") => {
    setMessages(current =>
      current.map(msg => (msg.id === messageId ? { ...msg, feedback } : msg))
    );
    if (typeof messageId === "number") {
      feedbackMutation.mutate({
        sessionId,
        messageId,
        feedback,
      });
    }
  };

  const handleClearHistory = () => {
    if (!window.confirm(t.clearConfirm)) return;
    setMessages([]);
    window.localStorage.removeItem(`aftercare-static-messages-${sessionId}`);
    clearMutation.mutate({ sessionId });
  };

  const handlePrint = () => {
    window.print();
  };

  const switchLanguage = () => {
    const nextLanguage = language === "en" ? "ar" : "en";
    setLanguage(nextLanguage);
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("lang", nextLanguage);
    window.history.replaceState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
  };

  const toggleClearOnExit = (checked: boolean) => {
    setClearOnExit(checked);
    window.localStorage.setItem("aftercare-clear-on-exit", String(checked));
  };

  const leaveChat = () => {
    if (clearOnExit) {
      window.localStorage.removeItem("aftercare-session-id");
      window.localStorage.removeItem(`aftercare-static-messages-${sessionId}`);
    }
    navigate(`/?lang=${language}`);
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={cn("brand-pink min-h-screen bg-[#fff8fb] text-slate-900", isArabic && "font-arabic")}>
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur print:hidden">
        <div className="container grid grid-cols-[1fr_auto_1fr] items-center py-4">
          <button
            onClick={leaveChat}
            className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800"
          >
            <ArrowLeft className={cn("size-4 transition group-hover:-translate-x-0.5", isArabic && "rotate-180 group-hover:translate-x-0.5")} />
            {t.back}
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="flex size-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
              <HeartHandshake className="size-4" />
            </span>
            <span>
              <strong className="font-display block text-sm leading-4 tracking-tight">BreastCancerCare</strong>
              <span className="block text-[0.55rem] font-bold uppercase tracking-[0.14em] text-teal-700">AI Assistant</span>
            </span>
          </div>

          <div className="ms-auto flex items-center gap-2">
            <button
              onClick={switchLanguage}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-800"
            >
              <Languages className="size-4" />
              {t.language}
            </button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl py-8 sm:py-12">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-teal-700">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 px-3 py-1 text-teal-800 border border-teal-100">
                <HeartHandshake className="size-3.5" />
                {t.label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] font-semibold text-slate-600">
                {engineMode === "ai" ? (
                  <>
                    <Sparkles className="size-3 text-pink-600" />
                    {t.modeAi}
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-3 text-teal-700" />
                    {t.modeBundled}
                  </>
                )}
              </span>
            </div>

            <h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">
              {t.title}
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => setIsPrepModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-teal-200 bg-teal-50/70 px-3 py-2 text-xs font-bold text-teal-800 shadow-sm transition hover:bg-teal-100 hover:border-teal-300"
              title={isArabic ? "تجهيز أسئلة موعد الطبيب" : "Doctor visit prep"}
            >
              <ClipboardList className="size-3.5 text-pink-700" />
              <span>{isArabic ? "تجهيز أسئلة الطبيب" : "Doctor Visit Prep"}</span>
            </button>
            {messages.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                  title={t.printChat}
                >
                  <Printer className="size-3.5" />
                  <span>{t.printChat}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50"
                  title={t.clearHistory}
                >
                  <Trash2 className="size-3.5" />
                  <span>{t.clearHistory}</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-950 shadow-sm" role="note">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700" />
          <p className="text-sm font-medium leading-6">{t.banner}</p>
        </div>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 text-start shadow-sm print:hidden">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={clearOnExit}
              onChange={event => toggleClearOnExit(event.target.checked)}
              className="size-4 shrink-0 accent-teal-700"
            />
            <span>
              <span className="block text-sm font-bold text-slate-700">{t.clearOnExit}</span>
              <span className="mt-0.5 block text-xs leading-5 text-slate-500">{t.clearOnExitHelp}</span>
            </span>
          </label>
          <span className="text-xs text-slate-400">{t.privacy}</span>
        </div>

        <AIChatBox
          messages={messages}
          onSendMessage={send}
          onFollowUp={send}
          onFeedback={handleFeedback}
          isLoading={isThinking}
          disabled={false}
          language={language}
          copy={t}
        />
      </main>

      <DoctorVisitPrepModal
        isOpen={isPrepModalOpen}
        onClose={() => setIsPrepModalOpen(false)}
        onAskAi={send}
        language={language}
      />
    </div>
  );
}
