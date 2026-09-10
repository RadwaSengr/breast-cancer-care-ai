import { AIChatBox, type ChatAlert, type PatientMessage } from "@/components/AIChatBox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, HeartHandshake, Languages, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";

const copy = {
  en: {
    back: "Back to overview", language: "العربية", label: "Your BreastCancerCare AI conversation", title: "Ask with confidence.",
    subtitle: "This space is for general, source-grounded education—not diagnosis or individualized medical advice.",
    banner: "Educational assistant only. It does not replace your doctor, surgeon, oncology nurse, or emergency services.",
    privacy: "This conversation is saved to this browser session so you can return to it.", composerPlaceholder: "Type your question about breast cancer care…",
    send: "Send question", thinking: "Finding source-grounded guidance…", emptyTitle: "What would you like to understand?",
    emptyBody: "You can ask about preparing for appointments, general recovery support, or when to contact your care team.",
    suggestedTitle: "You may also want to ask", messageDisclaimer: "Educational information only. This answer does not diagnose symptoms or replace guidance from your own clinical team.",
    sources: "Sources in this answer", questionSources: "Question sources", questionSourcesNote: "Trusted source excerpts used to understand your question", feedbackPrompt: "Was this helpful?", feedbackUp: "Helpful", feedbackDown: "Not helpful", clearOnExit: "Clear this chat when I leave", clearOnExitHelp: "Keeps this browser-session conversation private after you exit.", historyLoading: "Restoring your conversation…", error: "We could not complete that response. Please try again. If your symptoms feel urgent, contact your care team now.",
  },
  ar: {
    back: "العودة إلى الصفحة التعريفية", language: "English", label: "محادثة BreastCancerCare AI", title: "اطرحي سؤالك بثقة.",
    subtitle: "هذه المساحة للتثقيف العام الموثق بالمصادر، وليست للتشخيص أو النصيحة الطبية الفردية.",
    banner: "هذا مساعد تعليمي فقط. لا يحل محل طبيبك أو الجرّاح أو ممرضة الأورام أو خدمات الطوارئ.",
    privacy: "يُحفظ هذا الحوار في جلسة المتصفح لتتمكني من العودة إليه.", composerPlaceholder: "اكتبي سؤالك عن رحلة سرطان الثدي…",
    send: "إرسال السؤال", thinking: "أبحث عن توجيه موثق بالمصادر…", emptyTitle: "ما الذي تودين فهمه؟",
    emptyBody: "يمكنك السؤال عن التحضير للمواعيد أو الدعم العام للتعافي أو متى تتواصلين مع فريق الرعاية.",
    suggestedTitle: "قد ترغبين أيضًا في السؤال", messageDisclaimer: "هذه معلومات تعليمية فقط. لا تشخّص الإجابة الأعراض ولا تحل محل إرشاد فريقك الطبي.",
    sources: "مصادر هذه الإجابة", questionSources: "مصادر السؤال", questionSourcesNote: "مقتطفات من مصادر موثوقة استُخدمت لفهم سؤالك", feedbackPrompt: "هل كانت هذه الإجابة مفيدة؟", feedbackUp: "مفيدة", feedbackDown: "غير مفيدة", clearOnExit: "امسحي هذه الدردشة عند المغادرة", clearOnExitHelp: "يبقي محادثة جلسة المتصفح هذه أكثر خصوصية بعد الخروج.", historyLoading: "أستعيد محادثتك…", error: "تعذر إكمال هذه الإجابة. حاولي مرة أخرى. إذا بدت الأعراض عاجلة، تواصلي مع فريق رعايتك الآن.",
  },
} as const;

function newSessionId() {
  const key = "aftercare-session-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const created = window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(key, created);
  return created;
}

export default function Chat() {
  const [, navigate] = useLocation();
  const [language, setLanguage] = useState<"ar" | "en">(() => new URLSearchParams(window.location.search).get("lang") === "ar" ? "ar" : "en");
  const isArabic = language === "ar";
  const t = copy[language];
  const [sessionId] = useState(newSessionId);
  const [messages, setMessages] = useState<PatientMessage[]>([]);
  const [clearOnExit, setClearOnExit] = useState(() => window.localStorage.getItem("aftercare-clear-on-exit") === "true");
  const hydratedRef = useRef(false);
  const utils = trpc.useUtils();
  const history = trpc.aftercare.history.useQuery({ sessionId });

  useEffect(() => {
    if (!history.data || hydratedRef.current) return;
    hydratedRef.current = true;
    setMessages(history.data.messages.map(message => ({
      id: message.id,
      role: message.role,
      content: message.content,
      citations: message.citations,
      questionSources: typeof message === "object" && message !== null && "questionSources" in message && Array.isArray(message.questionSources) ? message.questionSources : undefined,
      suggestedQuestions: message.suggestedQuestions,
      alert: message.alert as ChatAlert | null,
      feedback: message.feedback,
    })));
  }, [history.data]);

  const chat = trpc.aftercare.chat.useMutation({
    onSuccess: (response) => {
      setMessages(current => [...current, {
        id: response.messageId ?? `assistant-${Date.now()}`,
        role: "assistant",
        content: response.answer,
        citations: response.citations,
        questionSources: response.questionSources,
        suggestedQuestions: response.suggestedQuestions,
        alert: response.alert as ChatAlert | null,
        feedback: null,
      }]);
      void utils.aftercare.history.invalidate({ sessionId });
    },
    onError: () => {
      setMessages(current => [...current, { id: `error-${Date.now()}`, role: "assistant", content: t.error, suggestedQuestions: [] }]);
    },
  });

  const feedback = trpc.aftercare.feedback.useMutation({
    onSuccess: (result, variables) => {
      if (!result.saved) return;
      setMessages(current => current.map(message => message.id === variables.messageId ? { ...message, feedback: variables.feedback } : message));
    },
  });

  const clear = trpc.aftercare.clear.useMutation();

  useEffect(() => {
    if (!clearOnExit) return;
    const clearDuringPageExit = () => {
      window.localStorage.removeItem("aftercare-session-id");
      void fetch("/api/trpc/aftercare.clear?batch=1", {
        method: "POST",
        credentials: "include",
        keepalive: true,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ 0: { json: { sessionId } } }),
      });
    };
    window.addEventListener("pagehide", clearDuringPageExit);
    return () => window.removeEventListener("pagehide", clearDuringPageExit);
  }, [clearOnExit, sessionId]);

  const send = (message: string) => {
    if (!message.trim() || chat.isPending) return;
    setMessages(current => [...current, { id: `user-${Date.now()}`, role: "user", content: message }]);
    chat.mutate({ sessionId, language, message });
  };

  const switchLanguage = () => {
    const nextLanguage = language === "en" ? "ar" : "en";
    setLanguage(nextLanguage);
    window.history.replaceState({}, "", `/chat?lang=${nextLanguage}`);
  };

  const toggleClearOnExit = (checked: boolean) => {
    setClearOnExit(checked);
    window.localStorage.setItem("aftercare-clear-on-exit", String(checked));
  };

  const leaveChat = () => {
    if (!clearOnExit) {
      navigate(`/?lang=${language}`);
      return;
    }
    clear.mutate({ sessionId }, {
      onSettled: () => {
        window.localStorage.removeItem("aftercare-session-id");
        navigate(`/?lang=${language}`);
      },
    });
  };

  return (
    <div dir={isArabic ? "rtl" : "ltr"} className={cn("brand-pink min-h-screen bg-[#fff8fb] text-slate-900", isArabic && "font-arabic")}>
      <header className="border-b border-slate-100 bg-white/85 backdrop-blur"><div className="container grid grid-cols-[1fr_auto_1fr] items-center py-4"><button onClick={leaveChat} disabled={clear.isPending} className="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-teal-800 disabled:opacity-50"><ArrowLeft className={cn("size-4 transition group-hover:-translate-x-0.5", isArabic && "rotate-180 group-hover:translate-x-0.5")} />{t.back}</button><div className="hidden items-center gap-2 sm:flex"><span className="flex size-8 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm"><HeartHandshake className="size-4" /></span><span><strong className="font-display block text-sm leading-4 tracking-tight">BreastCancerCare</strong><span className="block text-[0.55rem] font-bold uppercase tracking-[0.14em] text-teal-700">AI Assistant</span></span></div><button onClick={switchLanguage} className="ms-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:text-teal-800"><Languages className="size-4" />{t.language}</button></div></header>
      <main className="container max-w-6xl py-8 sm:py-12">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-teal-700"><HeartHandshake className="size-4" />{t.label}</div><h1 className="font-display text-3xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-4xl">{t.title}</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{t.subtitle}</p></div><p className="max-w-xs text-start text-xs leading-5 text-slate-500">{t.privacy}</p></div>

        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-amber-950 shadow-sm" role="note"><ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-700" /><p className="text-sm font-medium leading-6">{t.banner}</p></div>
        <label className="mb-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-3.5 text-start shadow-sm"><span><span className="block text-sm font-bold text-slate-700">{t.clearOnExit}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{t.clearOnExitHelp}</span></span><input type="checkbox" checked={clearOnExit} onChange={event => toggleClearOnExit(event.target.checked)} className="size-4 shrink-0 accent-teal-700" /></label>

        <AIChatBox messages={messages} onSendMessage={send} onFollowUp={send} onFeedback={(messageId, value) => feedback.mutate({ sessionId, messageId, feedback: value })} isLoading={chat.isPending} disabled={history.isLoading} language={language} copy={{ ...t, emptyBody: history.isLoading ? t.historyLoading : t.emptyBody }} />
      </main>
    </div>
  );
}
